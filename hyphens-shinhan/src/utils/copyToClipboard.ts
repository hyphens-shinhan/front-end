/**
 * 클립보드에 텍스트 복사
 * - 먼저 navigator.clipboard API 시도 (HTTPS 등 secure context)
 * - 없거나 실패 시 document.execCommand('copy') 폴백 (HTTP/로컬 개발 등)
 */
export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || !text) return Promise.resolve(false)

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
  }

  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '2em',
      height: '2em',
      padding: '0',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent',
      opacity: '0',
      zIndex: '-1',
    })
    document.body.appendChild(el)
    el.focus()
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return Promise.resolve(!!ok)
  } catch {
    return Promise.resolve(false)
  }
}
