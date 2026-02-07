import { create } from 'zustand'
import type { ToastPosition, ToastVariant } from '@/components/common/Toast'

export type { ToastPosition }

export interface ToastOptions {
  /** 화면 내 위치 프리셋 (기본: 'top-default-header') */
  position?: ToastPosition
  /** 아이콘 표시 여부 (기본: true) */
  showIcon?: boolean
  /** 자동으로 숨길 때까지 시간(ms). 0이면 자동 숨김 없음 (기본: 3000) */
  duration?: number
  /** 기본(성공) / 에러 (toast.error() 사용 시 자동 적용) */
  variant?: ToastVariant
}

interface ToastState {
  isOpen: boolean
  message: string
  position: ToastPosition
  showIcon: boolean
  variant: ToastVariant
  /** 자동 숨김 타이머 ID (clear용) */
  _timerId: ReturnType<typeof setTimeout> | null
  show: (message: string, options?: ToastOptions) => void
  /** 에러 토스트 (variant: 'error', close-circle 아이콘 + 빨간 톤 배경) */
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) => void
  hide: () => void
}

const DEFAULT_DURATION = 3000

export const useToastStore = create<ToastState>((set, get) => ({
  isOpen: false,
  message: '',
  position: 'top-default-header',
  showIcon: true,
  variant: 'default',
  _timerId: null,

  show: (message, options = {}) => {
    const { _timerId } = get()
    if (_timerId) clearTimeout(_timerId)

    const duration = options.duration ?? DEFAULT_DURATION

    set({
      isOpen: true,
      message,
      position: options.position ?? 'top-default-header',
      showIcon: options.showIcon ?? true,
      variant: options.variant ?? 'default',
      _timerId: null,
    })

    if (duration > 0) {
      const timerId = setTimeout(() => get().hide(), duration)
      set({ _timerId: timerId })
    }
  },

  error: (message, options = {}) => {
    get().show(message, { ...options, variant: 'error' })
  },

  hide: () => {
    const { _timerId } = get()
    if (_timerId) clearTimeout(_timerId)
    set({ isOpen: false, message: '', variant: 'default', _timerId: null })
  },
}))
