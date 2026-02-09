'use client';

import { Icon } from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import { Skeleton } from '@/components/common/Skeleton';
import { useScholarshipEligibility } from '@/hooks/user/useUser';
import { useYearGpa } from '@/hooks/grades';
import { cn } from '@/utils/cn';

const GPA_MAX = 4.5;
/** 유지 심사 목표 GPA (예시, 운영 정책에 따라 조정) */
const REQUIRED_GPA = 3.28;

/** 유지심사 현황 - 학업 탭 (Figma 727:677 학업성적 카드) */
export default function MaintenanceTabAcademic() {
  const { data: eligibility } = useScholarshipEligibility();
  const year = eligibility?.current_year ?? new Date().getFullYear();
  const { data: gpaData, isLoading } = useYearGpa(year);

  if (isLoading || !gpaData) {
    return <MaintenanceTabAcademicSkeleton />;
  }

  const gpa = gpaData.gpa;
  const gpaRatio = Math.min(1, gpa / GPA_MAX);
  const isGpaOk = gpa >= REQUIRED_GPA;
  const breakdown = gpaData.semester_breakdown ?? [];

  return (
    <div className={styles.wrapper}>
      {/* 학업성적 카드 */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>학업성적</span>
          <span className={styles.gpaValue}>
            {gpa.toFixed(1)} / {GPA_MAX}
          </span>
        </div>
        <div className={styles.gpaRow}>
          <ProgressBar
            value={gpa}
            max={GPA_MAX}
            className={styles.gpaBar}
          />
          <span
            className={cn(
              styles.hintIcon,
              isGpaOk ? 'text-state-green-dark' : 'text-state-red',
            )}
          >
            <Icon
              name={isGpaOk ? 'IconLLineTickCircle' : 'IconLLineInfoCircle'}
              size={20}
            />
          </span>
          <span
            className={cn(
              styles.hintLabel,
              isGpaOk ? 'text-state-green-dark' : 'text-state-red',
            )}
          >
            {isGpaOk ? '충족' : '주의'}
          </span>
        </div>

        {/* 현재 학점 */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>현재 학점</span>
          <div className={styles.twoCol}>
            <span className={styles.label}>현재</span>
            <span className={styles.value}>{gpa.toFixed(1)} / {GPA_MAX}</span>
            <span className={styles.label}>필수 학점</span>
            <span className={styles.value}>{REQUIRED_GPA} / {GPA_MAX}</span>
          </div>
        </div>

        {/* 세부 내역: 학기별 GPA */}
        {breakdown.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>세부 내역</span>
            <div className={styles.detailList}>
              {breakdown.map((item, i) => (
                <div key={i} className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    {year}-{item.semester} 학기
                  </span>
                  <span className={styles.detailValue}>
                    {item.gpa.toFixed(1)} ({item.credits}학점)
                  </span>
                </div>
              ))}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>전체 학점</span>
                <span className={styles.detailValue}>
                  {gpaData.gpa.toFixed(1)} ({gpaData.total_credits}학점)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 학기별 내역 */}
        {breakdown.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>학기별 내역</span>
            <div className={styles.semesterList}>
              {breakdown.map((item, i) => (
                <div key={i} className={styles.semesterRow}>
                  <span className={styles.semesterLabel}>
                    {year}-{item.semester} 학기
                  </span>
                  <span className={styles.semesterValue}>
                    학점: {item.gpa.toFixed(1)} ({item.credits} 학점)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 마지막 / 다음 업데이트 (placeholder) */}
        <div className={styles.updateRow}>
          <div className={styles.updateItem}>
            <span className={styles.updateLabel}>마지막 업데이트:</span>
            <span className={styles.updateValue}>-</span>
          </div>
          <div className={styles.updateItem}>
            <span className={styles.updateLabel}>다음 업데이트:</span>
            <span className={styles.updateValue}>{year}년 4월 30일 (1학기 성적)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenanceTabAcademicSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className="flex justify-between items-center mb-3">
          <Skeleton.Box className="h-5 w-20 rounded" />
          <Skeleton.Box className="h-5 w-16 rounded" />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton.Box className="h-2 flex-1 rounded-full" />
          <Skeleton.Box className="size-5 rounded" />
          <Skeleton.Box className="h-4 w-8 rounded" />
        </div>
        <div className="space-y-3">
          <Skeleton.Box className="h-4 w-24 rounded" />
          <Skeleton.Box className="h-12 w-full rounded" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton.Box className="h-4 w-20 rounded" />
          <Skeleton.Box className="h-4 w-full rounded" />
          <Skeleton.Box className="h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: 'px-4 py-4 pb-8',
  card: cn(
    'rounded-xl bg-white p-5',
    'border border-grey-2',
  ),
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
  updateValue: 'body-8 text-grey-11',
} as const;
