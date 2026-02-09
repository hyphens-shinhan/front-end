'use client'

import { useCallback } from 'react'
import { ROUTES } from '@/constants'
import { TOAST_MESSAGES } from '@/constants/toast'
import { useBottomSheetStore } from '@/stores'
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

/**
 * 자치회 더보기 메뉴(공유만) 로직 훅
 * - 카드·상세 공통
 */
export function useCouncilReportMoreMenu(reportId: string): { openMenu: () => void } {
  const { onOpen: openBottomSheet, onClose: closeBottomSheet } = useBottomSheetStore()
  const toast = useToast()

  const openMenu = useCallback(() => {
    openBottomSheet({
      closeOnOverlayClick: true,
      content: (
        <div className={menuStyles.menuList}>
          <button
            type="button"
            className={menuStyles.menuItem}
            onClick={(e) => {
              e.stopPropagation()
              closeBottomSheet()
              const url =
                typeof window !== 'undefined'
                  ? `${window.location.origin}${ROUTES.COMMUNITY.COUNCIL.DETAIL}/${reportId}`
                  : ''
              if (url) {
                copyToClipboard(url).then((ok) =>
                  ok
                    ? toast.show(TOAST_MESSAGES.FEED.LINK_COPY_SUCCESS)
                    : toast.error(TOAST_MESSAGES.FEED.LINK_COPY_ERROR),
                )
              }
            }}
          >
            <span className={menuStyles.menuLabel}>공유</span>
          </button>
        </div>
      ),
    })
  }, [reportId, openBottomSheet, closeBottomSheet, toast])

  return { openMenu }
}
