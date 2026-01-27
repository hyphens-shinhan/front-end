import { HEADER_CONFIG_BY_BOTTOM_NAV, ROUTES, HeaderConfig } from '@/constants'
import { NavLink } from '@/types'

/**
 * 현재 경로에 해당하는 헤더 설정을 반환합니다.
 * @param pathname - 현재 경로
 * @returns 헤더 설정 또는 null
 */
export function getHeaderConfig(pathname: string): HeaderConfig | null {
  // 홈은 정확히 일치해야 함
  if (pathname === ROUTES.HOME.MAIN) {
    return HEADER_CONFIG_BY_BOTTOM_NAV[ROUTES.HOME.MAIN]
  }
  // 나머지는 startsWith로 확인
  for (const [route, config] of Object.entries(HEADER_CONFIG_BY_BOTTOM_NAV) as [
    NavLink,
    (typeof HEADER_CONFIG_BY_BOTTOM_NAV)[NavLink],
  ][]) {
    if (route !== ROUTES.HOME.MAIN && pathname.startsWith(route)) {
      return config
    }
  }
  return null
}
