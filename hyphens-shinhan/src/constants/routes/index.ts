import { HOME_ROUTES } from './home'
import { COMMUNITY_ROUTES } from './community'
import { MYPAGE_ROUTES } from './mypage'
import { NETWORK_ROUTES } from './network'
import { SCHOLARSHIP_ROUTES } from './scholarship'
import { COMMON_ROUTES } from './common'

/** 전체 라우트 상수 */
export const ROUTES = {
  /** 1. 홈 라우트 상수 */
  HOME: HOME_ROUTES,

  /** 2. 커뮤니티 라우트 상수 */
  COMMUNITY: COMMUNITY_ROUTES,

  /** 3. 마이페이지 라우트 상수 */
  MYPAGE: MYPAGE_ROUTES,

  /** 4. 네트워크 라우트 상수 */
  NETWORK: NETWORK_ROUTES,

  /** 5.장학 활동 라우트 상수 */
  SCHOLARSHIP: SCHOLARSHIP_ROUTES,

  /** 6. Common 라우트 상수 */
  /** 알림 라우트 상수 */
  ALARM: COMMON_ROUTES.ALARM,
  /** 채팅 라우트 상수 */
  CHAT: COMMON_ROUTES.CHAT,
  /** 검색 라우트 상수 */
  SEARCH: COMMON_ROUTES.SEARCH,
} as const
