'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import {
  getRecommendedContents,
  type RecommendedContent as ApiRecommendedContent,
} from '@/services/recommended-content';

/** API 데이터 없을 때 표시할 기본 카드 */
const FALLBACK_ITEMS: Pick<ApiRecommendedContent, 'id' | 'title' | 'description'> &
  { youtube_video_id?: string }[] = [
  {
    id: 'fallback-1',
    title: '장학금 신청 가이드',
    description: '장학금 신청 절차와 필요한 서류를 안내합니다',
  },
  {
    id: 'fallback-2',
    title: '대학생활 성공 전략',
    description: '효과적인 시간관리와 학습 방법을 소개합니다',
  },
];

interface RecommendedContentProps {
  className?: string;
}

const styles = {
  section: 'flex flex-col gap-5 py-7',
  title: 'title-16 text-grey-11',
  cardList: 'grid grid-cols-2 gap-2',
  card: cn(
    'flex flex-col rounded-2xl border border-grey-2 bg-white overflow-hidden',
    'min-h-[203px] transition-opacity active:opacity-80'
  ),
  thumbnail: 'h-[110px] w-full shrink-0 overflow-hidden relative bg-grey-3',
  thumbnailPlaceholder: 'h-full w-full bg-grey-3 rounded-t-[16px]',
  textBlock: 'flex flex-col gap-1.5 p-3 flex-1 min-w-0',
  cardTitle: 'title-14 text-grey-11 line-clamp-2',
  cardDescription: 'body-10 text-grey-9 line-clamp-2',
  skeleton: 'animate-pulse rounded-2xl border border-grey-2 bg-white overflow-hidden',
  skeletonThumb: 'h-[110px] w-full bg-grey-3',
  skeletonText: 'p-3 space-y-2',
  skeletonLine: 'h-3 bg-grey-3 rounded',
} as const;

/**
 * 추천 콘텐츠 – hyphens-frontend와 동일: API에서 목록 조회 후 YouTube embed
 */
export default function RecommendedContent({ className }: RecommendedContentProps) {
  const [contents, setContents] = useState<
    (ApiRecommendedContent & { youtube_video_id?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContents() {
      try {
        setLoading(true);
        const data = await getRecommendedContents();
        if (data?.length) {
          const valid = data.filter((c) => c.youtube_video_id);
          setContents(valid.length > 0 ? valid : FALLBACK_ITEMS);
        } else {
          setContents(FALLBACK_ITEMS);
        }
      } catch {
        setContents(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    }
    fetchContents();
  }, []);

  if (loading) {
    return (
      <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
        <h2 className={styles.title}>추천 콘텐츠</h2>
        <div className={styles.cardList}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonText}>
                <div className={cn(styles.skeletonLine, 'w-4/5')} />
                <div className={cn(styles.skeletonLine, 'w-3/5')} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
      <h2 className={styles.title}>추천 콘텐츠</h2>
      <div className={styles.cardList}>
        {contents.map((content) => (
          <div key={content.id} className={styles.card}>
            <div className={styles.thumbnail}>
              {content.youtube_video_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${content.youtube_video_id}`}
                  title={content.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-t-[16px]"
                  loading="lazy"
                />
              ) : (
                <div className={styles.thumbnailPlaceholder} aria-hidden />
              )}
            </div>
            <div className={styles.textBlock}>
              <span className={styles.cardTitle}>{content.title}</span>
              {content.description && (
                <span className={styles.cardDescription}>{content.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
