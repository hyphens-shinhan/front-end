'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import DocumentGuideCard from './DocumentGuideCard';
import HomeContentCard from './HomeContentCard';
import ProfileCardWithQR from './ProfileCardWithQR';

const springOpen = { type: 'spring', stiffness: 300, damping: 30 } as const;
const springClose = { type: 'spring', stiffness: 500, damping: 40 } as const;

/** 홈 탭 전체 레이아웃: 문서 안내 + 프로필 카드 레이어 + 스크롤 영역 */
export default function HomePageContent() {
  const [isQRExpanded, setIsQRExpanded] = useState(false);

  return (
    <div className={cn(styles.root, isQRExpanded && 'overflow-hidden')}>
      {/* QR 펼침 시 문서 안내 영역이 위로 접혀서 프로필+QR이 상단까지 차지 */}
      <motion.div
        className="overflow-hidden shrink-0"
        animate={{ height: isQRExpanded ? 0 : 'auto' }}
        transition={isQRExpanded ? springOpen : springClose}
      >
        <DocumentGuideCard />
      </motion.div>
      {/* 아래 영역: 최소 높이 보장 + 콘텐츠만큼 늘어나서 전체가 한 번에 스크롤됨 */}
      <div className={styles.contentWrapper}>
        {/* 레이어 1: 프로필 카드 — 항상 absolute, QR 확장 시 z-20 */}
        <div
          className={cn(
            styles.profileLayer,
            isQRExpanded && 'z-20',
          )}
        >
          <ProfileCardWithQR onQRExpandChange={setIsQRExpanded} />
        </div>
        {/* 레이어 2: 항상 렌더링, opacity만 전환하여 레이아웃 점프 방지 */}
        <motion.div
          className={styles.scrollLayer}
          animate={{ opacity: isQRExpanded ? 0 : 1 }}
          transition={isQRExpanded ? { duration: 0.15 } : { duration: 0.3, delay: 0.1 }}
        >
          {/* 상단: 배경 없음, 터치 통과 → 프로필 카드 드래그됨 */}
          <div className={styles.spacer} aria-hidden />
          {/* 하단: 남은 높이 채움 + 콘텐츠 많으면 늘어나서 전체 스크롤 */}
          <div
            className={cn(
              styles.scrollArea,
              isQRExpanded && 'pointer-events-none',
            )}
          >
            <HomeContentCard />
          </div>
        </motion.div>
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
