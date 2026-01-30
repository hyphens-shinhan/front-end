import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PostService } from '@/services/posts'
import { postKeys } from './usePosts'
import {
  FeedPostCreate,
  FeedPostUpdate,
  NoticePostCreate,
  NoticePostUpdate,
  EventPostCreate,
  EventPostUpdate,
} from '@/types/posts'

/**
 * [FEED] 피드 게시글 생성 훅
 */
export const useCreateFeedPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FeedPostCreate) => PostService.createFeedPost(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
  })
}

/**
 * [FEED] 피드 게시글 수정 훅
 */
export const useUpdateFeedPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: FeedPostUpdate }) =>
      PostService.updateFeedPost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * [NOTICE] 공지사항 생성 훅 (관리자 전용)
 */
export const useCreateNoticePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NoticePostCreate) => PostService.createNoticePost(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
  })
}

/**
 * [NOTICE] 공지사항 수정 훅 (관리자 전용)
 */
export const useUpdateNoticePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string
      data: NoticePostUpdate
    }) => PostService.updateNoticePost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * [EVENT] 이벤트 생성 훅 (관리자 전용)
 */
export const useCreateEventPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EventPostCreate) => PostService.createEventPost(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
  })
}

/**
 * [EVENT] 이벤트 수정 훅 (관리자 전용)
 */
export const useUpdateEventPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: EventPostUpdate }) =>
      PostService.updateEventPost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * 게시글 좋아요 토글 훅
 * @returns { liked: boolean, like_count: number }
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => PostService.toggleLike(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * 피드 게시글 스크랩 토글 훅 (FEED 타입만 가능)
 * @returns { scrapped: boolean, scrap_count: number }
 */
export const useToggleScrap = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => PostService.toggleScrap(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * 게시글 삭제 훅 (본인 게시글만 가능)
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => PostService.deletePost(postId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
  })
}
