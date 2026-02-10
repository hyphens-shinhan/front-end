import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VideoService } from '@/services/videos'
import { videoKeys } from './useVideos'
import type { VideoCreate } from '@/types/videos'

/**
 * 비디오 생성 (ADMIN 전용)
 * POST /videos
 */
export const useCreateVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VideoCreate) => VideoService.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.list() })
    },
  })
}

/**
 * 비디오 삭제 (ADMIN 전용)
 * DELETE /videos/{video_id}
 */
export const useDeleteVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (videoId: string) => VideoService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.list() })
    },
  })
}
