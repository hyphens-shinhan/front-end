'use client';

import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 홈 프로필 카드+QR 로딩 스켈레톤 (ProfileCardWithQR와 동일 레이아웃) */
export default function ProfileCardWithQRSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.dragBar} />
      <div className={styles.profileCardContainer}>
        <Skeleton.Container className={styles.card}>
          <Skeleton.Circle className="w-20 h-20 shrink-0" />
          <div className={styles.info}>
            <Skeleton.Box className="w-24 h-6" />
            <div className={styles.tags}>
              <Skeleton.Tag className="w-12 h-6" />
              <Skeleton.Tag className="w-16 h-6" />
              <Skeleton.Tag className="w-20 h-6" />
            </div>
          </div>
        </Skeleton.Container>
        <div className={styles.qrPlaceholder} aria-hidden />
      </div>
    </div>
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
  card: cn(
    'flex gap-6 items-center',
  ),
  info: cn(
    'flex flex-col gap-3',
  ),
  tags: cn(
    'flex gap-1.5',
  ),
  qrPlaceholder: cn(
    'absolute top-1/2 right-0 -translate-y-1/2',
    'w-10 h-10 rounded-[16px] bg-grey-3 animate-pulse',
  ),
};
