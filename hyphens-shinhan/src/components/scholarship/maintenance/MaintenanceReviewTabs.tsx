'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Tab from '@/components/common/Tab';
import { cn } from '@/utils/cn';
import MaintenanceReviewProgress from './MaintenanceReviewProgress';
import MaintenanceTabAll from './MaintenanceTabAll';
import MaintenanceTabAcademic from './MaintenanceTabAcademic';
import MaintenanceTabActivity from './MaintenanceTabActivity';
import MaintenanceTabIncome from './MaintenanceTabIncome';

export const MAINTENANCE_TAB = {
  ALL: '전체',
  ACADEMIC: '학업',
  ACTIVITY: '활동',
  INCOME: '소득',
} as const;

export type MaintenanceTabValue =
  (typeof MAINTENANCE_TAB)[keyof typeof MAINTENANCE_TAB];

const TAB_ORDER: MaintenanceTabValue[] = [
  MAINTENANCE_TAB.ALL,
  MAINTENANCE_TAB.ACADEMIC,
  MAINTENANCE_TAB.ACTIVITY,
  MAINTENANCE_TAB.INCOME,
];

/** 유지심사 현황 상세 - 4가지 탭 (전체, 학업, 활동, 소득) */
export default function MaintenanceReviewTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as MaintenanceTabValue | null;
  const activeTab =
    TAB_ORDER.includes(tabFromUrl as MaintenanceTabValue)
      ? tabFromUrl
      : MAINTENANCE_TAB.ALL;

  const handleTabClick = (tab: MaintenanceTabValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.container}>
      {/** 유지심사 진행률 */}
      <MaintenanceReviewProgress
        yearLabel="2025 장학금"
        tagLabel="유의 필요"
        progress={60}
        noticeMessage="장학금 유지 위험! 조금만 더 신경써주세요."
      />

      <div className={styles.tabRow}>
        {TAB_ORDER.map((tab) => (
          <Tab
            key={tab}
            isActive={activeTab === tab}
            title={tab}
            onClick={() => handleTabClick(tab)}
          />
        ))}
      </div>
      <div className={styles.content}>
        {activeTab === MAINTENANCE_TAB.ALL && <MaintenanceTabAll />}
        {activeTab === MAINTENANCE_TAB.ACADEMIC && <MaintenanceTabAcademic />}
        {activeTab === MAINTENANCE_TAB.ACTIVITY && <MaintenanceTabActivity />}
        {activeTab === MAINTENANCE_TAB.INCOME && <MaintenanceTabIncome />}
      </div>
    </div>
  );
}

const styles = {
  container: cn('flex flex-col h-full'),
  tabRow: cn('flex flex-row px-4 py-2'),
  content: cn('flex-1 overflow-y-auto scrollbar-hide'),
  progressContainer: cn('px-4'),
} as const;
