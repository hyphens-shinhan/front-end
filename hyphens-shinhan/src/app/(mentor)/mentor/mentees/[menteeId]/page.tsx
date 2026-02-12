'use client';

import { useParams, useRouter } from 'next/navigation';
import PublicProfileContent from '@/components/mypage/PublicProfileContent';
import EmptyContent from '@/components/common/EmptyContent';
import { EMPTY_CONTENT_MESSAGES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MenteeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menteeId = typeof params?.menteeId === 'string' ? params.menteeId : '';

  if (!menteeId) {
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 뒤로가기 헤더 */}
      <div className={styles.header}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="뒤로"
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>멘티 프로필</h1>
      </div>

      <PublicProfileContent userId={menteeId} />
    </div>
  );
}

const styles = {
  header: cn(
    'flex items-center gap-3 px-4 py-3',
  ),
  backButton: cn(
    'flex h-10 w-10 shrink-0 items-center justify-center',
    'rounded-full text-grey-10',
    'hover:bg-grey-2 active:bg-grey-3 transition-colors',
  ),
  headerTitle: cn(
    'text-[18px] font-bold text-grey-10 truncate',
  ),
};
