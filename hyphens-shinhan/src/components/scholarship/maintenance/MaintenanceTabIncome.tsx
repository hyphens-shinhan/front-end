'use client';

import { useState, useRef } from 'react';
import { Icon } from '@/components/common/Icon';
import { useMaintenanceStore } from '@/stores/useMaintenanceStore';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

/** 유지심사 현황 - 소득 탭 (hyphens-frontend IncomeSection 내용) */
export default function MaintenanceTabIncome() {
  const dashboard = useMaintenanceStore((s) => s.dashboard);
  const income = dashboard.criteria.income;
  const addIncomeDocument = useMaintenanceStore((s) => s.addIncomeDocument);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  const isOk = income.status === '충족';
  const qualText = income.isBasicLivelihoodRecipient
    ? '기초생활수급자'
    : income.isLegalNextLevelClass
      ? '법정차상위계층'
      : income.supportBracket != null
        ? `${income.supportBracket}구간`
        : '미확인';

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>소득</span>
          <span className={cn(styles.statusBadge, isOk ? 'text-state-green-dark' : 'text-state-red')}>
            <Icon name={isOk ? 'IconLLineTickCircle' : 'IconLLineInfoCircle'} size={20} className="inline" />
            {' '}{income.status}
          </span>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>현재 구간</span>
          <span className={styles.value}>{qualText}</span>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>소득 기준</span>
          <div className={styles.detailList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>1</span>
              <span className={styles.detailValue}>기초생활수급자 또는 법정차상위계층</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>2</span>
              <span className={styles.detailValue}>
                한국장학재단 학자금 지원구간 {income.supportBracketRequired}구간 이내
              </span>
            </div>
          </div>
          <p className="body-7 text-grey-9 mt-2">※ 학자금 지원구간 통지서 확정 신청 필수 (4월/11월)</p>
        </div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>현재 상태</span>
          <div className={styles.twoCol}>
            <span className={styles.label}>기초생활수급자</span>
            <span className={styles.value}>{income.isBasicLivelihoodRecipient ? '예' : '아니오'}</span>
            <span className={styles.label}>법정차상위계층</span>
            <span className={styles.value}>{income.isLegalNextLevelClass ? '예' : '아니오'}</span>
            <span className={styles.label}>학자금 지원구간</span>
            <span className={styles.value}>
              {income.supportBracket != null ? `${income.supportBracket}구간` : '미확인'}
            </span>
          </div>
        </div>
        {income.documents && income.documents.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>제출 문서</span>
            <div className={styles.semesterList}>
              {income.documents.map((doc) => (
                <div key={doc.id} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{doc.name}</span>
                  <span
                    className={cn(
                      'body-7',
                      doc.status === 'approved' && 'text-state-green-dark',
                      doc.status === 'pending' && 'text-state-yellow-dark',
                      doc.status === 'rejected' && 'text-state-red',
                    )}
                  >
                    {doc.status === 'approved' ? '승인' : doc.status === 'pending' ? '대기' : '거부'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {income.nextApplicationDeadline && (
          <div className={styles.updateRow}>
            <div className={styles.updateItem}>
              <span className={styles.updateLabel}>다음 신청 기한:</span>
              <span className={styles.updateValue}>{formatDate(income.nextApplicationDeadline)}</span>
            </div>
          </div>
        )}
        <IncomeSubmitForm onAdd={addIncomeDocument} />
      </div>
    </div>
  );
}

function IncomeSubmitForm({ onAdd }: { onAdd: (name: string, file?: File) => void }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('증빙 자료를 선택해 주세요.');
      return;
    }
    onAdd(file.name, file);
    toast.show('제출되었습니다. 관리자 검토 후 반영됩니다.');
    setShow(false);
    setFile(null);
  };

  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className={styles.submitButton}>
        <Icon name="IconLLineArrowUp" size={18} />
        소득 증빙자료 제출
      </button>
    );
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button type="button" onClick={() => fileRef.current?.click()} className={styles.fileButton}>
        {file ? file.name : '파일 선택 (PDF, JPG, PNG)'}
      </button>
      <div className="flex gap-2">
        <button type="button" onClick={() => { setShow(false); setFile(null); }} className={styles.cancelButton}>취소</button>
        <button type="submit" className={styles.primaryButton}>제출하기</button>
      </div>
    </form>
  );
}

const styles = {
  wrapper: 'px-4 py-4 pb-8',
  card: cn('rounded-xl bg-white p-5', 'border border-grey-2'),
  cardHeader: 'flex flex-row justify-between items-center mb-3',
  cardTitle: 'title-14 text-grey-11',
  statusBadge: 'body-7 flex items-center gap-1',
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
  updateRow: 'flex flex-col gap-2 pt-2 border-t border-grey-2',
  updateItem: 'flex flex-col gap-0.5',
  updateLabel: 'body-7 text-grey-9',
  updateValue: 'body-8 text-grey-11',
  submitButton: cn(
    'w-full mt-4 py-3 rounded-xl body-8 font-medium',
    'bg-primary-lighter text-primary-shinhanblue flex items-center justify-center gap-2',
  ),
  form: 'mt-4 pt-4 border-t border-grey-2 space-y-3',
  fileButton: 'w-full py-3 rounded-lg border-2 border-dashed border-grey-3 body-7 text-grey-7',
  cancelButton: 'flex-1 py-3 rounded-xl body-8 text-grey-9 bg-grey-2',
  primaryButton: 'flex-1 py-3 rounded-xl body-8 font-medium text-white bg-primary-shinhanblue',
} as const;
