'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyMentorProfile, useUpdateMentorProfile } from '@/hooks/mentoring/useMentoring';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MentorProfileEditPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useMyMentorProfile();
  const updateProfile = useUpdateMentorProfile();

  const [introduction, setIntroduction] = useState('');
  const [affiliation, setAffiliation] = useState('');

  useEffect(() => {
    if (profile) {
      setIntroduction(profile.bio ?? '');
      setAffiliation(profile.university ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        introduction: introduction.trim() || null,
        affiliation: affiliation.trim() || null,
      });
      router.push(ROUTES.MENTOR_DASHBOARD.PROFILE);
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-[14px] text-grey-5">로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-white px-4 py-20">
        <p className="text-[14px] text-grey-5">프로필을 불러올 수 없어요.</p>
        <Link
          href={ROUTES.MENTOR_DASHBOARD.PROFILE}
          className="mt-4 text-[14px] font-medium text-primary-shinhanblue"
        >
          프로필로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="affiliation"
              className="block text-[14px] font-semibold text-grey-10"
            >
              소속
            </label>
            <input
              id="affiliation"
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="소속을 입력하세요"
              className="mt-1.5 w-full rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 placeholder:text-grey-5 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
            />
          </div>
          <div>
            <label
              htmlFor="introduction"
              className="block text-[14px] font-semibold text-grey-10"
            >
              소개
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="자기소개를 입력하세요"
              rows={5}
              className="mt-1.5 w-full resize-none rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 placeholder:text-grey-5 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
            />
          </div>
          <div className="flex gap-3">
            <Link
              href={ROUTES.MENTOR_DASHBOARD.PROFILE}
              className={cn(
                'flex-1 rounded-xl border border-grey-2 bg-white py-3 text-center text-[14px] font-semibold text-grey-10',
                'hover:bg-grey-2 transition-colors'
              )}
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className={cn(
                'flex-1 rounded-xl bg-primary-shinhanblue py-3 text-[14px] font-semibold text-white',
                'disabled:opacity-50'
              )}
            >
              {updateProfile.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
