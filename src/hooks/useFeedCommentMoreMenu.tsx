'use client'

import { useCallback } from 'react'
import { ROUTES } from '@/constants'
import { TOAST_MESSAGES } from '@/constants/toast'
import { useBottomSheetStore, useConfirmModalStore } from '@/stores'
import { useDeleteComment } from '@/hooks/comments/useCommentMutations'
import { useToast } from '@/hooks/useToast'
import { copyToClipboard } from '@/utils/copyToClipboard'
import { cn } from '@/utils/cn'

const menuStyles = {
  menuList: 'flex flex-col gap-0',
  menuItem: cn(
    'w-full py-3 text-left',
    'body-5 text-grey-11',
    'transition-colors active:bg-grey-1-1',
  ),
  menuLabel: 'block',
}

interface UseFeedCommentMoreMenuOptions {
  /** 댓글 수정 클릭 시 (인라인 수정 모드 진입용) */
  onEditClick?: () => void
}

/**
 * 댓글 더보기 메뉴(수정/삭제/공유) 로직 훅
 * - 수정: onEditClick 호출 → 부모에서 인라인 수정 모드
 * - 삭제: 확인 모달 후 삭제 API
 * - 공유: 게시물 링크 클립보드 복사
 */
export function useFeedCommentMoreMenu(
  postId: string,
  commentId: string,
  isAuthor: boolean,
  options?: UseFeedCommentMoreMenuOptions,
): { openMenu: () => void } {
  const { onOpen: openBottomSheet, onClose: closeBottomSheet } = useBottomSheetStore()
  const { onOpen: openConfirmModal, onClose: closeConfirmModal } = useConfirmModalStore()
  const { mutateAsync: deleteComment } = useDeleteComment()
  const toast = useToast()
  const onEditClick = options?.onEditClick

  const openMenu = useCallback(() => {
    const menuItems: { value: string; label: string }[] = [
      ...(isAuthor
        ? [
            { value: 'edit', label: '댓글 수정' },
            { value: 'delete', label: '댓글 삭제' },
          ]
        : []),
      { value: 'share', label: '공유' },
    ]

    openBottomSheet({
      closeOnOverlayClick: true,
      content: (
        <div className={menuStyles.menuList}>
          {menuItems.map((item) => (
            <button
              key={item.value}
              type="button"
              className={menuStyles.menuItem}
              onClick={(e) => {
                e.stopPropagation()
                closeBottomSheet()
                if (item.value === 'edit') {
                  onEditClick?.()
                } else if (item.value === 'delete') {
                  openConfirmModal({
                    title: '댓글을 삭제할까요?',
                    message: '삭제된 댓글은 복구할 수 없어요.',
                    confirmText: '삭제',
                    cancelText: '취소',
                    isDanger: true,
                    onConfirm: async () => {
                      try {
                        await deleteComment({ postId, commentId })
                        closeConfirmModal()
                        toast.show(TOAST_MESSAGES.FEED.COMMENT_DELETE_SUCCESS)
                      } catch (error) {
                        console.error('댓글 삭제 실패:', error)
                        toast.error(TOAST_MESSAGES.FEED.COMMENT_DELETE_ERROR)
                      }
                    },
                  })
                } else if (item.value === 'share') {
                  const url =
                    typeof window !== 'undefined'
                      ? `${window.location.origin}${ROUTES.COMMUNITY.FEED.DETAIL}/${postId}`
                      : ''
                  if (url) {
                    copyToClipboard(url).then((ok) =>
                      ok
                        ? toast.show(TOAST_MESSAGES.FEED.LINK_COPY_SUCCESS)
                        : toast.error(TOAST_MESSAGES.FEED.LINK_COPY_ERROR),
                    )
                  }
                }
              }}
            >
              <span className={menuStyles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      ),
    })
  }, [
    postId,
    commentId,
    isAuthor,
    onEditClick,
    openBottomSheet,
    closeBottomSheet,
    openConfirmModal,
    closeConfirmModal,
    deleteComment,
    toast,
  ])

  return { openMenu }
}
