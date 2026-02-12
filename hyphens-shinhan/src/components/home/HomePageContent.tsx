'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useUserStore, toNavRole } from '@/stores';
import DocumentGuideCard from './DocumentGuideCard';
import ActivityDdayCard from './ActivityDdayCard';
import HomeContentCard from './HomeContentCard';
import ProfileCardWithQR from './ProfileCardWithQR';

/** 홈 탭 전체 레이아웃: 역할별 배너(OB=날씨, YB/YB팀장=D-day) + 프로필 카드 레이어 + 스크롤 영역 */
export default function HomePageContent() {
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const user = useUserStore((s) => s.user);
  const navRole = user ? toNavRole(user.role) : 'YB';
  const isOB = navRole === 'OB';

  return (
    <div className={styles.root}>
      {/* QR 펼침 시 배너 영역이 위로 접혀서 프로필+QR이 상단까지 차지 */}
      <motion.div
        className="overflow-hidden shrink-0"
        animate={{ height: isQRExpanded ? 0 : 'auto' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {isOB ? <DocumentGuideCard /> : <ActivityDdayCard />}
      </motion.div>
      {/* 아래 영역: 최소 높이 보장 + 콘텐츠만큼 늘어나서 전체가 한 번에 스크롤됨 */}
      <div className={styles.contentWrapper}>
        {/* 레이어 1: 프로필 카드 (QR 확장 시 z-20으로 올려서 scrollArea 위에 표시) */}
        <div
          className={cn(
            styles.profileLayer,
            isQRExpanded && 'z-20',
          )}
        >
          <ProfileCardWithQR onQRExpandChange={setIsQRExpanded} />
        </div>
        {/* 레이어 2: min-h로 flex 높이 확정 → flex-1 영역 높이 정상, 터치 통과로 프로필 드래그 */}
        <div className={styles.scrollLayer}>
          {/* 상단: 배경 없음, 터치 통과 → 프로필 카드 드래그됨 */}
          <div className={styles.spacer} aria-hidden />
          {/* 하단: 남은 높이 채움 + 콘텐츠 많으면 늘어나서 전체 스크롤 */}
          <div
            className={cn(
              styles.scrollArea,
              isQRExpanded && 'opacity-0 pointer-events-none',
            )}
          >
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
    'transition-opacity duration-300',
  ),
  recommendedWrap: 'pointer-events-auto shrink-0',
} as const;
