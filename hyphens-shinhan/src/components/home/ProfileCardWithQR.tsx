'use client';

import { useUserStore } from "@/stores";
import ProfileCard from "../mypage/ProfileCard";
import { useMyProfile } from "@/hooks/user/useUser";
import ProfileSkeleton from "../mypage/ProfileSkeleton";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { cn } from "@/utils/cn";

export default function ProfileCardWithQR() {
  const { data: profile, isLoading, error } = useMyProfile();

  if (isLoading) return <ProfileSkeleton />;
  if (error) return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
  if (!profile) return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;

  return (
    <div className={styles.container}>
      <ProfileCard profile={profile} isMyProfile={true} />
    </div>
  );
}

const styles = {
  container: cn(
    'flex flex-col px-5 py-4.5',
    'bg-primary-lighter rounded-t-[24px]',
  ),
}