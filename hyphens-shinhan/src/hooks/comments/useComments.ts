import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { CommentService } from '@/services/comments'

/**
 * 댓글 쿼리 키 관리 객체
 */
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: string, filters?: any) =>
    [...commentKeys.lists(), postId, filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (postId: string, commentId: string) =>
    [...commentKeys.details(), postId, commentId] as const,
}

/**
 * 게시글 댓글 목록 조회 (무한 스크롤)
 * @param postId 게시글 ID
 * @param limit 가져올 개수
 */
export const useInfiniteComments = (postId: string, limit = 50) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId, { limit }),
    queryFn: ({ pageParam = 0 }) =>
      CommentService.getComments(postId, limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
    enabled: !!postId,
  })
}

/**
 * 게시글 댓글 목록 조회 (일반)
 * @param postId 게시글 ID
 * @param limit 가져올 개수
 * @param offset 시작 위치
 */
export const useComments = (postId: string, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: commentKeys.list(postId, { limit, offset }),
    queryFn: () => CommentService.getComments(postId, limit, offset),
    enabled: !!postId,
  })
}

/**
 * 단일 댓글 조회
 * @param postId 게시글 ID
 * @param commentId 댓글 ID
 */
export const useComment = (postId: string, commentId: string) => {
  return useQuery({
    queryKey: commentKeys.detail(postId, commentId),
    queryFn: () => CommentService.getComment(postId, commentId),
    enabled: !!postId && !!commentId,
  })
}
