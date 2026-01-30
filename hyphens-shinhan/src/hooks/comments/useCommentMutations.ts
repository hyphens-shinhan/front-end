import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CommentService } from '@/services/comments'
import { commentKeys } from './useComments'
import { CommentCreate, CommentUpdate } from '@/types/comments'

/**
 * 댓글 생성 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CommentCreate }) =>
      CommentService.createComment(postId, data),
    onSuccess: (_, { postId }) => {
      // postId로 시작하는 모든 댓글 목록 쿼리 invalidate
      queryClient.invalidateQueries({
        queryKey: ['comments', 'list', postId],
      })
    },
  })
}

/**
 * 댓글 수정 훅
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      data,
    }: {
      postId: string
      commentId: string
      data: CommentUpdate
    }) => CommentService.updateComment(postId, commentId, data),
    onSuccess: (_, { postId, commentId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(postId, commentId),
      })
      queryClient.invalidateQueries({
        queryKey: ['comments', 'list', postId],
      })
    },
  })
}

/**
 * 댓글 삭제 훅
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string
      commentId: string
    }) => CommentService.deleteComment(postId, commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', 'list', postId],
      })
    },
  })
}
