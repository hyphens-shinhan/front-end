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
  /** 이벤트 상세 쿼리 무효화 시 사용 (detail과 동일) */
  eventDetail: (id: string) => postKeys.detail(id),
  /** 내가 신청한 이벤트 목록 쿼리 키 */
  myAppliedEvents: () => [...postKeys.lists(), 'event', 'me-applied'] as const,
  /** 내가 작성한 포스트 목록 쿼리 키 */
  myPosts: (limit?: number, offset?: number) =>
    [...postKeys.lists(), 'me', limit, offset] as const,
  /** 특정 유저(멘토)가 작성한 포스트 목록 쿼리 키 */
  userPosts: (userId: string, limit?: number, offset?: number) =>
    [...postKeys.lists(), 'user', userId, limit, offset] as const,
  /** 공개 리포트 피드 쿼리 키 */
  publicReportsFeed: (limit?: number, offset?: number) =>
    [...postKeys.lists(), 'council', limit, offset] as const,
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
 * @param options 옵션 (enabled: 쿼리 활성화 여부)
 */
export const useFeedPost = (
  postId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => PostService.getFeedPost(postId),
    enabled: options?.enabled !== undefined ? options.enabled : !!postId,
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

/**
 * [EVENT] 내가 신청한 이벤트 목록 조회
 * @param limit 가져올 개수
 * @param offset 시작 위치
 */
export const useMyAppliedEventPosts = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: [...postKeys.myAppliedEvents(), limit, offset],
    queryFn: () => PostService.getMyAppliedEventPosts(limit, offset),
  })
}

/**
 * 내가 작성한 포스트 목록 조회 (무한 스크롤)
 * Feed + Council Report 통합
 * @param limit 가져올 개수
 */
export const useInfiniteMyPosts = (
  limit = 20,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: postKeys.myPosts(limit),
    queryFn: ({ pageParam = 0 }) => PostService.getMyPosts(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
    ...options,
  })
}

/**
 * 내가 작성한 포스트 목록 조회
 * Feed + Council Report 통합
 * @param limit 가져올 개수
 * @param offset 시작 위치
 */
export const useMyPosts = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: postKeys.myPosts(limit, offset),
    queryFn: () => PostService.getMyPosts(limit, offset),
  })
}

/**
 * 특정 유저(멘토)가 작성한 포스트 목록 조회
 * GET /posts/user/{userId}
 */
export const useUserPosts = (
  userId: string | null,
  limit = 20,
  offset = 0,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postKeys.userPosts(userId ?? '', limit, offset),
    queryFn: () =>
      userId
        ? PostService.getUserPosts(userId, limit, offset)
        : Promise.resolve({ posts: [], total: 0 }),
    ...options,
  })
}

/**
 * 특정 유저(멘토)가 작성한 포스트 목록 조회 (무한 스크롤)
 * GET /posts/user/{userId}
 */
export const useInfiniteUserPosts = (
  userId: string | null,
  limit = 20,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.userPosts(userId ?? '', limit), 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      userId
        ? PostService.getUserPosts(userId, limit, pageParam)
        : Promise.resolve({ posts: [], total: 0 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
    ...options,
  })
}

/**
 * 공개 리포트 피드 조회 (무한 스크롤)
 * @param limit 가져올 개수
 */
export const useInfinitePublicReportsFeed = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.publicReportsFeed(limit),
    queryFn: ({ pageParam = 0 }) =>
      PostService.getPublicReportsFeed(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // PublicReportResponse[]는 배열이므로, 길이로 다음 페이지 여부 판단
      const hasMore = lastPage.length === limit
      return hasMore ? allPages.length * limit : undefined
    },
  })
}

/**
 * 공개 리포트 피드 조회
 * @param limit 가져올 개수
 * @param offset 시작 위치
 */
export const usePublicReportsFeed = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: postKeys.publicReportsFeed(limit, offset),
    queryFn: () => PostService.getPublicReportsFeed(limit, offset),
  })
}

/**
 * 자치회 리포트 상세 조회
 * @param postId 게시글 ID
 */
export const useCouncilReport = (
  postId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...postKeys.all, 'council', postId],
    queryFn: () => PostService.getCouncilReport(postId),
    enabled: options?.enabled !== undefined ? options.enabled : !!postId,
  })
}
