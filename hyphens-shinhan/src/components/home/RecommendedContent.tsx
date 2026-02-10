'use client'

import { cn } from '@/utils/cn'
import { useVideos } from '@/hooks/videos/useVideos'
/** YouTube URL에서 video id 추출 (썸네일/링크용) */
function getYoutubeVideoId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.has('v')) {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('?')[0] || null
    }
    if (u.pathname.includes('/embed/')) {
      const m = u.pathname.match(/\/embed\/([^/?]+)/)
      return m ? m[1] : null
    }
  } catch {
    return null
  }
  return null
}

/** YouTube video id로 썸네일 URL (로고 없음) */
function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

interface RecommendedContentProps {
  className?: string
}

/**
 * 추천 콘텐츠 – videos API 목록 조회, 썸네일 표시 후 클릭 시 YouTube 이동 (임베드 미사용으로 로고 비노출)
 */
export default function RecommendedContent({ className }: RecommendedContentProps) {
  const { data, isLoading, isError, error } = useVideos()

  const videos = data?.videos ?? []
  const withYoutubeId = videos.filter((v) => getYoutubeVideoId(v.url))

  if (isLoading) {
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
    )
  }

  if (isError) {
    return (
      <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
        <h2 className={styles.title}>추천 콘텐츠</h2>
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-grey-2 bg-grey-1-1 px-4 py-6">
          <p className="body-8 text-grey-8 text-center">
            {error instanceof Error ? error.message : '추천 콘텐츠를 불러오지 못했습니다.'}
          </p>
        </div>
      </section>
    )
  }

  if (withYoutubeId.length === 0) {
    return (
      <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
        <h2 className={styles.title}>추천 콘텐츠</h2>
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-grey-2 bg-grey-1-1 px-4 py-6">
          <p className="body-8 text-grey-8 text-center">추천 콘텐츠가 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(styles.section, className)} aria-label="추천 콘텐츠">
      <h2 className={styles.title}>추천 콘텐츠</h2>
      <div className={styles.cardList}>
        {withYoutubeId.map((video) => {
          const videoId = getYoutubeVideoId(video.url)
          if (!videoId) return null
          return (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              aria-label={`${video.title} 영상 보기`}
            >
              <div className={styles.thumbnail}>
                <img
                  src={video.thumbnail_url ?? youtubeThumbnailUrl(videoId)}
                  alt=""
                  className="h-full w-full object-cover rounded-t-[16px] scale-105"
                  loading="lazy"
                />
              </div>
              <div className={styles.textBlock}>
                <span className={styles.cardTitle}>{video.title}</span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

const styles = {
  section: 'flex flex-col gap-5 py-7',
  title: 'title-16 text-grey-11',
  cardList: 'grid grid-cols-2 gap-2',
  card: cn(
    'flex flex-col rounded-[16px] border border-grey-2 bg-white overflow-hidden',
    'transition-opacity active:opacity-80'
  ),
  thumbnail: 'h-[110px] w-full shrink-0 overflow-hidden relative bg-grey-3 rounded-t-[16px]',
  textBlock: 'flex flex-col gap-1.5 p-3 flex-1 min-w-0',
  cardTitle: 'title-14 text-grey-11 line-clamp-2',
  skeleton: 'animate-pulse rounded-2xl border border-grey-2 bg-white overflow-hidden',
  skeletonThumb: 'h-[110px] w-full bg-grey-3',
  skeletonText: 'p-3 space-y-2',
  skeletonLine: 'h-3 bg-grey-3 rounded',
} as const
