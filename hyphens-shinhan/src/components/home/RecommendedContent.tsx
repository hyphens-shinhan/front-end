'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';

/** 추천 콘텐츠 한 건 (Figma 카드) */
export interface RecommendedContentItem {
  /** 카드 제목 */
  title: string;
  /** 카드 설명 */
  description: string;
  /** 썸네일 이미지 URL (없으면 회색 플레이스홀더) */
  imageUrl?: string;
  /** 클릭 시 이동 경로 (없으면 비링크 카드) */
  href?: string;
}

interface RecommendedContentProps {
  /** 없으면 Figma 기본 2개 사용 */
  items?: RecommendedContentItem[];
  className?: string;
}

/** Figma 기본: 장학금 신청 가이드, 대학생활 성공 전략 */
export const DEFAULT_RECOMMENDED_ITEMS: RecommendedContentItem[] = [
  {
    title: '장학금 신청 가이드',
    description: '장학금 신청 절차와 필요한 서류를 안내합니다',
    href: '#',
  },
  {
    title: '대학생활 성공 전략',
    description: '효과적인 시간관리와 학습 방법을 소개합니다',
    href: '#',
  },
];

/**
 * 홈 추천 콘텐츠 섹션 (Figma: Frame 1321316449)
 * - 섹션 타이틀 + 가로 2열 카드
 */
export default function RecommendedContent({
  items = DEFAULT_RECOMMENDED_ITEMS,
  className,
}: RecommendedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
      <h2 className={styles.title}>추천 콘텐츠</h2>
      <div className={styles.cardList}>
        {items.map((item, index) => (
          <RecommendedContentCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

function RecommendedContentCard({ item }: { item: RecommendedContentItem }) {
  const content = (
    <>
      <div className={styles.thumbnail}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover rounded-t-[16px]"
          />
        ) : (
          <div className={styles.thumbnailPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.textBlock}>
        <span className={styles.cardTitle}>{item.title}</span>
        <span className={styles.cardDescription}>{item.description}</span>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={styles.card}>
        {content}
      </Link>
    );
  }

  return <div className={styles.card}>{content}</div>;
}

const styles = {
  section: 'flex flex-col gap-5 py-7',
  title: 'title-16 text-grey-11',
  cardList: 'grid grid-cols-2 gap-2',
  card: cn(
    'flex flex-col rounded-2xl border border-grey-2 bg-white overflow-hidden',
    'min-h-[203px] transition-opacity active:opacity-80',
  ),
  thumbnail: 'h-[110px] w-full shrink-0 overflow-hidden',
  thumbnailPlaceholder: 'h-full w-full bg-grey-3 rounded-t-[16px]',
  textBlock: 'flex flex-col gap-1.5 p-3 flex-1 min-w-0',
  cardTitle: 'title-14 text-grey-11 line-clamp-2',
  cardDescription: 'body-10 text-grey-9 line-clamp-2',
} as const;
