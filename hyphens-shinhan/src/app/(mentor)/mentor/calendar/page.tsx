'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import {
  useReceivedRequests,
  useUpdateRequestSchedule,
} from '@/hooks/mentoring/useMentoring';
import {
  mapRequestToMentorshipForMentor,
  type MentorshipRequestForMentor,
} from '@/services/mentoring';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

const MEETING_METHOD_LABELS: Record<string, string> = {
  ONLINE: '화상',
  OFFLINE: '대면',
  FLEXIBLE: '유연',
};

function getMeetingMethodLabel(method: string | null | undefined): string {
  if (!method) return '';
  return MEETING_METHOD_LABELS[method] ?? method;
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

/** Sort: has scheduled_at first (by date asc), then no scheduled_at */
function sortByScheduledAt(
  a: MentorshipRequestForMentor,
  b: MentorshipRequestForMentor,
): number {
  const aTime = a.scheduled_at ? new Date(a.scheduled_at).getTime() : Infinity;
  const bTime = b.scheduled_at ? new Date(b.scheduled_at).getTime() : Infinity;
  if (aTime === Infinity && bTime === Infinity) return 0;
  if (aTime === Infinity) return 1;
  if (bTime === Infinity) return -1;
  return aTime - bTime;
}

// --- Calendar helpers (no date-fns) ---
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + n);
  return out;
}
function subMonths(d: Date, n: number): Date {
  return addMonths(d, -n);
}
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}
function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function getDaysInMonth(month: Date): Date[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

/** Date label for list: 오늘 / 내일 / 2월 14일 */
function getDateLabel(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() === today.getTime()) return '오늘';
  if (target.getTime() === tomorrow.getTime()) return '내일';
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

/** Time string 14:00 */
function getTimeStr(d: Date): string {
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function MentorCalendarPage() {
  const router = useRouter();
  const [scheduleModal, setScheduleModal] = useState<{
    requestId: string;
    menteeName: string;
    scheduled_at: string | null;
    meeting_method: string | null;
  } | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduled_at: '',
    meeting_method: '',
  });
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: acceptedData, isLoading } = useReceivedRequests({
    status: 'ACCEPTED',
  });
  const updateScheduleMutation = useUpdateRequestSchedule();

  const acceptedRequests: MentorshipRequestForMentor[] = useMemo(
    () => (acceptedData?.requests ?? []).map(mapRequestToMentorshipForMentor),
    [acceptedData?.requests],
  );

  const calendarEvents = useMemo(
    () => [...acceptedRequests].sort(sortByScheduledAt),
    [acceptedRequests],
  );

  const upcomingScheduled = useMemo(
    () =>
      calendarEvents.filter((req) => req.scheduled_at && new Date(req.scheduled_at) >= new Date()),
    [calendarEvents],
  );

  const datesWithMeetings = useMemo(() => {
    const set = new Set<string>();
    upcomingScheduled.forEach((req) => {
      if (req.scheduled_at) set.add(formatDateKey(new Date(req.scheduled_at)));
    });
    return set;
  }, [upcomingScheduled]);

  const meetingsForSelectedDate = useMemo(() => {
    if (!selectedDate) return upcomingScheduled;
    const key = formatDateKey(selectedDate);
    return upcomingScheduled.filter(
      (req) => req.scheduled_at && formatDateKey(new Date(req.scheduled_at)) === key,
    );
  }, [selectedDate, upcomingScheduled]);

  const unscheduledRequests = useMemo(
    () => calendarEvents.filter((req) => !req.scheduled_at),
    [calendarEvents],
  );

  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: firstDayOfWeek }, () => null);

  const scheduleSaving = updateScheduleMutation.isPending;

  const openScheduleModal = (req: MentorshipRequestForMentor) => {
    setScheduleModal({
      requestId: req.id,
      menteeName: req.menteeName,
      scheduled_at: req.scheduled_at ?? null,
      meeting_method: req.meeting_method ?? null,
    });
    setScheduleForm({
      scheduled_at: toDatetimeLocalValue(req.scheduled_at ?? undefined),
      meeting_method: req.meeting_method ?? '',
    });
  };

  const handleSaveSchedule = async () => {
    if (!scheduleModal) return;
    try {
      await updateScheduleMutation.mutateAsync({
        requestId: scheduleModal.requestId,
        body: {
          scheduled_at: scheduleForm.scheduled_at
            ? new Date(scheduleForm.scheduled_at).toISOString()
            : null,
          meeting_method: scheduleForm.meeting_method || null,
        },
      });
      setScheduleModal(null);
      setScheduleForm({ scheduled_at: '', meeting_method: '' });
    } catch (e) {
      console.error(e);
      alert('일정 저장에 실패했습니다.');
    }
  };

  const handleScheduleMeeting = () => {
    router.push(ROUTES.MENTOR_DASHBOARD.MAIN);
  };

  return (
    <div className="min-h-full bg-grey-1-1">
      <div className="mx-auto max-w-[800px] px-4 py-6 sm:py-8">
        {/* Primary action — match hyphens-frontend */}
        <button
          type="button"
          onClick={handleScheduleMeeting}
          className="mb-6 flex min-h-[52px] w-full touch-manipulation items-center justify-center rounded-xl bg-primary-shinhanblue px-5 py-3.5 text-[15px] font-medium text-white transition-opacity active:opacity-90"
        >
          일정 잡기
        </button>

        {/* Calendar */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="-ml-2 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-grey-5 transition-colors hover:bg-grey-2 active:bg-grey-3"
              aria-label="이전 달"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h2 className="text-[17px] font-medium tracking-tight text-grey-10">
              {currentMonth.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
              })}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="-mr-2 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-grey-5 transition-colors hover:bg-grey-2 active:bg-grey-3"
              aria-label="다음 달"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-grey-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div
                key={day}
                className="bg-grey-1-1 py-2.5 text-center text-[11px] font-normal text-grey-5"
              >
                {day}
              </div>
            ))}
            {paddingDays.map((_, i) => (
              <div
                key={`pad-${i}`}
                className="aspect-square min-h-[40px] bg-grey-1-1"
              />
            ))}
            {daysInMonth.map((day) => {
              const dateStr = formatDateKey(day);
              const hasMeetings = datesWithMeetings.has(dateStr);
              const isSelected =
                selectedDate && dateStr === formatDateKey(selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'flex aspect-square min-h-[40px] touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg text-[13px] font-normal transition-colors',
                    !isCurrentMonth && 'text-grey-5',
                    isCurrentMonth && 'text-grey-10',
                    isSelected && 'bg-primary-shinhanblue text-white',
                    !isSelected && isToday(day) && 'bg-primary-shinhanblue/10 text-grey-10',
                    !isSelected && !isToday(day) && 'hover:bg-grey-2',
                  )}
                >
                  {day.getDate()}
                  {hasMeetings && !isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-shinhanblue" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meetings list — design from hyphens-frontend MeetingCard */}
        <section>
          <h3 className="mb-4 text-[13px] font-normal uppercase tracking-wider text-grey-5">
            {selectedDate
              ? `${selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 미팅`
              : '다가오는 미팅'}
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-48 animate-pulse rounded bg-grey-3" />
              <p className="mt-3 text-[14px] text-grey-5">일정을 불러오는 중...</p>
            </div>
          ) : meetingsForSelectedDate.length > 0 ? (
            <div className="divide-y divide-grey-2">
              {meetingsForSelectedDate.map((req) => {
                const d = req.scheduled_at ? new Date(req.scheduled_at) : null;
                return (
                  <div key={req.id} className="py-4 first:pt-0">
                    <div className="rounded-xl bg-white p-4 sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="flex min-w-0 gap-4 sm:gap-5">
                          <div className="w-14 shrink-0 text-left sm:w-16">
                            <p className="text-[11px] font-normal uppercase tracking-wider text-grey-5">
                              {d ? getDateLabel(d) : '일정 미정'}
                            </p>
                            <p className="mt-0.5 text-[15px] font-medium tracking-tight text-grey-10">
                              {d ? getTimeStr(d) : '—'}
                            </p>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium leading-snug text-grey-10">
                              {req.menteeName}님
                            </p>
                            <p className="mt-1 text-[12px] font-normal text-grey-5">
                              {(req.meeting_method ?? req.preferred_meeting_method)
                                ? getMeetingMethodLabel(
                                    req.meeting_method ?? req.preferred_meeting_method,
                                  )
                                : '—'}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 border-t border-grey-2 pt-4 sm:border-t-0 sm:border-l sm:border-grey-2 sm:pl-5 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => openScheduleModal(req)}
                            disabled={scheduleSaving}
                            className="min-h-[40px] rounded-lg bg-primary-shinhanblue px-4 py-2 text-[13px] font-medium text-white transition-opacity active:opacity-90 disabled:opacity-50 touch-manipulation"
                          >
                            일정 수정
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : upcomingScheduled.length === 0 && unscheduledRequests.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-1 text-[15px] font-normal text-grey-5">
                예정된 미팅이 없습니다
              </p>
              <p className="mb-6 text-[13px] font-normal text-grey-5">
                일정을 잡아 멘티와 만나보세요
              </p>
              <button
                type="button"
                onClick={handleScheduleMeeting}
                className="min-h-[44px] touch-manipulation rounded-lg bg-primary-shinhanblue px-6 py-2.5 text-[14px] font-medium text-white transition-opacity active:opacity-90"
              >
                첫 미팅 일정 잡기
              </button>
            </div>
          ) : selectedDate ? (
            <p className="py-8 text-[14px] font-normal text-grey-5">
              이 날짜에는 예정된 미팅이 없습니다.
            </p>
          ) : null}

          {/* Unscheduled: show "일정 미정" list below when no date selected */}
          {!selectedDate && unscheduledRequests.length > 0 && (
            <>
              <h3 className="mb-4 mt-8 text-[13px] font-normal uppercase tracking-wider text-grey-5">
                일정 미정
              </h3>
              <div className="divide-y divide-grey-2">
                {unscheduledRequests.map((req) => (
                  <div key={req.id} className="py-4 first:pt-0">
                    <div className="rounded-xl bg-white p-4 sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex min-w-0 gap-4">
                          <Avatar
                            src={req.menteeAvatar}
                            alt={req.menteeName}
                            size={40}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-[15px] font-medium text-grey-10">
                              {req.menteeName}님
                            </p>
                            <p className="text-[13px] text-grey-5">일정 미정</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openScheduleModal(req)}
                          disabled={scheduleSaving}
                          className="min-h-[40px] shrink-0 rounded-lg border border-grey-3 px-4 py-2 text-[13px] font-medium text-grey-6 transition-colors hover:border-grey-4 hover:bg-grey-2 disabled:opacity-50 touch-manipulation"
                        >
                          일정 잡기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

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
            <h2
              id="schedule-modal-title"
              className="text-[18px] font-bold text-grey-10"
            >
              일정 수정
            </h2>
            <p className="mt-2 text-[14px] text-grey-5">
              {scheduleModal.menteeName}님과의 멘토링 일정을 설정하세요.
            </p>
            <label className="mt-4 block text-[14px] font-semibold text-grey-10">
              날짜·시간
            </label>
            <input
              type="datetime-local"
              value={scheduleForm.scheduled_at}
              onChange={(e) =>
                setScheduleForm((s) => ({ ...s, scheduled_at: e.target.value }))
              }
              className="mt-1.5 w-full rounded-[12px] border border-grey-2 bg-white px-4 py-3 text-[14px] text-grey-10 focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20"
            />
            <label className="mt-4 block text-[14px] font-semibold text-grey-10">
              미팅 방식
            </label>
            <select
              value={scheduleForm.meeting_method}
              onChange={(e) =>
                setScheduleForm((s) => ({ ...s, meeting_method: e.target.value }))
              }
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
                className="min-h-[44px] flex-1 rounded-xl border border-grey-2 text-[14px] font-semibold text-grey-10 transition-colors hover:bg-grey-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                disabled={!!scheduleSaving}
                className="min-h-[44px] flex-1 rounded-xl bg-primary-shinhanblue text-[14px] font-semibold text-white transition-opacity disabled:opacity-50 active:opacity-90"
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
