'use client';

import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import { useReceivedRequests } from '@/hooks/mentoring/useMentoring';
import { mapRequestToMentorshipForMentor } from '@/services/mentoring';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MentorMenteesPage() {
  const router = useRouter();
  const { data: receivedData, isLoading } = useReceivedRequests({
    status: 'ACCEPTED',
  });

  const mentees = (receivedData?.requests ?? []).map(mapRequestToMentorshipForMentor);

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <h2 className="mb-4 text-[18px] font-bold text-grey-10">나의 멘티</h2>
        {isLoading ? (
          <p className="text-[14px] text-grey-5">불러오는 중...</p>
        ) : mentees.length === 0 ? (
          <p className="text-[14px] text-grey-5">수락한 멘티가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {mentees.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.MENTOR_DASHBOARD.MENTEE_DETAIL(m.menteeId))}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-[16px] border border-grey-2 bg-white p-4 text-left',
                    'hover:bg-grey-1 active:bg-grey-2 transition-colors'
                  )}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Avatar
                      src={m.menteeAvatar}
                      alt={m.menteeName}
                      size={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold text-grey-10">
                      {m.menteeName}
                    </p>
                    <p className="text-[12px] text-grey-5">
                      멘토링 시작: {new Date(m.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
