'use client';

import Link from 'next/link';
import Avatar from '@/components/common/Avatar';
import { useMyMentorProfile } from '@/hooks/mentoring/useMentoring';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MentorProfilePage() {
  const { data: profile, isLoading, isError } = useMyMentorProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-[14px] text-grey-5">프로필을 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-white px-4 py-20">
        <p className="text-[14px] text-grey-5">프로필을 불러올 수 없어요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <div className="rounded-[16px] border border-grey-2 bg-white p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
              <Avatar
                src={profile.avatar}
                alt={profile.name}
                size={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="text-[20px] font-bold text-grey-10">{profile.name}</h2>
              {profile.university && (
                <p className="mt-1 text-[14px] text-grey-5">{profile.university}</p>
              )}
              {profile.bio && (
                <p className="mt-3 text-[14px] font-normal leading-relaxed text-grey-10">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Link
              href={ROUTES.MENTOR_DASHBOARD.PROFILE_EDIT}
              className={cn(
                'rounded-xl border border-grey-2 bg-white px-4 py-2 text-[14px] font-semibold text-grey-10',
                'hover:bg-grey-2 transition-colors'
              )}
            >
              프로필 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
