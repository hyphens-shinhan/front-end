import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CommentService } from '@/services/comments'
import { commentKeys } from './useComments'
import { postKeys } from '@/hooks/posts/usePosts'
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
      // 댓글 목록 무효화
      queryClient.invalidateQueries({
        queryKey: ['comments', 'list', postId],
      })
      // 피드 게시글 상세(comment_count) 갱신 → PostInteraction 댓글 수 실시간 반영
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      })
      // 자치회 리포트 상세 및 목록 무효화
      queryClient.invalidateQueries({
        queryKey: [...postKeys.all, 'council', postId],
      })
      // 자치회 리포트 목록 무효화 (모든 limit/offset 조합)
      queryClient.invalidateQueries({
        queryKey: [...postKeys.lists(), 'council'],
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
      // 자치회 리포트 상세 및 목록 무효화
      queryClient.invalidateQueries({
        queryKey: [...postKeys.all, 'council', postId],
      })
      // 자치회 리포트 목록 무효화 (모든 limit/offset 조합)
      queryClient.invalidateQueries({
        queryKey: [...postKeys.lists(), 'council'],
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
      // 피드 게시글 상세(comment_count) 갱신
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      })
      // 자치회 리포트 상세 및 목록 무효화
      queryClient.invalidateQueries({
        queryKey: [...postKeys.all, 'council', postId],
      })
      // 자치회 리포트 목록 무효화 (모든 limit/offset 조합)
      queryClient.invalidateQueries({
        queryKey: [...postKeys.lists(), 'council'],
      })
    },
  })
}
