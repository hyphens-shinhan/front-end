'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { TOAST_MESSAGES } from '@/constants/toast'
import { useBottomSheetStore, useConfirmModalStore } from '@/stores'
import { useDeletePost } from '@/hooks/posts/usePostMutations'
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

interface UseFeedPostMoreMenuOptions {
  /** 삭제 성공 후 이동할 경로 (없으면 이동 안 함, 목록에서 삭제 시 사용) */
  afterDeleteNavigateTo?: string
}

/**
 * 게시글 더보기 메뉴(수정/삭제/공유) 로직 공통 훅
 * - 리스트(PostCard)와 상세(FeedDetailContent)에서 동일한 바텀시트 메뉴·동작 사용
 */
export function useFeedPostMoreMenu(
  postId: string,
  isAuthor: boolean,
  options?: UseFeedPostMoreMenuOptions,
): { openMenu: () => void } {
  const router = useRouter()
  const { onOpen: openBottomSheet, onClose: closeBottomSheet } = useBottomSheetStore()
  const { onOpen: openConfirmModal, onClose: closeConfirmModal } = useConfirmModalStore()
  const { mutateAsync: deletePost } = useDeletePost()
  const toast = useToast()
  const afterDeleteNavigateTo = options?.afterDeleteNavigateTo

  const openMenu = useCallback(() => {
    const menuItems: { value: string; label: string }[] = [
      ...(isAuthor ? [
        { value: 'edit', label: '게시글 수정' },
        { value: 'delete', label: '게시글 삭제' },
      ] : []),
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
                  router.push(`${ROUTES.COMMUNITY.FEED.DETAIL}/${postId}/edit`)
                } else if (item.value === 'delete') {
                  openConfirmModal({
                    title: '게시글을 삭제할까요?',
                    message: '삭제된 게시글은 복구할 수 없어요.',
                    confirmText: '삭제',
                    cancelText: '취소',
                    isDanger: true,
                    onConfirm: async () => {
                      try {
                        await deletePost(postId)
                        closeConfirmModal()
                        toast.show(TOAST_MESSAGES.FEED.POST_DELETE_SUCCESS)
                        if (afterDeleteNavigateTo) {
                          router.replace(afterDeleteNavigateTo)
                        }
                      } catch (error) {
                        console.error('게시글 삭제 실패:', error)
                        toast.error(TOAST_MESSAGES.FEED.POST_DELETE_ERROR)
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
    isAuthor,
    afterDeleteNavigateTo,
    openBottomSheet,
    closeBottomSheet,
    openConfirmModal,
    closeConfirmModal,
    deletePost,
    toast,
    router,
  ])

  return { openMenu }
}
