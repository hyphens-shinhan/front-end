'use client';

import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import { Skeleton } from '@/components/common/Skeleton';
import { useScholarshipEligibility } from '@/hooks/user/useUser';
import { useYearGpa } from '@/hooks/grades';
import { useCreateGrade, useDeleteGrade, useUpdateGrade } from '@/hooks/grades/useGradesMutations';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import type { YearGPAResponse } from '@/types/grades';
import type { SemesterGradeCreate, SemesterGradeUpdate } from '@/types';

const GPA_MAX = 4.5;
const CREDITS_REQUIRED = 15;
/** 유지 심사 목표 GPA (예시, 운영 정책에 따라 조정) */
const REQUIRED_GPA = 3.28;

const LETTER_GRADES: SemesterGradeCreate['grade'][] = [
  'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F',
];

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
        {/* 학기별 성적 추가: 성적·학점은 여기서 입력하면 자동 반영됩니다 */}
        <AddGradeForm year={year} onSuccess={() => {}} />
        {gpaData.grades.length > 0 && (
          <GradeList year={year} grades={gpaData.grades} />
        )}
      </div>

      {/* 학점 이수 카드: API 데이터 표시 (학기별 성적 추가로 반영) */}
      <CreditsCard year={year} gpaData={gpaData} />
    </div>
  );
}

function AddGradeForm({ year, onSuccess }: { year: number; onSuccess: () => void }) {
  const [show, setShow] = useState(false);
  const [semester, setSemester] = useState<SemesterGradeCreate['semester']>(1);
  const [courseName, setCourseName] = useState('');
  const [grade, setGrade] = useState<SemesterGradeCreate['grade']>('A');
  const [credits, setCredits] = useState(3);
  const toast = useToast();
  const createGrade = useCreateGrade();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      toast.show('과목명을 입력해 주세요.');
      return;
    }
    createGrade.mutate(
      { year, semester, course_name: courseName.trim(), grade, credits },
      {
        onSuccess: () => {
          toast.show('성적이 반영되었습니다.');
          setShow(false);
          setCourseName('');
          setCredits(3);
          onSuccess();
        },
        onError: () => toast.show('저장에 실패했습니다. 다시 시도해 주세요.'),
      }
    );
  };

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className={styles.submitButton}
      >
        <Icon name="IconLLineArrowUp" size={18} />
        학기별 성적 추가
      </button>
    );
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-sm text-grey-11">학기</label>
        <select
          value={semester}
          onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
          className="border border-grey-2 rounded-lg px-3 py-2"
        >
          <option value={1}>{year}-1 학기</option>
          <option value={2}>{year}-2 학기</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-sm text-grey-11">과목명</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="예: 경영학원론"
          className="border border-grey-2 rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-sm text-grey-11">성적</label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value as SemesterGradeCreate['grade'])}
          className="border border-grey-2 rounded-lg px-3 py-2"
        >
          {LETTER_GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-sm text-grey-11">학점</label>
        <input
          type="number"
          min={1}
          max={10}
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value) || 0)}
          className="border border-grey-2 rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setShow(false); setCourseName(''); }}
          className={styles.cancelButton}
        >
          취소
        </button>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={createGrade.isPending}
        >
          {createGrade.isPending ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
}

function GradeList({
  year,
  grades,
}: {
  year: number;
  grades: YearGPAResponse['grades'];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const deleteGrade = useDeleteGrade();
  const updateGrade = useUpdateGrade();
  const toast = useToast();

  const handleDelete = (gradeId: string) => {
    deleteGrade.mutate(gradeId, {
      onSuccess: () => toast.show('삭제되었습니다.'),
      onError: () => toast.show('삭제에 실패했습니다.'),
    });
  };

  const handleSaveEdit = (gradeId: string, data: SemesterGradeUpdate) => {
    updateGrade.mutate(
      { gradeId, data },
      {
        onSuccess: () => {
          toast.show('수정되었습니다.');
          setEditingId(null);
        },
        onError: () => toast.show('수정에 실패했습니다.'),
      }
    );
  };

  const bySemester = grades.reduce<Record<string, typeof grades>>((acc, g) => {
    const key = `${year}-${g.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>등록된 과목 (수정·삭제 가능)</span>
      <div className="flex flex-col gap-2">
        {Object.entries(bySemester)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([semKey, list]) => (
            <div key={semKey}>
              <span className="text-sm text-grey-11">{semKey} 학기</span>
              <ul className="mt-1 space-y-1">
                {list.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-2 rounded border border-grey-2 px-3 py-2"
                  >
                    {editingId === g.id ? (
                      <GradeEditForm
                        grade={g}
                        onSave={(data) => handleSaveEdit(g.id, data)}
                        onCancel={() => setEditingId(null)}
                        isPending={updateGrade.isPending}
                      />
                    ) : (
                      <>
                        <span className="text-sm">
                          {g.course_name} — {g.grade} ({g.credits}학점)
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(g.id)}
                            className="text-primary-shinhanblue text-sm"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(g.id)}
                            disabled={deleteGrade.isPending}
                            className="text-state-red text-sm"
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

function GradeEditForm({
  grade,
  onSave,
  onCancel,
  isPending,
}: {
  grade: YearGPAResponse['grades'][number];
  onSave: (data: SemesterGradeUpdate) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [courseName, setCourseName] = useState(grade.course_name);
  const [letterGrade, setLetterGrade] = useState<SemesterGradeCreate['grade']>(grade.grade);
  const [credits, setCredits] = useState(Number(grade.credits) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    onSave({
      course_name: courseName.trim(),
      grade: letterGrade,
      credits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="과목명"
        className="min-w-0 flex-1 rounded border border-grey-2 px-2 py-1 text-sm"
      />
      <select
        value={letterGrade}
        onChange={(e) => setLetterGrade(e.target.value as SemesterGradeCreate['grade'])}
        className="w-16 rounded border border-grey-2 px-2 py-1 text-sm"
      >
        {LETTER_GRADES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        max={10}
        value={credits}
        onChange={(e) => setCredits(Number(e.target.value) || 0)}
        className="w-14 rounded border border-grey-2 px-2 py-1 text-sm"
      />
      <span className="text-sm text-grey-9">학점</span>
      <div className="flex gap-1">
        <button type="button" onClick={onCancel} className="text-sm text-grey-9" disabled={isPending}>
          취소
        </button>
        <button type="submit" className="text-sm text-primary-shinhanblue" disabled={isPending}>
          {isPending ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
}

function CreditsCard({ year, gpaData }: { year: number; gpaData: YearGPAResponse }) {
  const current = gpaData.total_credits;
  const required = CREDITS_REQUIRED;
  const isOk = current >= required;
  const breakdown = gpaData.semester_breakdown ?? [];
  const deadline = `${year}년 12월 31일`;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>학점</span>
        <span className={styles.gpaValue}>
          {current} / {required}
        </span>
      </div>
      <div className={styles.gpaRow}>
        <ProgressBar
          value={current}
          max={Math.max(required, current)}
          className={styles.gpaBar}
        />
        <span className={cn(styles.hintIcon, isOk ? 'text-state-green-dark' : 'text-state-red')}>
          <Icon name={isOk ? 'IconLLineTickCircle' : 'IconLLineInfoCircle'} size={20} />
        </span>
        <span className={cn(styles.hintLabel, isOk ? 'text-state-green-dark' : 'text-state-red')}>
          {isOk ? '충족' : '미충족'}
        </span>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>이수 현황</span>
        <div className={styles.twoCol}>
          <span className={styles.label}>현재</span>
          <span className={styles.value}>{current}학점</span>
          <span className={styles.label}>필요</span>
          <span className={styles.value}>{required}학점</span>
        </div>
      </div>
      {breakdown.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>학기별 이수 현황</span>
          <div className={styles.semesterList}>
            {breakdown.map((item, i) => (
              <div key={i} className={styles.semesterRow}>
                <span className={styles.semesterLabel}>{year}-{item.semester}학기</span>
                <span className={styles.semesterValue}>{item.credits}학점</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.updateRow}>
        <div className={styles.updateItem}>
          <span className={styles.updateLabel}>마감일:</span>
          <span className={styles.updateValue}>{deadline}</span>
        </div>
      </div>
      <p className="body-7 text-grey-9 mt-2">
        학점은 위 학업성적 카드의 &quot;학기별 성적 추가&quot;로 입력하면 자동 반영됩니다.
      </p>
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
  wrapper: 'px-4 py-4 pb-8 space-y-4',
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
  submitButton: cn(
    'w-full mt-4 py-3 rounded-xl body-8 font-medium',
    'bg-primary-lighter text-primary-shinhanblue flex items-center justify-center gap-2',
  ),
  form: 'mt-4 pt-4 border-t border-grey-2 space-y-3',
  formLabel: 'block body-7 text-grey-9 mb-1',
  input: 'w-full px-4 py-3 rounded-lg border border-grey-2 body-8 text-grey-11 placeholder:text-grey-6',
  fileButton: 'w-full py-3 rounded-lg border-2 border-dashed border-grey-3 body-7 text-grey-7',
  cancelButton: 'flex-1 py-3 rounded-xl body-8 text-grey-9 bg-grey-2',
  primaryButton: 'flex-1 py-3 rounded-xl body-8 font-medium text-white bg-primary-shinhanblue',
} as const;
