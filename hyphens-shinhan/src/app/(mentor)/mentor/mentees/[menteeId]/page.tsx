'use client';

import { useParams, useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import { useReceivedRequests } from '@/hooks/mentoring/useMentoring';
import { useCreateOrGetDM } from '@/hooks/chat/useChatMutations';
import { mapRequestToMentorshipForMentor } from '@/services/mentoring';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MenteeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menteeId = typeof params?.menteeId === 'string' ? params.menteeId : '';

  const { data: receivedData, isLoading } = useReceivedRequests({
    status: 'ACCEPTED',
  });
  const createOrGetDM = useCreateOrGetDM();

  const mentees = (receivedData?.requests ?? []).map(mapRequestToMentorshipForMentor);
  const mentee = mentees.find((m) => m.menteeId === menteeId);

  const handleMessage = async () => {
    if (!menteeId) return;
    try {
      const room = await createOrGetDM.mutateAsync(menteeId);
      if (room?.id) router.push(`${ROUTES.MENTOR_DASHBOARD.MESSAGES}/${room.id}`);
    } catch (e) {
      console.error(e);
      router.push(ROUTES.MENTOR_DASHBOARD.MESSAGES);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-white">
        <div className="mx-auto max-w-[800px] px-4 py-6">
          <p className="text-[14px] text-grey-5">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!mentee) {
    return (
      <div className="min-h-full bg-white">
        <div className="mx-auto max-w-[800px] px-4 py-6">
          <p className="mb-2 text-[14px] font-medium text-grey-10">멘티를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.MENTOR_DASHBOARD.MENTEES)}
            className="text-[14px] font-semibold text-primary-shinhanblue hover:underline"
          >
            멘티 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-grey-10 hover:bg-grey-2 active:bg-grey-3 transition-colors"
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
          <h1 className="text-[18px] font-bold text-grey-10 truncate">멘티 프로필</h1>
        </div>

        <div className="rounded-2xl border border-grey-2 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex shrink-0 overflow-hidden rounded-full ring-2 ring-grey-2">
              <Avatar
                src={mentee.menteeAvatar}
                alt={mentee.menteeName}
                size={80}
                className="h-20 w-20 object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-bold text-grey-10">{mentee.menteeName}</h2>
              <p className="mt-1 text-[14px] text-grey-5">
                멘토링 시작: {new Date(mentee.created_at).toLocaleDateString('ko-KR')}
              </p>
              <button
                type="button"
                onClick={handleMessage}
                disabled={createOrGetDM.isPending}
                className={cn(
                  'mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4',
                  'bg-primary-shinhanblue text-[14px] font-semibold text-white',
                  'hover:opacity-95 active:opacity-90 disabled:opacity-50 transition-opacity'
                )}
              >
                {createOrGetDM.isPending ? '연결 중...' : '메시지'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
