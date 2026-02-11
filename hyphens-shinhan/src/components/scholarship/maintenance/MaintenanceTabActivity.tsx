'use client';

import { useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { useMyVolunteerHours, useMandatoryStatus } from '@/hooks/user/useUser';
import { useUpdateMyVolunteerHours } from '@/hooks/user/useUserMutations';
import { ROUTES } from '@/constants';

const VOLUNTEER_REQUIRED = 21;

function volunteerStatus(current: number, required: number): '충족' | '주의' | '위험' | '미달' {
  if (current >= required) return '충족';
  const pct = (current / required) * 100;
  if (pct >= 80) return '주의';
  if (pct >= 50) return '위험';
  return '미달';
}

function eventStatus(attended: number, required: number): '충족' | '주의' | '위험' | '미달' {
  if (required === 0 || attended >= required) return '충족';
  const pct = (attended / required) * 100;
  if (pct >= 80) return '주의';
  if (pct >= 50) return '위험';
  return '미달';
}

/** 유지심사 현황 - 활동 탭 (봉사: API /users/me/volunteer, 필수행사: API /users/me/mandatory-status) */
export default function MaintenanceTabActivity() {
  const currentYear = new Date().getFullYear();
  const { data: volunteerRes } = useMyVolunteerHours();
  const { data: mandatoryStatus } = useMandatoryStatus(currentYear);
  const updateVolunteer = useUpdateMyVolunteerHours();

  const volunteerHours = volunteerRes?.volunteer_hours ?? 0;
  const volunteerStatusLabel = volunteerStatus(volunteerHours, VOLUNTEER_REQUIRED);
  const volunteerDeadline = `${currentYear}-12-31`;

  const eventsFromMandatory = useMemo(() => {
    const activities = mandatoryStatus?.activities;
    if (!activities?.length) {
      return {
        attended: 0,
        required: 0,
        missed: 0,
        upcoming: 0,
        status: '충족' as const,
        events: [] as { id: string; title: string; date: string; attendanceStatus: 'attended' | 'missed' | 'upcoming' }[],
        nextEvent: null as { id: string; title: string; date: string } | null,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const events = activities.map((a) => {
      const dueTime = new Date(a.due_date).setHours(0, 0, 0, 0);
      const status: 'attended' | 'missed' | 'upcoming' =
        a.is_completed ? 'attended' : dueTime >= today.getTime() ? 'upcoming' : 'missed';
      return { id: a.id, title: a.title, date: a.due_date, attendanceStatus: status };
    });
    const attended = events.filter((e) => e.attendanceStatus === 'attended').length;
    const required = activities.length;
    const missed = events.filter((e) => e.attendanceStatus === 'missed').length;
    const upcoming = events.filter((e) => e.attendanceStatus === 'upcoming').length;
    const nextEvent = events.find((e) => e.attendanceStatus === 'upcoming')
      ? { id: events.find((e) => e.attendanceStatus === 'upcoming')!.id, title: events.find((e) => e.attendanceStatus === 'upcoming')!.title, date: events.find((e) => e.attendanceStatus === 'upcoming')!.date }
      : null;
    return {
      attended,
      required,
      missed,
      upcoming,
      status: eventStatus(attended, required),
      events,
      nextEvent,
    };
  }, [mandatoryStatus]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });

  return (
    <div className={styles.wrapper}>
      {/* 봉사활동 카드 */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>봉사활동</span>
          <span className={styles.gpaValue}>
            {volunteerHours} / {VOLUNTEER_REQUIRED}시간
          </span>
        </div>
        <div className={styles.gpaRow}>
          <ProgressBar value={volunteerHours} max={VOLUNTEER_REQUIRED} className={styles.gpaBar} />
          <span className={cn(styles.hintIcon, volunteerStatusLabel === '충족' ? 'text-state-green-dark' : 'text-state-red')}>
            <Icon
              name={volunteerStatusLabel === '충족' ? 'IconLLineTickCircle' : 'IconLLineInfoCircle'}
              size={20}
            />
          </span>
          <span
            className={cn(
              styles.hintLabel,
              volunteerStatusLabel === '충족' ? 'text-state-green-dark' : 'text-state-red',
            )}
          >
            {volunteerStatusLabel}
          </span>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>현황</span>
          <div className={styles.twoCol}>
            <span className={styles.label}>인정</span>
            <span className={styles.value}>{volunteerHours}시간</span>
            <span className={styles.label}>필요</span>
            <span className={styles.value}>{VOLUNTEER_REQUIRED}시간</span>
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>봉사시간 기준</span>
          <div className={styles.detailList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>인정기간</span>
              <span className={styles.detailValue}>당해 연도 1월 ~ 12월</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>인정</span>
              <span className={styles.detailValue}>VMS/1365 봉사활동 인정서 발급분</span>
            </div>
          </div>
        </div>
        <div className={styles.updateRow}>
          <div className={styles.updateItem}>
            <span className={styles.updateLabel}>마감일:</span>
            <span className={styles.updateValue}>{formatDate(volunteerDeadline)}</span>
          </div>
        </div>
        <VolunteerSubmitForm
          currentHours={volunteerHours}
          onAdd={(addedHours) => {
            updateVolunteer.mutate(
              { volunteer_hours: volunteerHours + addedHours },
              { onSuccess: () => { }, onError: () => { } }
            );
          }}
          isPending={updateVolunteer.isPending}
        />
      </div>

      {/* 필수행사 카드 (mandatory-status) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>필수행사</span>
          <span className={styles.gpaValue}>
            {eventsFromMandatory.attended} / {eventsFromMandatory.required}개
          </span>
        </div>
        <div className={styles.gpaRow}>
          <ProgressBar
            value={eventsFromMandatory.attended}
            max={Math.max(1, eventsFromMandatory.required)}
            className={styles.gpaBar}
          />
          <span className={cn(styles.hintIcon, eventsFromMandatory.status === '충족' ? 'text-state-green-dark' : 'text-state-red')}>
            <Icon
              name={eventsFromMandatory.status === '충족' ? 'IconLLineTickCircle' : 'IconLLineInfoCircle'}
              size={20}
            />
          </span>
          <span
            className={cn(
              styles.hintLabel,
              eventsFromMandatory.status === '충족' ? 'text-state-green-dark' : 'text-state-red',
            )}
          >
            {eventsFromMandatory.status}
          </span>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>참석 현황</span>
          <div className={styles.twoCol}>
            <span className={styles.label}>참석</span>
            <span className={styles.value}>{eventsFromMandatory.attended}개</span>
            <span className={styles.label}>미참석</span>
            <span className={styles.value}>{eventsFromMandatory.missed}개</span>
          </div>
        </div>
        {eventsFromMandatory.events.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>행사 목록</span>
            <div className={styles.semesterList}>
              {eventsFromMandatory.events.map((ev) => (
                <div key={ev.id} className={styles.semesterRow}>
                  <span className={styles.semesterLabel}>{ev.title}</span>
                  <span className={styles.semesterValue}>
                    {formatDate(ev.date)}
                    {ev.attendanceStatus === 'attended' && ' · 참석'}
                    {ev.attendanceStatus === 'missed' && ' · 미참석'}
                    {ev.attendanceStatus === 'upcoming' && ' · 예정'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {eventsFromMandatory.nextEvent && (
          <div className={styles.updateRow}>
            <div className={styles.updateItem}>
              <span className={styles.updateLabel}>다음 행사:</span>
              <span className={styles.updateValue}>
                {eventsFromMandatory.nextEvent.title} ({formatDate(eventsFromMandatory.nextEvent.date)})
              </span>
            </div>
          </div>
        )}
        <Link href={ROUTES.SCHOLARSHIP.MAIN} role="button" tabIndex={0} className={styles.LinkButton}>
          <Icon name="IconLLineArrowUp" size={18} />
          필수 활동 제출하러 가기
        </Link>
      </div>
    </div>
  );
}

function VolunteerSubmitForm({
  currentHours,
  onAdd,
  isPending,
}: {
  currentHours: number;
  onAdd: (addedHours: number) => void;
  isPending: boolean;
}) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(hours);
    if (!name.trim() || !h || h <= 0 || !date) {
      toast.error('활동명, 봉사 시간, 활동 일자를 입력해 주세요.');
      return;
    }
    onAdd(h);
    toast.show('봉사 시간이 반영되었습니다.');
    setShow(false);
    setName('');
    setHours('');
    setDate('');
    setFile(null);
  };

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        disabled={isPending}
        className={styles.submitButton}
      >
        <Icon name="IconLBoldFolderAdd" size={24} className={styles.submitButtonIcon} />
        <p className={styles.submitButtonLabel}>봉사 활동 자료 업로드</p>
      </button>
    );
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.formLabel}>활동명</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 지역사회 정화 활동" className={styles.input} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={styles.formLabel}>봉사 시간</label>
          <input type="number" min={0} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="예: 3" className={styles.input} />
        </div>
        <div>
          <label className={styles.formLabel}>활동 일자</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} />
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button type="button" onClick={() => fileRef.current?.click()} className={styles.fileButton}>
        {file ? file.name : '증빙 자료 선택'}
      </button>
      <div className="flex gap-2">
        <button type="button" onClick={() => { setShow(false); setName(''); setHours(''); setDate(''); setFile(null); }} className={styles.cancelButton}>취소</button>
        <button type="submit" disabled={isPending} className={styles.primaryButton}>제출하기</button>
      </div>
    </form>
  );
}

const styles = {
  wrapper: 'px-4 py-4 pb-8 space-y-4',
  card: cn('rounded-xl bg-white p-5', 'border border-grey-2'),
  cardHeader: 'flex flex-row justify-between items-center mb-3',
  cardTitle: 'title-14 text-grey-11',
  gpaValue: 'body-7 text-grey-11',
  gpaRow: 'flex flex-row items-center gap-2 mb-4',
  gpaBar: 'flex-1 h-2.5 rounded-full',
  hintIcon: 'flex shrink-0',
  hintLabel: 'body-7',
  section: 'mb-4',
  sectionLabel: 'body-7 text-grey-9 mb-2 block',
  twoCol: 'grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-grey-1-1 p-3',
  label: 'body-7 text-grey-9',
  value: 'body-7 text-grey-11',
  detailList: 'rounded-lg bg-grey-1-1 p-3 space-y-2',
  detailRow: 'flex justify-between items-center',
  detailLabel: 'body-7 text-grey-9',
  detailValue: 'body-7 text-grey-11',
  semesterList: 'rounded-lg bg-grey-1-1 p-3 space-y-2',
  semesterRow: 'flex flex-col gap-0.5',
  semesterLabel: 'body-7 text-grey-9',
  semesterValue: 'body-7 text-grey-11',
  updateRow: 'flex flex-col gap-2 pt-2 border-t border-grey-2',
  updateItem: 'flex flex-col gap-0.5',
  updateLabel: 'body-7 text-grey-9',
  updateValue: 'body-7 text-grey-11',
  submitButton: cn(
    'w-full mt-4 flex items-center justify-center gap-2.5',
    'border border-dashed border-grey-6 rounded-[16px] px-4 py-3',
  ),
  submitButtonIcon: cn('text-grey-9'),
  submitButtonLabel: cn('font-caption-caption5 text-grey-9'),
  form: 'mt-4 pt-4 border-t border-grey-2 space-y-3',
  formLabel: 'block body-7 text-grey-9 mb-1',
  input: 'w-full px-4 py-3 rounded-lg border border-grey-2 body-8 text-grey-11 placeholder:text-grey-6',
  fileButton: 'w-full py-3 rounded-lg border-2 border-dashed border-grey-3 body-7 text-grey-7',
  cancelButton: 'flex-1 py-3 rounded-xl body-8 text-grey-9 bg-grey-2',
  primaryButton: 'flex-1 py-3 rounded-xl body-8 font-medium text-white bg-primary-shinhanblue',
  LinkButton: cn(
    'body-7 w-full mt-4 flex items-center justify-center gap-2.5 border border-grey-2 rounded-[16px] px-4 py-3',
    'text-primary-shinhanblue flex items-center justify-center gap-2',
  ),
} as const;
