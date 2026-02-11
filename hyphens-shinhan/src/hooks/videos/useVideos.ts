import { useQuery } from '@tanstack/react-query'
import { VideoService } from '@/services/videos'

export const videoKeys = {
  all: ['videos'] as const,
  list: () => [...videoKeys.all, 'list'] as const,
}

/**
 * 비디오 목록 조회 (최신순)
 * GET /videos
 */
export const useVideos = () => {
  return useQuery({
    queryKey: videoKeys.list(),
    queryFn: () => VideoService.getVideos(),
  })
}
