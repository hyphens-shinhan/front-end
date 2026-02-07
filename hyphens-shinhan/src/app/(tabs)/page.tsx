import DocumentGuideCard from '@/components/home/DocumentGuideCard';
import HomeContentCard from '@/components/home/HomeContentCard';
import ProfileCardWithQR from '@/components/home/ProfileCardWithQR';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <DocumentGuideCard />
      <ProfileCardWithQR />
      <div className="flex min-h-full flex-1 flex-col bg-primary-lighter">
        <HomeContentCard />
      </div>
    </div>
  );
}
