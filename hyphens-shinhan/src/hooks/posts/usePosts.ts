import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { PostService } from '@/services/posts'
import { EventStatus } from '@/types/posts'

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (type: string, filters: any) =>
    [...postKeys.lists(), type, filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

/**
 * 피드 게시글 목록 조회 (무한 스크롤)
 */
export const useInfiniteFeedPosts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.list('feed', { limit }),
    queryFn: ({ pageParam = 0 }) => PostService.getFeedPosts(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

/**
 * 익명 피드 게시글 목록 조회 (무한 스크롤)
 */
export const useInfiniteAnonymousFeedPosts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.list('feed-anonymous', { limit }),
    queryFn: ({ pageParam = 0 }) =>
      PostService.getAnonymousFeedPosts(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

/**
 * 공지사항 목록 조회
 */
export const useNoticePosts = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: postKeys.list('notice', { limit, offset }),
    queryFn: () => PostService.getNoticePosts(limit, offset),
  })
}

/**
 * 이벤트 목록 조회
 */
export const useEventPosts = (status?: EventStatus, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: postKeys.list('event', { status, limit, offset }),
    queryFn: () => PostService.getEventPosts(status, limit, offset),
  })
}

/**
 * 피드 게시글 상세 조회
 */
export const useFeedPost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getFeedPost(postId),
    enabled: !!postId,
  })
}

/**
 * 공지사항 상세 조회
 */
export const useNoticePost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getNoticePost(postId),
    enabled: !!postId,
  })
}

/**
 * 이벤트 상세 조회
 */
export const useEventPost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getEventPost(postId),
    enabled: !!postId,
  })
}
