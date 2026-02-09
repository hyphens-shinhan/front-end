import MaintenanceReviewTabs from '@/components/scholarship/maintenance/MaintenanceReviewTabs';

/** 유지심사 현황 상세보기 페이지 (전체 / 학업 / 활동 / 소득 탭) */
export default function MaintenanceReviewDetailPage() {
  return (
    <div className="flex flex-col h-full">
      <MaintenanceReviewTabs />
    </div>
  );
}
