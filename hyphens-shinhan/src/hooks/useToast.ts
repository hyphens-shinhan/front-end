import { useCallback } from 'react'
import {
  useToastStore,
  type ToastOptions,
} from '@/stores/useToastStore'

/**
 * 토스트 메시지를 띄우는 훅.
 * 전역 스토어를 사용하므로 레이아웃에 ToastContainer가 마운트되어 있으면 어디서든 사용 가능.
 *
 * @example
 * const toast = useToast();
 * toast.show('저장되었습니다.');
 * toast.error('저장에 실패했어요.');
 * toast.show('메시지', { position: 'bottom-above-tabs' });
 * toast.hide();
 */
export function useToast() {
  const show = useToastStore((s) => s.show)
  const error = useToastStore((s) => s.error)
  const hide = useToastStore((s) => s.hide)

  return {
    show: useCallback(
      (message: string, options?: ToastOptions) => show(message, options),
      [show]
    ),
    error: useCallback(
      (message: string, options?: Omit<ToastOptions, 'variant'>) => error(message, options),
      [error]
    ),
    hide: useCallback(() => hide(), [hide]),
  }
}
