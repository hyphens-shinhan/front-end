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
 * toast.show('출석 확인이 완료되었어요', { position: 'bottom' });
 * toast.show('아이콘 없이', { showIcon: false, duration: 2000 });
 * toast.hide();
 */
export function useToast() {
  const show = useToastStore((s) => s.show)
  const hide = useToastStore((s) => s.hide)

  return {
    show: useCallback(
      (message: string, options?: ToastOptions) => show(message, options),
      [show]
    ),
    hide: useCallback(() => hide(), [hide]),
  }
}
