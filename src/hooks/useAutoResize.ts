import { useRef, useCallback } from 'react'

/**
 * textarea 높이 자동 조절 훅
 *
 * @example
 * const { textareaRef, handleResize } = useAutoResize()
 *
 * <textarea
 *   ref={textareaRef}
 *   onInput={handleResize}
 *   rows={1}
 * />
 */
export function useAutoResize() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleResize = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [])

  return { textareaRef, handleResize }
}
