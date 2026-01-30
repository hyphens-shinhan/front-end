import {
  HeaderNavItem,
  InputBarConfig,
  NavItem,
  NavLink,
  PostFABItem,
  UserRole,
} from '@/types'
import { ROUTES } from './routes'
import { IconName } from '@/components/common/Icon'
import { StaticImageData } from 'next/image'
import shinhanNoticeImg from '@/assets/icons/Icon-L/Image/shinhan-logo.png'

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
  // 완료 버튼
  COMPLETE = 'COMPLETE',
  // 더보기 버튼
  MORE = 'MORE',
}

/** 헤더에 들어갈 공통 기능 아이템들 */
export const HEADER_ITEMS: Record<HEADER_NAV_ITEM_KEY, HeaderNavItem> = {
  // 알림 기능
  [HEADER_NAV_ITEM_KEY.NOTIFICATIONS]: {
    href: ROUTES.NOTIFICATION,
    icon: 'IconLBoldNotification',
    ariaLabel: '알림',
  },
  // 채팅 기능
  [HEADER_NAV_ITEM_KEY.CHAT]: {
    href: ROUTES.CHAT,
    icon: 'IconLBoldMessages3',
    ariaLabel: '채팅',
  },
  // 검색 기능
  [HEADER_NAV_ITEM_KEY.SEARCH]: {
    href: ROUTES.SEARCH,
    icon: 'IconLLineSearchLine',
    ariaLabel: '검색',
  },
  // 완료 버튼 (텍스트)
  [HEADER_NAV_ITEM_KEY.COMPLETE]: {
    text: '완료',
    ariaLabel: '완료',
  },
  // 더보기 버튼
  [HEADER_NAV_ITEM_KEY.MORE]: {
    icon: 'IconLLine3DotVertical',
    ariaLabel: '더보기',
  },
} as const

/** 바텀 네비게이션 아이템 키에 따른 헤더 설정 */
export interface HeaderConfig {
  title: string
  navItems: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY][]
}

/** 바텀 네비게이션 아이템 키에 따른 헤더 설정 상수 */
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

/** 상세 페이지 헤더 설정 */
export interface CustomHeaderConfig {
  type?: 'Center' | 'Left'
  btnType?: 'Back' | 'Close'
  title: string
  logo?: IconName
  img?: string | StaticImageData
  navItem?: HeaderNavItem
  backHref?: string
}

/** 상세 페이지 헤더 설정 상수 */
export const CUSTOM_HEADER_CONFIG: Record<string, CustomHeaderConfig> = {
  [ROUTES.NOTIFICATION]: {
    title: '알림',
  },
  [ROUTES.CHAT]: {
    title: '채팅',
  },
  [ROUTES.SEARCH]: {
    title: '검색',
  },
  /** 신한장학재단 공지사항 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.SHINHAN_NOTICE]: {
    title: '신한장학재단',
    type: 'Left',
    img: shinhanNoticeImg,
    backHref: ROUTES.COMMUNITY.MAIN,
  },
  /** 커뮤니티 피드 글쓰기 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.FEED.CREATE]: {
    title: '게시글 작성하기',
    type: 'Left',
    btnType: 'Close',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.COMPLETE],
  },
  /** 커뮤니티 소모임 추가하기 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.GROUP.CREATE]: {
    title: '추가하기',
    type: 'Left',
  },
  /** 게시글 상세 보기 */
  [ROUTES.COMMUNITY.FEED.DETAIL]: {
    title: '게시글',
    type: 'Center',
    btnType: 'Back',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.MORE],
    backHref: ROUTES.COMMUNITY.MAIN,
  },
} as const

/** 포스트 플로팅 액션 버튼 아이템 키 */
export enum POST_FAB_ITEM_KEY {
  WRITE = 'WRITE',
  ADD = 'ADD',
}

/** 포스트 플로팅 액션 버튼 아이템 상수 */
export const POST_FAB_ITEMS: Record<POST_FAB_ITEM_KEY, PostFABItem> = {
  [POST_FAB_ITEM_KEY.WRITE]: {
    icon: 'IconLBoldEdit2',
    href: ROUTES.COMMUNITY.FEED.CREATE,
    ariaLabel: '글쓰기',
  },
  [POST_FAB_ITEM_KEY.ADD]: {
    icon: 'IconLLinePlus',
    href: ROUTES.COMMUNITY.GROUP.CREATE,
    ariaLabel: '추가하기',
  },
} as const

/** InputBar 타입 키 */
export enum INPUT_BAR_TYPE {
  /** 검색바 */
  SEARCH = 'SEARCH',
  /** 채팅 입력창 */
  CHAT = 'CHAT',
  /** 댓글 입력창 */
  COMMENT = 'COMMENT',
}

/** InputBar 타입별 설정 상수 */
export const INPUT_BAR_ITEMS: Record<INPUT_BAR_TYPE, InputBarConfig> = {
  [INPUT_BAR_TYPE.SEARCH]: {
    placeholder: '검색어를 입력하세요',
    leftIcon: 'IconLLineSearchLine',
    showAttach: false,
    showEmoji: false,
    sendButton: false,
  },
  [INPUT_BAR_TYPE.CHAT]: {
    placeholder: '메시지 입력하기',
    leftIcon: undefined,
    showAttach: true,
    showEmoji: true,
    sendButton: true,
  },
  [INPUT_BAR_TYPE.COMMENT]: {
    placeholder: '댓글 입력하기',
    leftIcon: undefined,
    showAttach: false,
    showEmoji: true,
    sendButton: true,
  },
} as const
