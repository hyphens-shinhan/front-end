import { cn } from '@/utils/cn';
import DocumentGuideCard from './DocumentGuideCard';
import HomeContentCard from './HomeContentCard';
import ProfileCardWithQR from './ProfileCardWithQR';
import RecommendedContent from './RecommendedContent';

/** 홈 탭 전체 레이아웃: 문서 안내 + 프로필 카드 레이어 + 스크롤 영역 */
export default function HomePageContent() {
  return (
    <div className={styles.root}>
      <DocumentGuideCard />
      {/* 아래 영역: 최소 높이 보장 + 콘텐츠만큼 늘어나서 전체가 한 번에 스크롤됨 */}
      <div className={styles.contentWrapper}>
        {/* 레이어 1: 프로필 카드 (영역 전체 채움, z-0) */}
        <div className={styles.profileLayer}>
          <ProfileCardWithQR />
        </div>
        {/* 레이어 2: min-h로 flex 높이 확정 → flex-1 영역 높이 정상, 터치 통과로 프로필 드래그 */}
        <div className={styles.scrollLayer}>
          {/* 상단: 배경 없음, 터치 통과 → 프로필 카드 드래그됨 */}
          <div className={styles.spacer} aria-hidden />
          {/* 하단: 남은 높이 채움 + 콘텐츠 많으면 늘어나서 전체 스크롤 */}
          <div className={styles.scrollArea}>
            <HomeContentCard />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: cn('relative flex min-h-full flex-col'),
  contentWrapper: cn('relative'),
  profileLayer: cn('absolute inset-0 z-0'),
  scrollLayer: cn('pointer-events-none relative z-10 flex flex-col'),
  spacer: cn('h-32 shrink-0'),
  scrollArea: cn(
    'pointer-events-auto min-h-0 flex-1 overflow-y-auto bg-primary-lighter',
  ),
  recommendedWrap: 'pointer-events-auto shrink-0',
} as const;
