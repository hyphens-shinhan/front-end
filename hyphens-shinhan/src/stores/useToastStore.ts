import { create } from 'zustand'

export interface ToastOptions {
  /** 화면 내 위치 (기본: 'top') */
  position?: 'top' | 'bottom'
  /** 아이콘 표시 여부 (기본: true) */
  showIcon?: boolean
  /** 자동으로 숨길 때까지 시간(ms). 0이면 자동 숨김 없음 (기본: 3000) */
  duration?: number
}

interface ToastState {
  isOpen: boolean
  message: string
  position: 'top' | 'bottom'
  showIcon: boolean
  /** 자동 숨김 타이머 ID (clear용) */
  _timerId: ReturnType<typeof setTimeout> | null
  show: (message: string, options?: ToastOptions) => void
  hide: () => void
}

const DEFAULT_DURATION = 3000

export const useToastStore = create<ToastState>((set, get) => ({
  isOpen: false,
  message: '',
  position: 'top',
  showIcon: true,
  _timerId: null,

  show: (message, options = {}) => {
    const { _timerId } = get()
    if (_timerId) clearTimeout(_timerId)

    const duration = options.duration ?? DEFAULT_DURATION

    set({
      isOpen: true,
      message,
      position: options.position ?? 'top',
      showIcon: options.showIcon ?? true,
      _timerId: null,
    })

    if (duration > 0) {
      const timerId = setTimeout(() => get().hide(), duration)
      set({ _timerId: timerId })
    }
  },

  hide: () => {
    const { _timerId } = get()
    if (_timerId) clearTimeout(_timerId)
    set({ isOpen: false, message: '', _timerId: null })
  },
}))
