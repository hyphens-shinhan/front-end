'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import ProfileCard from "../mypage/ProfileCard";
import { useMyProfile } from "@/hooks/user/useUser";
import ProfileSkeleton from "../mypage/ProfileSkeleton";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";

const DRAG_LIMIT_UP = -100;
const DRAG_LIMIT_DOWN = 60;

export default function ProfileCardWithQR() {
  const y = useMotionValue(0);
  const { data: profile, isLoading, error } = useMyProfile();

  const handleDragEnd = () => {
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
  };

  if (isLoading) return <ProfileSkeleton />;
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
      {/** 드래그 바 */}
      <div className={styles.dragBar} />
      <div className={styles.profileCardContainer}>
        {/** QR 코드가 있는 프로필 카드 */}
        <ProfileCard profile={profile} isMyProfile={true} />
        {/** QR 코드 버튼 */}
        <button type="button" className={styles.qrCodeButton}>
          <Icon name='IconLBoldQrcode' className={styles.qrCodeButtonIcon} />
        </button>
      </div>
    </motion.div>
  );
}

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