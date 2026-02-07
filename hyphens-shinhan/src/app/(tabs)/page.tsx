import DocumentGuideCard from '@/components/home/DocumentGuideCard';
import HomeContentCard from '@/components/home/HomeContentCard';
import ProfileCardWithQR from '@/components/home/ProfileCardWithQR';

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <DocumentGuideCard />
      <ProfileCardWithQR />
      <div className="flex min-h-full flex-1 flex-col bg-primary-lighter">
        <HomeContentCard />
      </div>
      {/* 스크롤 끝까지 내렸을 때 그라데이션 대신 흰 배경이 보이도록 */}
      <div className="min-h-[60vh] flex-shrink-0 bg-white" aria-hidden />
    </div>
  );
}
