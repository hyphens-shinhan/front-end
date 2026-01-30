import apiClient from './apiClient'
import {
  CommentResponse,
  CommentListResponse,
  CommentCreate,
  CommentUpdate,
} from '@/types/comments'

/**
 * 댓글 관련 API 서비스
 */
export const CommentService = {
  /**
   * 게시글의 댓글 목록 조회
   * @param postId 게시글 ID
   * @param limit 가져올 개수
   * @param offset 시작 위치
   */
  getComments: async (
    postId: string,
    limit = 50,
    offset = 0,
  ): Promise<CommentListResponse> => {
    const response = await apiClient.get<CommentListResponse>(
      `/posts/${postId}/comments`,
      {
        params: { limit, offset },
      },
    )
    return response.data
  },

  /**
   * 댓글 생성
   * @param postId 게시글 ID
   * @param data 댓글 생성 데이터 (내용, 익명여부, 부모댓글ID 등)
   */
  createComment: async (
    postId: string,
    data: CommentCreate,
  ): Promise<CommentResponse> => {
    const response = await apiClient.post<CommentResponse>(
      `/posts/${postId}/comments`,
      data,
    )
    return response.data
  },

  /**
   * 단일 댓글 조회
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   */
  getComment: async (
    postId: string,
    commentId: string,
  ): Promise<CommentResponse> => {
    const response = await apiClient.get<CommentResponse>(
      `/posts/${postId}/comments/${commentId}`,
    )
    return response.data
  },

  /**
   * 댓글 수정
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   * @param data 수정할 내용
   */
  updateComment: async (
    postId: string,
    commentId: string,
    data: CommentUpdate,
  ): Promise<CommentResponse> => {
    const response = await apiClient.patch<CommentResponse>(
      `/posts/${postId}/comments/${commentId}`,
      data,
    )
    return response.data
  },

  /**
   * 댓글 삭제
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   */
  deleteComment: async (
    postId: string,
    commentId: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/posts/${postId}/comments/${commentId}`,
    )
    return response.data
  },
}
