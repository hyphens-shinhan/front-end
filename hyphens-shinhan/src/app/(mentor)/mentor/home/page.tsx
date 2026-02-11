'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import {
  useReceivedRequests,
  useAcceptRequest,
  useRejectRequest,
  useMentorStats,
  useUpdateRequestSchedule,
} from '@/hooks/mentoring/useMentoring';
import {
  mapRequestToMentorshipForMentor,
  type MentorshipRequestForMentor,
} from '@/services/mentoring';
import { ROUTES } from '@/constants';
import { useUserStore } from '@/stores';
import { cn } from '@/utils/cn';

const MEETING_METHOD_LABELS: Record<string, string> = {
  ONLINE: '화상',
  OFFLINE: '대면',
  FLEXIBLE: '유연',
}

function getMeetingMethodLabel(method: string | null | undefined): string {
  if (!method) return ''
  return MEETING_METHOD_LABELS[method] ?? method
}

function formatRequestDateTime(req: MentorshipRequestForMentor): string {
  const scheduled = req.scheduled_at
  if (scheduled) {
    try {
      const d = new Date(scheduled)
      if (!Number.isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${pad(d.getHours())}:${pad(d.getMinutes())}`
      }
    } catch {
      // ignore
    }
  }
  const date = req.preferred_date
  const time = req.preferred_time
  if (date && time) return `${date} ${time}`
  if (date) return date
  if (time) return time
  return ''
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

export default function MentorHomePage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [rejectModal, setRejectModal] = useState<{
    requestId: string;
    menteeName: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [scheduleModal, setScheduleModal] = useState<{
    requestId: string;
    menteeName: string;
    scheduled_at: string | null;
    meeting_method: string | null;
  } | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduled_at: '',
    meeting_method: '',
  })

  const { data: receivedData, isLoading: requestsLoading } = useReceivedRequests(
    { status: 'PENDING' }
  );
  const { data: acceptedData } = useReceivedRequests({ status: 'ACCEPTED' });
  const { data: stats, isLoading: statsLoading, isError: statsError } = useMentorStats();
  const acceptMutation = useAcceptRequest();
  const rejectMutation = useRejectRequest();
  const updateScheduleMutation = useUpdateRequestSchedule();

  const requests: MentorshipRequestForMentor[] = (receivedData?.requests ?? []).map(
    mapRequestToMentorshipForMentor
  );
  const acceptedRequests: MentorshipRequestForMentor[] = (acceptedData?.requests ?? []).map(
    mapRequestToMentorshipForMentor
  );
  const activeMenteesCount = acceptedData?.requests?.length ?? 0;
  const upcomingMeetings = stats?.upcoming_meetings ?? 0;
  const totalHours = stats?.total_hours ?? 0;
  const responseRate = stats?.response_rate ?? 0;
  const actionLoading = acceptMutation.isPending || rejectMutation.isPending;
  const loadingId = acceptMutation.variables ?? rejectMutation.variables ?? null;
  const scheduleSaving = updateScheduleMutation.isPending;

  const openScheduleModal = (req: MentorshipRequestForMentor) => {
    setScheduleModal({
      requestId: req.id,
      menteeName: req.menteeName,
      scheduled_at: req.scheduled_at ?? null,
      meeting_method: req.meeting_method ?? null,
    })
    setScheduleForm({
      scheduled_at: toDatetimeLocalValue(req.scheduled_at ?? undefined),
      meeting_method: req.meeting_method ?? '',
    })
  }

  const handleSaveSchedule = async () => {
    if (!scheduleModal) return
    try {
      await updateScheduleMutation.mutateAsync({
        requestId: scheduleModal.requestId,
        body: {
          scheduled_at: scheduleForm.scheduled_at
            ? new Date(scheduleForm.scheduled_at).toISOString()
            : null,
          meeting_method: scheduleForm.meeting_method || null,
        },
      })
      setScheduleModal(null)
      setScheduleForm({ scheduled_at: '', meeting_method: '' })
    } catch (e) {
      console.error(e)
      alert('일정 저장에 실패했습니다.')
    }
  }

  const handleAccept = async (req: MentorshipRequestForMentor) => {
    try {
      await acceptMutation.mutateAsync(req.id);
      router.push(ROUTES.MENTOR_DASHBOARD.CALENDAR);
    } catch (e) {
      console.error(e);
      alert('수락 처리에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    try {
      await rejectMutation.mutateAsync(rejectModal.requestId);
      setRejectModal(null);
      setRejectReason('');
    } catch (e) {
      console.error(e);
      alert('거절 처리에 실패했습니다.');
    }
  };

  const displayName = user?.name ?? '멘토';

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-6 sm:py-8">
        <header className="mb-6 flex flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[20px] font-bold leading-tight text-grey-10">
              {displayName}님
            </h1>
            <p className="mt-1.5 text-[16px] font-normal leading-relaxed text-grey-5">
              오늘도 멘티들과 함께 성장하는 하루 되세요
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(ROUTES.MENTOR_DASHBOARD.MENTEES)}
            className={cn(
              'h-10 shrink-0 rounded-xl px-5 text-[14px] font-semibold text-white',
              'bg-primary-shinhanblue active:opacity-90 transition-opacity'
            )}
          >
            멘티 보기
          </button>
        </header>

        {/* Stats — from GET /mentoring/stats (NEXT_PUBLIC_API_BASE_URL) */}
        <section className="mb-8">
          {statsError && (
            <p className="mb-3 text-[13px] text-red-600">
              통계를 불러오지 못했습니다. API 연결을 확인하세요 (
              {typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : ''})
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col justify-between rounded-2xl border border-grey-2 bg-grey-1/50 p-4 sm:p-5">
              <p className="text-[13px] font-medium text-grey-5">활성 멘티</p>
              <p className="mt-2 text-[22px] font-bold tabular-nums leading-none text-grey-10">
                {statsLoading ? '—' : activeMenteesCount}
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-grey-2 bg-grey-1/50 p-4 sm:p-5">
              <p className="text-[13px] font-medium text-grey-5">다가오는 미팅</p>
              <p className="mt-2 text-[22px] font-bold tabular-nums leading-none text-grey-10">
                {statsLoading ? '—' : upcomingMeetings}
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-grey-2 bg-grey-1/50 p-4 sm:p-5">
              <p className="text-[13px] font-medium text-grey-5">총 멘토링 시간</p>
              <p className="mt-2 text-[22px] font-bold tabular-nums leading-none text-grey-10">
                {statsLoading ? '—' : totalHours}
                <span className="ml-1 text-[14px] font-medium text-grey-5">시간</span>
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-grey-2 bg-grey-1/50 p-4 sm:p-5">
              <p className="text-[13px] font-medium text-grey-5">응답률</p>
              <p className="mt-2 text-[22px] font-bold tabular-nums leading-none text-grey-10">
                {statsLoading ? '—' : responseRate}
                <span className="ml-1 text-[14px] font-medium text-grey-5">%</span>
              </p>
            </div>
          </div>
        </section>

        {/* Pending requests */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-grey-10">멘토링 요청</h2>
            {!requestsLoading && requests.length > 0 && (
              <span className="rounded-full bg-primary-shinhanblue/10 px-2.5 py-0.5 text-[12px] font-semibold text-primary-shinhanblue">
                {requests.length}건
              </span>
            )}
          </div>
          {requestsLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-grey-2 bg-grey-1/30 p-5">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-grey-3" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-grey-3" />
                <div className="h-3 w-full max-w-[200px] animate-pulse rounded bg-grey-3" />
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-grey-2 border-dashed bg-grey-1/30 py-12 text-center">
              <p className="text-[14px] font-medium text-grey-5">대기 중인 요청이 없습니다</p>
              <p className="mt-1 text-[13px] text-grey-5">새 요청이 들어오면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <article
                  key={req.id}
                  className="overflow-hidden rounded-2xl border border-grey-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="h-12 w-12 shrink-0 rounded-full ring-2 ring-grey-2 overflow-hidden">
                        <Avatar
                          src={req.menteeAvatar}
                          alt={req.menteeName}
                          size={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium uppercase tracking-wide text-primary-shinhanblue">
                          멘토링 요청
                        </p>
                        <p className="mt-0.5 text-[16px] font-bold leading-snug text-grey-10">
                          {req.menteeName}님
                        </p>
                        {req.message && (
                          <div className="mt-2 rounded-xl border-l-2 border-grey-3 bg-grey-1/60 pl-3 pr-2 py-2">
                            <p className="line-clamp-3 text-[14px] font-normal leading-relaxed text-grey-6">
                              {req.message}
                            </p>
                          </div>
                        )}
                        {(req.preferred_date || req.preferred_time || req.preferred_meeting_method) && (
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-grey-6">
                            {(req.preferred_date || req.preferred_time) && (
                              <span>
                                {formatRequestDateTime(req)}
                              </span>
                            )}
                            {req.preferred_meeting_method && (
                              <span className="rounded-full bg-grey-2 px-2 py-0.5 font-medium text-grey-7">
                                {getMeetingMethodLabel(req.preferred_meeting_method)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 border-t border-grey-2 pt-4 sm:border-t-0 sm:border-l sm:border-grey-2 sm:pl-5 sm:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          setRejectModal({ requestId: req.id, menteeName: req.menteeName })
                        }
                        disabled={!!actionLoading}
                        className="min-h-[44px] flex-1 rounded-xl border border-grey-3 px-4 text-[14px] font-semibold text-grey-6 transition-colors hover:bg-grey-2 hover:border-grey-4 disabled:opacity-50 sm:flex-none sm:min-w-[88px]"
                      >
                        거절
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(req)}
                        disabled={!!actionLoading}
                        className="min-h-[44px] flex-1 rounded-xl bg-primary-shinhanblue px-4 text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50 sm:flex-none sm:min-w-[88px]"
                      >
                        {loadingId === req.id ? '처리 중...' : '수락'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Accepted requests — 일정 표시 + 수정 */}
        {acceptedRequests.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-[16px] font-bold text-grey-10">수락된 요청</h2>
            <div className="space-y-4">
              {acceptedRequests.map((req) => (
                <article
                  key={req.id}
                  className="overflow-hidden rounded-2xl border border-grey-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="h-12 w-12 shrink-0 rounded-full ring-2 ring-grey-2 overflow-hidden">
                        <Avatar
                          src={req.menteeAvatar}
                          alt={req.menteeName}
                          size={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium uppercase tracking-wide text-primary-shinhanblue">
                          수락됨
                        </p>
                        <p className="mt-0.5 text-[16px] font-bold leading-snug text-grey-10">
                          {req.menteeName}님
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-grey-6">
                          {formatRequestDateTime(req) && (
                            <span>{formatRequestDateTime(req)}</span>
                          )}
                          {(req.meeting_method || req.preferred_meeting_method) && (
                            <span className="rounded-full bg-grey-2 px-2 py-0.5 font-medium text-grey-7">
                              {getMeetingMethodLabel(req.meeting_method ?? req.preferred_meeting_method)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center border-t border-grey-2 pt-4 sm:border-t-0 sm:border-l sm:border-grey-2 sm:pl-5 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => openScheduleModal(req)}
                        disabled={scheduleSaving}
                        className="min-h-[44px] rounded-xl border border-grey-3 px-4 text-[14px] font-semibold text-grey-6 transition-colors hover:bg-grey-2 hover:border-grey-4 disabled:opacity-50"
                      >
                        일정 수정
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !actionLoading && setRejectModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-[24px] border border-grey-2 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="reject-modal-title" className="text-[18px] font-bold text-grey-10">
              요청 거절
            </h2>
            <p className="mt-2 text-[14px] font-normal text-grey-5">
              {rejectModal.menteeName}님의 멘토링 요청을 거절하시겠습니까?
            </p>
            <label className="mt-4 block text-[14px] font-semibold text-grey-10">
              사유 (선택)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 사유를 입력할 수 있습니다"
              className="mt-1.5 min-h-[80px] w-full resize-none rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 placeholder:text-grey-5 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
              rows={3}
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => !actionLoading && setRejectModal(null)}
                disabled={!!actionLoading}
                className="min-h-[44px] flex-1 rounded-xl border border-grey-2 text-[14px] font-semibold text-grey-10 hover:bg-grey-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!!actionLoading}
                className="min-h-[44px] flex-1 rounded-xl bg-grey-10 text-[14px] font-semibold text-white disabled:opacity-50"
              >
                {actionLoading ? '처리 중...' : '거절하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule edit modal */}
      {scheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !scheduleSaving && setScheduleModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-[24px] border border-grey-2 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="schedule-modal-title" className="text-[18px] font-bold text-grey-10">
              일정 수정
            </h2>
            <p className="mt-2 text-[14px] font-normal text-grey-5">
              {scheduleModal.menteeName}님과의 멘토링 일정을 설정하세요.
            </p>
            <label className="mt-4 block text-[14px] font-semibold text-grey-10">
              날짜·시간
            </label>
            <input
              type="datetime-local"
              value={scheduleForm.scheduled_at}
              onChange={(e) => setScheduleForm((s) => ({ ...s, scheduled_at: e.target.value }))}
              className="mt-1.5 w-full rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
            />
            <label className="mt-4 block text-[14px] font-semibold text-grey-10">
              미팅 방식
            </label>
            <select
              value={scheduleForm.meeting_method}
              onChange={(e) => setScheduleForm((s) => ({ ...s, meeting_method: e.target.value }))}
              className="mt-1.5 w-full rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
            >
              <option value="">선택</option>
              <option value="ONLINE">화상</option>
              <option value="OFFLINE">대면</option>
              <option value="FLEXIBLE">유연</option>
            </select>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => !scheduleSaving && setScheduleModal(null)}
                disabled={!!scheduleSaving}
                className="min-h-[44px] flex-1 rounded-xl border border-grey-2 text-[14px] font-semibold text-grey-10 hover:bg-grey-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                disabled={!!scheduleSaving}
                className="min-h-[44px] flex-1 rounded-xl bg-primary-shinhanblue text-[14px] font-semibold text-white disabled:opacity-50"
              >
                {scheduleSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
