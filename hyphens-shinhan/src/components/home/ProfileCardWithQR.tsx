'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import ProfileCard from "../mypage/ProfileCard";
import { useMyProfile } from "@/hooks/user/useUser";
import ProfileCardWithQRSkeleton from "./ProfileCardWithQRSkeleton";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import QRCodeModal from "./QRCodeModal";

const DRAG_LIMIT_UP = -100;
const DRAG_LIMIT_DOWN = 60;

function ProfileCardWithQR() {
  const y = useMotionValue(0);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { data: profile, isLoading, error } = useMyProfile();

  const handleDragEnd = useCallback((_: unknown, info: { offset: { y: number } }) => {
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    if (info.offset.y < 0) setIsQRModalOpen(true);
  }, [y]);

  const openQRModal = useCallback(() => setIsQRModalOpen(true), []);
  const closeQRModal = useCallback(() => setIsQRModalOpen(false), []);

  const profileShareUrl = useMemo(
    () =>
      typeof window !== 'undefined' && profile
        ? `${window.location.origin}/mypage/${profile.id}`
        : '',
    [profile?.id],
  );

  if (isLoading) return <ProfileCardWithQRSkeleton />;
  if (error) return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
  if (!profile) return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;

  return (
    <motion.div
      className={styles.container}
      style={{ y }}
      drag="y"
      dragConstraints={{ top: DRAG_LIMIT_UP, bottom: DRAG_LIMIT_DOWN }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.dragBar} />
      <div className={styles.profileCardContainer}>
        <ProfileCard profile={profile} isMyProfile={true} />
        <button
          type="button"
          className={styles.qrCodeButton}
          onClick={openQRModal}
          aria-label="QR 코드 보기"
        >
          <Icon name="IconLBoldQrcode" className={styles.qrCodeButtonIcon} />
        </button>
      </div>
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={closeQRModal}
        qrValue={profileShareUrl}
      />
    </motion.div>
  );
}

export default memo(ProfileCardWithQR);

const styles = {
  container: cn(
    'relative z-0 flex h-full flex-col px-7 pb-5',
    'bg-primary-lighter rounded-t-[24px]',
  ),
  dragBar: cn(
    'w-9 h-1.5 mx-auto my-3 bg-grey-6 rounded-full',
  ),
  profileCardContainer: cn(
    'relative',
  ),
  qrCodeButton: cn(
    'bg-primary-shinhanblue w-10 h-10 rounded-[16px] flex items-center justify-center',
    'absolute top-1/2 right-0 -translate-y-1/2',
  ),
  qrCodeButtonIcon: cn(
    'text-white',
  ),
}