import apiClient from './apiClient'
import {
  FeedPostResponse,
  NoticePostResponse,
  EventPostResponse,
  PostListResponse,
  FeedPostCreate,
  FeedPostUpdate,
  NoticePostCreate,
  NoticePostUpdate,
  EventPostCreate,
  EventPostUpdate,
  EventStatus,
  EventApplyResponse,
  EventCancelApplyResponse,
  ToggleLikeResponse,
  ToggleScrapResponse,
  MyPostsResponse,
  PublicReportResponse,
} from '@/types/posts'

/**
 * 게시글 관련 API 서비스
 */
export const PostService = {
  // --- FEED API ---

  /**
   * [FEED] 피드 게시글 목록 조회
   * @param limit 가져올 개수
   * @param offset 시작 위치
   */
  getFeedPosts: async (
    limit = 20,
    offset = 0,
  ): Promise<PostListResponse<FeedPostResponse>> => {
    const response = await apiClient.get<PostListResponse<FeedPostResponse>>(
      '/posts/feed',
      {
        params: { limit, offset },
      },
    )
    return response.data
  },

  /**
   * [FEED] 익명 피드 게시글 목록 조회
   */
  getAnonymousFeedPosts: async (
    limit = 20,
    offset = 0,
  ): Promise<PostListResponse<FeedPostResponse>> => {
    const response = await apiClient.get<PostListResponse<FeedPostResponse>>(
      '/posts/feed/anonymous',
      {
        params: { limit, offset },
      },
    )
    return response.data
  },

  /**
   * [FEED] 피드 게시글 상세 조회
   */
  getFeedPost: async (postId: string): Promise<FeedPostResponse> => {
    const response = await apiClient.get<FeedPostResponse>(
      `/posts/feed/${postId}`,
    )
    return response.data
  },

  /**
   * [FEED] 피드 게시글 생성
   */
  createFeedPost: async (data: FeedPostCreate): Promise<FeedPostResponse> => {
    const response = await apiClient.post<FeedPostResponse>('/posts/feed', data)
    return response.data
  },

  /**
   * [FEED] 피드 게시글 수정
   */
  updateFeedPost: async (
    postId: string,
    data: FeedPostUpdate,
  ): Promise<FeedPostResponse> => {
    const response = await apiClient.patch<FeedPostResponse>(
      `/posts/feed/${postId}`,
      data,
    )
    return response.data
  },

  // --- NOTICE API ---

  /**
   * [NOTICE] 공지사항 목록 조회
   */
  getNoticePosts: async (
    limit = 20,
    offset = 0,
  ): Promise<PostListResponse<NoticePostResponse>> => {
    const response = await apiClient.get<PostListResponse<NoticePostResponse>>(
      '/posts/notice',
      {
        params: { limit, offset },
      },
    )
    return response.data
  },

  /**
   * [NOTICE] 공지사항 상세 조회
   */
  getNoticePost: async (postId: string): Promise<NoticePostResponse> => {
    const response = await apiClient.get<NoticePostResponse>(
      `/posts/notice/${postId}`,
    )
    return response.data
  },

  /**
   * [NOTICE] 공지사항 생성 (관리자 전용)
   */
  createNoticePost: async (
    data: NoticePostCreate,
  ): Promise<NoticePostResponse> => {
    const response = await apiClient.post<NoticePostResponse>(
      '/posts/notice',
      data,
    )
    return response.data
  },

  /**
   * [NOTICE] 공지사항 수정 (관리자 전용)
   */
  updateNoticePost: async (
    postId: string,
    data: NoticePostUpdate,
  ): Promise<NoticePostResponse> => {
    const response = await apiClient.patch<NoticePostResponse>(
      `/posts/notice/${postId}`,
      data,
    )
    return response.data
  },

  // --- EVENT API ---

  /**
   * [EVENT] 이벤트 목록 조회
   * @param status 이벤트 상태 필터 (OPEN, CLOSED, SCHEDULED)
   */
  getEventPosts: async (
    status?: EventStatus,
    limit = 20,
    offset = 0,
  ): Promise<PostListResponse<EventPostResponse>> => {
    const response = await apiClient.get<PostListResponse<EventPostResponse>>(
      '/posts/event',
      {
        params: { event_status: status, limit, offset },
      },
    )
    return response.data
  },

  /**
   * [EVENT] 이벤트 상세 조회
   */
  getEventPost: async (postId: string): Promise<EventPostResponse> => {
    const response = await apiClient.get<EventPostResponse>(
      `/posts/event/${postId}`,
    )
    return response.data
  },

  /**
   * [EVENT] 내가 신청한 이벤트 목록 조회
   */
  getMyAppliedEventPosts: async (
    limit = 20,
    offset = 0,
  ): Promise<PostListResponse<EventPostResponse>> => {
    const response = await apiClient.get<
      PostListResponse<EventPostResponse>
    >('/posts/event/me/applied', {
      params: { limit, offset },
    })
    return response.data
  },

  /**
   * [EVENT] 이벤트 신청
   */
  applyEventPost: async (
    postId: string,
  ): Promise<EventApplyResponse> => {
    const response = await apiClient.post<EventApplyResponse>(
      `/posts/event/${postId}/apply`,
    )
    return response.data
  },

  /**
   * [EVENT] 이벤트 신청 취소
   */
  cancelApplyEventPost: async (
    postId: string,
  ): Promise<EventCancelApplyResponse> => {
    const response = await apiClient.delete<EventCancelApplyResponse>(
      `/posts/event/${postId}/apply`,
    )
    return response.data
  },

  /**
   * [EVENT] 이벤트 생성 (관리자 전용)
   */
  createEventPost: async (
    data: EventPostCreate,
  ): Promise<EventPostResponse> => {
    const response = await apiClient.post<EventPostResponse>(
      '/posts/event',
      data,
    )
    return response.data
  },

  /**
   * [EVENT] 이벤트 수정 (관리자 전용)
   */
  updateEventPost: async (
    postId: string,
    data: EventPostUpdate,
  ): Promise<EventPostResponse> => {
    const response = await apiClient.patch<EventPostResponse>(
      `/posts/event/${postId}`,
      data,
    )
    return response.data
  },

  // --- COMMON API ---

  /**
   * 게시글 삭제 (본인 게시글만 가능)
   */
  deletePost: async (postId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/posts/${postId}`,
    )
    return response.data
  },

  /**
   * 게시글 좋아요 토글
   */
  toggleLike: async (postId: string): Promise<ToggleLikeResponse> => {
    const response = await apiClient.post<ToggleLikeResponse>(
      `/posts/${postId}/like`,
    )
    return response.data
  },

  /**
   * 피드 게시글 스크랩 토글 (FEED 타입만 가능)
   */
  toggleScrap: async (postId: string): Promise<ToggleScrapResponse> => {
    const response = await apiClient.post<ToggleScrapResponse>(
      `/posts/${postId}/scrap`,
    )
    return response.data
  },

  // --- MY POSTS API ---

  /**
   * 내가 작성한 포스트 목록 조회 (Feed + Council Report 통합)
   * @param limit 가져올 개수
   * @param offset 시작 위치
   */
  getMyPosts: async (
    limit = 20,
    offset = 0,
  ): Promise<MyPostsResponse> => {
    const response = await apiClient.get<MyPostsResponse>('/posts/me', {
      params: { limit, offset },
    })
    return response.data
  },

  /**
   * 공개 리포트 피드 조회
   * @param limit 가져올 개수
   * @param offset 시작 위치
   */
  getPublicReportsFeed: async (
    limit = 20,
    offset = 0,
  ): Promise<PublicReportResponse[]> => {
    const response = await apiClient.get<PublicReportResponse[]>(
      '/posts/council',
      {
        params: { limit, offset },
      },
    )
    return response.data
  },
}
