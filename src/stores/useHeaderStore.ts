import { create } from 'zustand'

/* ========================================
 * 커스텀 헤더 스토어
 *
 * 페이지에서 헤더의 핸들러(onClick, onBack)를 설정할 때 사용
 * 정적 설정(title, navItem 등)은 경로 기반 설정(CUSTOM_HEADER_CONFIG)에서 관리
 * ======================================== */

interface HeaderHandlers {
  /** 뒤로가기 핸들러 */
  onBack?: () => void
  /** 네비게이션(우측 버튼) 클릭 핸들러 */
  onClick?: () => void
}

interface HeaderState {
  handlers: HeaderHandlers
  /** 경로 기반 title을 오버라이드할 제목 (예: '4월 활동') */
  customTitle: string | null
  /** 핸들러 설정 */
  setHandlers: (handlers: HeaderHandlers) => void
  /** 핸들러 초기화 */
  resetHandlers: () => void
  /** 동적 헤더 제목 설정 (상세 페이지 등) */
  setCustomTitle: (title: string | null) => void
}

/**
 * 커스텀 헤더 스토어
 *
 * 페이지에서 헤더의 핸들러를 동적으로 설정할 때 사용
 *
 * @example
 * const { setHandlers, resetHandlers } = useHeaderStore()
 *
 * useEffect(() => {
 *   setHandlers({ onClick: handleComplete })
 *   return () => resetHandlers()
 * }, [])
 */
export const useHeaderStore = create<HeaderState>((set) => ({
  handlers: {},
  customTitle: null,
  setHandlers: (handlers) => set({ handlers }),
  resetHandlers: () => set({ handlers: {} }),
  setCustomTitle: (title) => set({ customTitle: title }),
}))
