'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { useScholarshipEligibility, useMandatoryStatus, useMyVolunteerHours } from '@/hooks/user/useUser';
import { useYearGpa } from '@/hooks/grades';
import { useUpdateMyVolunteerHours } from '@/hooks/user/useUserMutations';
import { ROUTES } from '@/constants';

const statusStyles: Record<string, string> = {
  충족: 'bg-state-green-light text-state-green-dark',
  주의: 'bg-state-yellow-light text-state-yellow-dark',
  위험: 'bg-state-red-light text-state-red',
  미달: 'bg-grey-2 text-grey-8',
};

const GPA_MAX = 4.5;
const CREDITS_REQUIRED = 15;
const VOLUNTEER_REQUIRED = 21;

function criterionStatus(current: number, required: number): '충족' | '주의' | '위험' | '미달' {
  if (required === 0 || current >= required) return '충족';
  const pct = (current / required) * 100;
  if (pct >= 80) return '주의';
  if (pct >= 50) return '위험';
  return '미달';
}

type EditKey = 'gpa' | 'credits' | 'volunteer' | 'events';

/** 유지심사 현황 - 전체 탭 (API: scholarship-eligibility, grades, volunteer, mandatory-status) */
export default function MaintenanceTabAll() {
  const currentYear = new Date().getFullYear();
  const { data: eligibility } = useScholarshipEligibility(currentYear);
  const { data: gpaData } = useYearGpa(eligibility?.current_year ?? currentYear);
  const { data: volunteerRes } = useMyVolunteerHours();
  const { data: mandatoryStatus } = useMandatoryStatus(currentYear);
  const updateVolunteer = useUpdateMyVolunteerHours();
  const router = useRouter();
  const [editing, setEditing] = useState<EditKey | null>(null);
  const toast = useToast();

  const { stats, nextDeadline } = useMemo(() => {
    const gpa = gpaData?.gpa ?? 0;
    const credits = eligibility?.total_credits ?? 0;
    const volunteerHours = volunteerRes?.volunteer_hours ?? 0;
    const mandatoryTotal = mandatoryStatus?.total ?? 0;
    const mandatoryCompleted = mandatoryStatus?.completed ?? 0;

    const stats: { key: EditKey; label: string; value: string; status: string }[] = [
      {
        key: 'gpa',
        label: '학업',
        value: `${gpa.toFixed(1)}/${GPA_MAX}`,
        status: criterionStatus(gpa, 3.28),
      },
      {
        key: 'credits',
        label: '학점',
        value: `${credits}/${CREDITS_REQUIRED}`,
        status: criterionStatus(credits, CREDITS_REQUIRED),
      },
      {
        key: 'volunteer',
        label: '봉사',
        value: `${volunteerHours}/${VOLUNTEER_REQUIRED}시간`,
        status: criterionStatus(volunteerHours, VOLUNTEER_REQUIRED),
      },
      {
        key: 'events',
        label: '행사',
        value: `${mandatoryCompleted}/${mandatoryTotal}개`,
        status: criterionStatus(mandatoryCompleted, mandatoryTotal || 1),
      },
    ];

    let nextDeadline: { title?: string; description: string; date: string } | null = null;
    const activities = mandatoryStatus?.activities ?? [];
    const incomplete = activities.filter((a) => !a.is_completed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = incomplete
      .map((a) => ({ ...a, dueTime: new Date(a.due_date).getTime() }))
      .filter((a) => a.dueTime >= today.getTime())
      .sort((a, b) => a.dueTime - b.dueTime)[0];
    if (next) {
      nextDeadline = {
        title: next.title,
        description: next.title,
        date: next.due_date,
      };
    }
    return { stats, nextDeadline };
  }, [eligibility, gpaData, volunteerRes, mandatoryStatus]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

  const handleSave = (key: EditKey, value: number) => {
    if (key === 'volunteer') {
      updateVolunteer.mutate(
        { volunteer_hours: value },
        {
          onSuccess: () => {
            toast.show('봉사 시간이 저장되었습니다.');
            setEditing(null);
          },
          onError: () => toast.error('저장에 실패했습니다.'),
        }
      );
      return;
    }
    if (key === 'gpa' || key === 'credits') {
      toast.show('학업·학점은 학업 탭에서 성적을 입력하면 자동 반영됩니다.');
      setEditing(null);
      router.push(`${ROUTES.SCHOLARSHIP.MAINTENANCE}?tab=학업`);
      return;
    }
    if (key === 'events') {
      toast.show('필수 행사는 활동 탭에서 제출하면 반영됩니다.');
      setEditing(null);
      router.push(`${ROUTES.SCHOLARSHIP.MAINTENANCE}?tab=활동`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.sectionLabel}>전체 현황</span>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <button
              key={stat.key}
              type="button"
              onClick={() => setEditing(stat.key)}
              className={cn(styles.statItem, editing === stat.key && styles.statItemActive)}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={cn(styles.statusBadge, statusStyles[stat.status] ?? statusStyles.미달)}>
                  {stat.status}
                </span>
              </div>
              <span className={styles.statValue}>{stat.value}</span>
            </button>
          ))}
        </div>
        {editing && (
          <EditForm
            editing={editing}
            stats={stats}
            currentVolunteer={volunteerRes?.volunteer_hours ?? 0}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isPending={updateVolunteer.isPending}
          />
        )}
      </div>

      {nextDeadline && (
        <div className={styles.card}>
          <span className={styles.sectionLabel}>다음 일정</span>
          <div className={styles.deadlineRow}>
            <span className={styles.deadlineTitle}>{nextDeadline.title ?? nextDeadline.description}</span>
            <span className={styles.deadlineDate}>{formatDate(nextDeadline.date)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function EditForm({
  editing,
  stats,
  currentVolunteer,
  onSave,
  onCancel,
  isPending,
}: {
  editing: EditKey;
  stats: { key: EditKey; label: string; value: string; status: string }[];
  currentVolunteer: number;
  onSave: (key: EditKey, value: number) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const stat = stats.find((s) => s.key === editing);
  const initialValue = (() => {
    if (editing === 'volunteer') return String(currentVolunteer);
    const v = stat?.value ?? '0';
    return v.replace(/[^0-9.]/g, '');
  })();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    if (editing === 'gpa') onSave('gpa', Math.min(n, GPA_MAX));
    else if (editing === 'credits') onSave('credits', n);
    else if (editing === 'volunteer') onSave('volunteer', n);
    else onSave('events', n);
  };

  const config = {
    gpa: { label: '학업 성적 (GPA)', max: GPA_MAX, placeholder: `0 ~ ${GPA_MAX}` },
    credits: { label: '이수 학점', max: 999, placeholder: `필요: ${CREDITS_REQUIRED}학점` },
    volunteer: { label: '인정 봉사 시간', max: 999, placeholder: `필요: ${VOLUNTEER_REQUIRED}시간` },
    events: { label: '참석한 행사 수', max: 999, placeholder: '필수 행사 제출 현황' },
  }[editing];

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <label className={styles.editLabel}>{config.label}</label>
      <input
        type="number"
        min={0}
        max={config.max}
        step={editing === 'gpa' ? 0.1 : 1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={config.placeholder}
        className={styles.editInput}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={isPending}>취소</button>
        <button type="submit" className={styles.saveBtn} disabled={isPending}>저장</button>
      </div>
    </form>
  );
}

const styles = {
  wrapper: 'px-4 py-4 pb-8 space-y-4',
  card: cn(
    'rounded-xl bg-white p-5',
    'border border-grey-2',
  ),
  sectionLabel: 'body-7 text-grey-9 mb-3 block',
  statsGrid: 'grid grid-cols-2 gap-3',
  statItem: cn(
    'rounded-lg bg-grey-1-1 p-3 text-left w-full',
    'border border-transparent hover:border-grey-3 transition-colors',
  ),
  statItemActive: 'border-primary-shinhanblue ring-1 ring-primary-shinhanblue',
  statHeader: 'flex justify-between items-center mb-1',
  statLabel: 'body-7 text-grey-9',
  statusBadge: 'px-2 py-0.5 rounded-full body-8',
  statValue: 'title-14 text-grey-11',
  editForm: 'mt-4 pt-4 border-t border-grey-2',
  editLabel: 'block body-7 text-grey-9 mb-2',
  editInput: 'w-full px-4 py-3 rounded-lg border border-grey-2 body-8 text-grey-11 placeholder:text-grey-6',
  cancelBtn: 'flex-1 py-3 rounded-xl body-8 text-grey-9 bg-grey-2',
  saveBtn: 'flex-1 py-3 rounded-xl body-8 font-medium text-white bg-primary-shinhanblue',
  deadlineRow: 'flex flex-col gap-1',
  deadlineTitle: 'body-8 text-grey-11',
  deadlineDate: 'body-7 text-grey-9',
} as const;
