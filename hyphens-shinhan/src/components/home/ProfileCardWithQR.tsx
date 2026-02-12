'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProfileCard from '../mypage/ProfileCard';
import { useMyProfile } from '@/hooks/user/useUser';
import ProfileCardWithQRSkeleton from './ProfileCardWithQRSkeleton';
import EmptyContent from '../common/EmptyContent';
import { EMPTY_CONTENT_MESSAGES } from '@/constants';
import { cn } from '@/utils/cn';
import { Icon } from '../common/Icon';
import QRInlineContent from './QRInlineContent';

const DRAG_LIMIT_UP = -100;
const DRAG_LIMIT_DOWN = 60;

interface ProfileCardWithQRProps {
  onQRExpandChange?: (expanded: boolean) => void;
}

function ProfileCardWithQR({ onQRExpandChange }: ProfileCardWithQRProps) {
  const router = useRouter();
  const y = useMotionValue(0);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const { data: profile, isLoading, error } = useMyProfile();

  const toggleQR = useCallback(
    (expanded: boolean) => {
      setIsQRExpanded(expanded);
      if (expanded) onQRExpandChange?.(expanded);
    },
    [onQRExpandChange],
  );

  const handleExitComplete = useCallback(() => {
    onQRExpandChange?.(false);
  }, [onQRExpandChange]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number } }) => {
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
      if (info.offset.y < -30 && !isQRExpanded) toggleQR(true);
      if (info.offset.y > 30 && isQRExpanded) toggleQR(false);
    },
    [y, isQRExpanded, toggleQR],
  );

  const openQR = useCallback(() => toggleQR(true), [toggleQR]);
  const closeQR = useCallback(() => toggleQR(false), [toggleQR]);

  const profileShareUrl = useMemo(
    () =>
      typeof window !== 'undefined' && profile
        ? `${window.location.origin}/mypage/${profile.id}`
        : '',
    [profile?.id],
  );

  const handleScanSuccess = useCallback(
    (userId: string) => {
      closeQR();
      router.push(`/mypage/${userId}`);
    },
    [closeQR, router],
  );

  if (isLoading) return <ProfileCardWithQRSkeleton />;
  if (error)
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE}
      />
    );
  if (!profile)
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE}
      />
    );

  return (
    <motion.div
      className={cn(styles.container, isQRExpanded ? 'h-auto pb-8' : '')}
      style={{
        y,
        ...(isQRExpanded
          ? { background: 'linear-gradient(180deg, #E6F2FF 0%, #FFFFFF 100%)' }
          : {}),
      }}
      drag="y"
      dragConstraints={
        isQRExpanded
          ? { top: 0, bottom: DRAG_LIMIT_DOWN }
          : { top: DRAG_LIMIT_UP, bottom: DRAG_LIMIT_DOWN }
      }
      dragElastic={isQRExpanded ? 0.08 : 0.15}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.dragBar} />
      <div className={styles.profileCardContainer}>
        <ProfileCard profile={profile} isMyProfile={true} avatarSize={64} gap={16} />
        <button
          type="button"
          className={cn(styles.qrCodeButton, isQRExpanded && styles.qrExpandedCodeButton)}
          onClick={isQRExpanded ? closeQR : openQR}
          aria-label={isQRExpanded ? 'QR 코드 닫기' : 'QR 코드 보기'}
        >
          {isQRExpanded ?
            <Icon name='IconLBoldFrame' className={styles.qrExpandedCodeButtonIcon} />
            : <Icon name="IconLBoldQrcode" className={styles.qrCodeButtonIcon} />}
        </button>
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {isQRExpanded && (
          <motion.div
            key="qr-inline-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { type: 'spring', stiffness: 500, damping: 40 },
            }}
            className="overflow-hidden"
          >
            <QRInlineContent
              profileShareUrl={profileShareUrl}
              onScanSuccess={handleScanSuccess}
              isActive={isQRExpanded}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(ProfileCardWithQR);

const styles = {
  container: cn(
    'relative z-0 flex h-full flex-col px-7 pb-5',
    'bg-primary-lighter rounded-t-[24px]',
  ),
  dragBar: cn('w-9 h-1.5 mx-auto my-3 bg-grey-6 rounded-full'),
  profileCardContainer: cn('relative'),
  qrCodeButton: cn(
    'bg-primary-shinhanblue w-10 h-10 rounded-[16px] flex items-center justify-center',
    'absolute top-1/2 right-0 -translate-y-1/2',
  ),
  qrCodeButtonIcon: cn('text-white'),
  qrExpandedCodeButtonIcon: cn('text-grey-8'),
  qrExpandedCodeButton: cn('bg-white'),
};
