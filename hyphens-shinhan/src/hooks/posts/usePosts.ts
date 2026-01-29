import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { PostService } from '@/services/posts'
import { EventStatus } from '@/types/posts'

/**
 * 쿼리 키 관리 객체
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (type: string, filters: any) =>
    [...postKeys.lists(), type, filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

/**
 * [FEED] 피드 게시글 목록 조회 (무한 스크롤)
 * @param limit 가져올 개수
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
 * [FEED] 익명 피드 게시글 목록 조회 (무한 스크롤)
 * @param limit 가져올 개수
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
 * [NOTICE] 공지사항 목록 조회 (무한 스크롤)
 * @param limit 가져올 개수
 */
export const useInfiniteNoticePosts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.list('notice', { limit }),
    queryFn: ({ pageParam = 0 }) =>
      PostService.getNoticePosts(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

/**
 * [EVENT] 이벤트 목록 조회 (무한 스크롤)
 * @param status 이벤트 상태 필터 (OPEN, CLOSED, SCHEDULED)
 * @param limit 가져올 개수
 */
export const useInfiniteEventPosts = (status?: EventStatus, limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.list('event', { status, limit }),
    queryFn: ({ pageParam = 0 }) =>
      PostService.getEventPosts(status, limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

/**
 * [FEED] 피드 게시글 상세 조회
 * @param postId 게시글 ID
 */
export const useFeedPost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getFeedPost(postId),
    enabled: !!postId,
  })
}

/**
 * [NOTICE] 공지사항 상세 조회
 * @param postId 게시글 ID
 */
export const useNoticePost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getNoticePost(postId),
    enabled: !!postId,
  })
}

/**
 * [EVENT] 이벤트 상세 조회
 * @param postId 게시글 ID
 */
export const useEventPost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getEventPost(postId),
    enabled: !!postId,
  })
}
