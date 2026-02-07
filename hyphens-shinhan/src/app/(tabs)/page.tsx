import DocumentGuideCard from '@/components/home/DocumentGuideCard';
import HomeContentCard from '@/components/home/HomeContentCard';
import ProfileCardWithQR from '@/components/home/ProfileCardWithQR';

export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <DocumentGuideCard />
      {/* 아래 영역: 최소 높이 보장 + 콘텐츠만큼 늘어나서 전체가 한 번에 스크롤됨 */}
      <div className="relative">
        {/* 레이어 1: 프로필 카드 (영역 전체 채움, z-0) */}
        <div className="absolute inset-0 z-0">
          <ProfileCardWithQR />
        </div>
        {/* 레이어 2: min-h로 flex 높이 확정 → flex-1 영역 높이 정상, 터치 통과로 프로필 드래그 */}
        <div className="pointer-events-none relative z-10 flex flex-col">
          {/* 상단: 배경 없음, 터치 통과 → 프로필 카드 드래그됨 */}
          <div className="h-32 shrink-0" aria-hidden />
          {/* 하단: 남은 높이 채움 + 콘텐츠 많으면 늘어나서 전체 스크롤 */}
          <div className="pointer-events-auto min-h-0 flex-1 overflow-y-auto bg-primary-lighter">
            <HomeContentCard />
          </div>
        </div>
      </div>
    </div>
  );
}
