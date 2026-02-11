import { create } from 'zustand'
import type { ReactNode } from 'react'

/* ========================================
 * 바텀시트 스토어
 * ======================================== */

interface BottomSheetOptions {
  /** 모달 타이틀 */
  title?: string
  /** 모달 컨텐츠 (JSX) */
  content?: ReactNode
  /** 오버레이 클릭 시 닫기 여부 (기본: true) */
  closeOnOverlayClick?: boolean
}

interface BottomSheetState {
  isOpen: boolean
  options: BottomSheetOptions
  onOpen: (options: BottomSheetOptions) => void
  onClose: () => void
}

/**
 * 바텀시트 스토어
 *
 * @example
 * const { onOpen, onClose } = useBottomSheetStore();
 * onOpen({
 *   title: '옵션 선택',
 *   content: <OptionList />,
 * });
 */
export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpen: false,
  options: {},
  onOpen: (options) => set({ isOpen: true, options }),
  onClose: () => set({ isOpen: false, options: {} }),
}))

/* ========================================
 * 중앙(Center) 모달 스토어
 * ======================================== */

interface CenterModalOptions {
  title?: string
  content?: ReactNode
  closeOnOverlayClick?: boolean
}

interface CenterModalState {
  isOpen: boolean
  options: CenterModalOptions
  onOpen: (options: CenterModalOptions) => void
  onClose: () => void
}

export const useCenterModalStore = create<CenterModalState>((set) => ({
  isOpen: false,
  options: {},
  onOpen: (options) => set({ isOpen: true, options }),
  onClose: () => set({ isOpen: false, options: {} }),
}))

/* ========================================
 * 확인(Confirm) 모달 스토어
 * ======================================== */

interface ConfirmModalOptions {
  /** 모달 타이틀 */
  title: string
  /** 모달 메시지 */
  message?: string
  /** 커스텀 컨텐츠 (title/message 대신 또는 함께 사용) */
  content?: ReactNode
  /** 확인 버튼 텍스트 (기본: '확인') */
  confirmText?: string
  /** 취소 버튼 텍스트 (기본: '취소') */
  cancelText?: string
  /** 위험한 액션 여부 (확인 버튼 빨간색) */
  isDanger?: boolean
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm?: () => void
  /** 취소 버튼 클릭 시 콜백 */
  onCancel?: () => void
}

interface ConfirmModalState {
  isOpen: boolean
  options: ConfirmModalOptions | null
  onOpen: (options: ConfirmModalOptions) => void
  onClose: () => void
  /** 열린 모달의 options 일부만 갱신 (content 등) */
  updateOptions: (partial: Partial<ConfirmModalOptions>) => void
}

/**
 * 확인(Confirm) 모달 스토어
 *
 * @example
 * const { onOpen, onClose } = useConfirmModalStore();
 * onOpen({
 *   title: '삭제하시겠습니까?',
 *   message: '삭제된 게시글은 복구할 수 없습니다.',
 *   confirmText: '삭제',
 *   isDanger: true,
 *   onConfirm: () => handleDelete(),
 * });
 */
export const useConfirmModalStore = create<ConfirmModalState>((set) => ({
  isOpen: false,
  options: null,
  onOpen: (options) => set({ isOpen: true, options }),
  onClose: () => set({ isOpen: false, options: null }),
  updateOptions: (partial) =>
    set((state) => ({
      options: state.options ? { ...state.options, ...partial } : null,
    })),
}))

/* ========================================
 * 알림(Alert) 모달 스토어
 * ======================================== */

interface AlertModalOptions {
  /** 모달 타이틀 */
  title: string
  /** 모달 메시지 */
  message?: string
  children: ReactNode | null
  /** 확인 버튼 텍스트 (기본: '확인') */
  confirmText?: string
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm?: () => void
}

interface AlertModalState {
  isOpen: boolean
  options: AlertModalOptions | null
  children: ReactNode | null
  onOpen: (options: AlertModalOptions) => void
  onClose: () => void
}

/**
 * 알림(Alert) 모달 스토어
 *
 * @example
 * const { onOpen, onClose } = useAlertModalStore();
 * onOpen({
 *   title: '저장 완료',
 *   message: '게시글이 저장되었습니다.',
 * });
 */
export const useAlertModalStore = create<AlertModalState>((set) => ({
  isOpen: false,
  options: null,
  children: null,
  onOpen: (options) => set({ isOpen: true, options }),
  onClose: () => set({ isOpen: false, options: null }),
}))
