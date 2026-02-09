import { Suspense } from 'react';
import EmptyContent from '@/components/common/EmptyContent';
import { EMPTY_CONTENT_MESSAGES } from '@/constants';
import MaintenanceReviewTabs from '@/components/scholarship/maintenance/MaintenanceReviewTabs';

/** useSearchParams 사용으로 인한 빌드 시 Suspense 필요 */
function MaintenancePageFallback() {
  return (
    <EmptyContent
      variant="loading"
      message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
    />
  );
}

/** 유지심사 현황 상세보기 페이지 (전체 / 학업 / 활동 / 소득 탭) */
export default function MaintenanceReviewDetailPage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<MaintenancePageFallback />}>
        <MaintenanceReviewTabs />
      </Suspense>
    </div>
  );
}
