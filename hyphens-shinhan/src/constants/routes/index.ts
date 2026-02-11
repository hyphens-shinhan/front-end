import { HOME_ROUTES } from './home'
import { COMMUNITY_ROUTES } from './community'
import { MYPAGE_ROUTES } from './mypage'
import { NETWORK_ROUTES } from './network'
import { SCHOLARSHIP_ROUTES } from './scholarship'
import { MENTOR_ROUTES } from './mentors'
import { MENTOR_DASHBOARD_ROUTES } from './mentor-dashboard'
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

  /** 5. 장학 활동 라우트 상수 */
  SCHOLARSHIP: SCHOLARSHIP_ROUTES,

  /** 6. 멘토링 라우트 상수 (YB용: 설문/매칭/내역) */
  MENTORS: MENTOR_ROUTES,

  /** 7. 멘토 대시보드 라우트 상수 (멘토 전용 탭) */
  MENTOR_DASHBOARD: MENTOR_DASHBOARD_ROUTES,

  /** 8. Common 라우트 상수 */
  /** 알림 라우트 상수 */
  NOTIFICATION: COMMON_ROUTES.NOTIFICATION,
  /** 채팅 라우트 상수 */
  CHAT: COMMON_ROUTES.CHAT,
  /** 채팅 상세 (헤더 설정 키용) */
  CHAT_DETAIL: COMMON_ROUTES.CHAT_DETAIL,
  /** 검색 라우트 상수 */
  SEARCH: COMMON_ROUTES.SEARCH,
} as const
