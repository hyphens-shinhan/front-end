import { HeaderNavItem, NavItem, NavLink, UserRole } from '@/types'
import { ROUTES } from './routes'
import { IconName } from '@/components/common/Icon'

/** 라우트 상수 */
export { ROUTES } from './routes'

/** 바텀 네비게이션 아이템 상수
 * 사용자 역할에 따라 바텀 네비게이션 아이템 상수를 반환합니다.
 */
export const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  // TODO: 멘토 - 임의로 넣어둠 달라질 예정
  MENTOR: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
  // TODO: 졸업 장학생 - 활동 탭만 다름 임의로 넣어둠 달라질 예정
  OB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
  // 기본 장학생
  YB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
} as const

/** 헤더 네비게이션 아이템 키 */
export enum HEADER_NAV_ITEM_KEY {
  // 알림 기능
  NOTIFICATIONS = 'NOTIFICATIONS',
  // 채팅 기능
  CHAT = 'CHAT',
  // 검색 기능
  SEARCH = 'SEARCH',
}

/** 헤더에 들어갈 공통 기능 아이템들 */
export const HEADER_ITEMS: Record<HEADER_NAV_ITEM_KEY, HeaderNavItem> = {
  // 알림 기능
  NOTIFICATIONS: {
    href: ROUTES.NOTIFICATION,
    icon: 'IconLBoldNotification',
    ariaLabel: '알림',
  },
  // 채팅 기능
  CHAT: {
    href: ROUTES.CHAT,
    icon: 'IconLBoldMessages3',
    ariaLabel: '채팅',
  },
  // 검색 기능
  SEARCH: {
    href: ROUTES.SEARCH,
    icon: 'IconLLineSearchLine',
    ariaLabel: '검색',
  },
} as const

/** 바텀 네비게이션 아이템 키에 따른 헤더 설정 */
export interface HeaderConfig {
  title: string
  navItems: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY][]
}

export const HEADER_CONFIG_BY_BOTTOM_NAV: Record<NavLink, HeaderConfig> = {
  [ROUTES.HOME.MAIN]: {
    title: '홈',
    navItems: [HEADER_ITEMS.CHAT, HEADER_ITEMS.NOTIFICATIONS],
  },
  [ROUTES.SCHOLARSHIP.MAIN]: {
    title: 'MY활동',
    navItems: [HEADER_ITEMS.NOTIFICATIONS, HEADER_ITEMS.SEARCH],
  },
  [ROUTES.COMMUNITY.MAIN]: {
    title: '커뮤니티',
    navItems: [HEADER_ITEMS.NOTIFICATIONS, HEADER_ITEMS.SEARCH],
  },
  [ROUTES.NETWORK.MAIN]: {
    title: '네트워크',
    navItems: [HEADER_ITEMS.CHAT, HEADER_ITEMS.NOTIFICATIONS],
  },
  [ROUTES.MYPAGE.MAIN]: {
    title: '프로필',
    navItems: [HEADER_ITEMS.NOTIFICATIONS],
  },
} as const
