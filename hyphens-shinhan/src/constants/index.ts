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
import shinhanLogoImg from '@/assets/icons/Icon-L/Vector/shinhan-logo.png'

/** 라우트 상수 */
export { ROUTES } from './routes'

/** EmptyContent(로딩/빈/에러) 문구 상수 */
export { EMPTY_CONTENT_MESSAGES } from './emptyContent'

/** 이미지 업로드(Supabase Storage) bucket / pathPrefix 상수 */
export { IMAGE_UPLOAD } from './imageUpload'

/** 토스트 메시지 상수 */
export { TOAST_MESSAGES } from './toast'

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
    href: ROUTES.MYPAGE.SETTING.MAIN,
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
    title: '',
    navItems: [HEADER_ITEMS.CHAT, HEADER_ITEMS.NOTIFICATIONS],
  },
  [ROUTES.SCHOLARSHIP.MAIN]: {
    title: 'MY활동',
    navItems: [HEADER_ITEMS.NOTIFICATIONS, HEADER_ITEMS.SEARCH],
  },
  [ROUTES.COMMUNITY.MAIN]: {
    title: '커뮤니티',
    navItems: [HEADER_ITEMS.NOTIFICATIONS],
  },
  [ROUTES.NETWORK.MAIN]: {
    title: '네트워크',
    navItems: [HEADER_ITEMS.CHAT, HEADER_ITEMS.NOTIFICATIONS],
  },
  [ROUTES.MYPAGE.MAIN]: {
    title: '프로필',
    navItems: [HEADER_ITEMS.MORE],
  },
} as const

/** 상세 페이지 헤더 설정 */
export interface CustomHeaderConfig {
  type?: 'Center' | 'Left'
  btnType?: 'Back' | 'Close'
  title?: string
  logo?: IconName
  img?: string | StaticImageData
  navItem?: HeaderNavItem
  backHref?: string
  /** 있으면 pathname을 이 패턴으로 매칭 (동적 경로용, 키는 startsWith에 사용 안 함) */
  pathPattern?: RegExp
}

/** 상세 페이지 헤더 설정 상수 */
export const CUSTOM_HEADER_CONFIG: Record<string, CustomHeaderConfig> = {
  [ROUTES.NOTIFICATION]: {
    title: '알림',
  },
  [ROUTES.CHAT]: {
    title: '메시지',
  },
  /** Chat detail: title set by setCustomTitle in ChatView; more button uses store onClick */
  [ROUTES.CHAT_DETAIL]: {
    pathPattern: /^\/chat\/[^/]+$/,
    title: '',
    type: 'Center',
    btnType: 'Back',
    backHref: ROUTES.CHAT,
    navItem: {
      icon: 'IconLLine3DotVertical',
      ariaLabel: '더보기',
      type: 'button',
    },
  },
  [ROUTES.SEARCH]: {
    title: '검색',
  },
  /** 멘토링 신청 설문 */
  [ROUTES.MENTORS.QUESTIONNAIRE]: {
    title: '멘토링 신청하기',
    type: 'Left',
    btnType: 'Back',
  },
  /** 멘토 매칭 결과 */
  [ROUTES.MENTORS.MATCHES]: {
    title: '멘토 매칭 결과',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.NETWORK.MAIN,
  },
  /** 멘토링 신청 풀스크린 (/mentors/[id]/apply) */
  [ROUTES.MENTORS.APPLY]: {
    pathPattern: /^\/mentors\/[^/]+\/apply$/,
    title: '멘토링 신청',
    type: 'Left',
    btnType: 'Back',
  },
  /** 멘토 상세 프로필 (/mentors/[id]) */
  [ROUTES.MENTORS.MAIN]: {
    pathPattern: /^\/mentors\/[^/]+$/,
    title: '프로필',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.NETWORK.MAIN,
  },
  /** 나의 멘토링 내역 (pathPattern so /mentors/history is not matched by DETAIL_PREFIX) */
  [ROUTES.MENTORS.HISTORY]: {
    pathPattern: /^\/mentors\/history$/,
    title: '나의 멘토링 내역',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.NETWORK.MAIN,
  },
  /** 신한장학재단 공지 상세 - 목록보다 먼저 두어 /community/notice/[id] 매칭 */
  [ROUTES.COMMUNITY.NOTICE.DETAIL_PREFIX]: {
    title: '공지사항',
    type: 'Center',
    btnType: 'Back',
    backHref: ROUTES.COMMUNITY.NOTICE.MAIN,
  },
  /** 신한장학재단 공지 목록 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.NOTICE.MAIN]: {
    title: '신한장학재단',
    type: 'Left',
    img: shinhanLogoImg,
    backHref: ROUTES.COMMUNITY.MAIN,
  },
  /** 신한장학재단 이벤트 상세 - 목록보다 먼저 두어 /community/event/[id] 매칭 */
  [ROUTES.COMMUNITY.EVENT.DETAIL_PREFIX]: {
    title: '이벤트',
    type: 'Center',
    btnType: 'Back',
    backHref: ROUTES.COMMUNITY.EVENT.MAIN,
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.MORE],
  },
  /** 커뮤니티 피드 글쓰기 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.FEED.CREATE]: {
    title: '게시글 작성하기',
    type: 'Left',
    btnType: 'Close',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.COMPLETE],
  },
  /** 커뮤니티 소모임 만들기 페이지 헤더 설정 */
  [ROUTES.COMMUNITY.GROUP.CREATE]: {
    title: '소모임 만들기',
    type: 'Left',
    btnType: 'Back',
    navItem: { text: '만들기', ariaLabel: '소모임 만들기' },
  },
  /** 게시글 상세 보기 (공유 링크 진입 시 뒤로가기 = 커뮤니티로) */
  [ROUTES.COMMUNITY.FEED.DETAIL]: {
    title: '게시글',
    type: 'Center',
    btnType: 'Back',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.MORE],
    backHref: ROUTES.COMMUNITY.MAIN,
  },
  /** 게시글 수정 페이지 (동적 경로라 pathPattern으로 매칭) */
  [ROUTES.COMMUNITY.FEED.EDIT]: {
    pathPattern: /^\/community\/feed\/[^/]+\/edit$/,
    title: '게시글 수정',
    type: 'Left',
    btnType: 'Back',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.COMPLETE],
  },
  /** 자치회 리포트 상세 보기 (공유 링크 진입 시 뒤로가기 = 커뮤니티로) */
  [ROUTES.COMMUNITY.COUNCIL.DETAIL]: {
    title: '게시글',
    type: 'Center',
    btnType: 'Back',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.MORE],
    backHref: ROUTES.COMMUNITY.MAIN,
  },
  /** 커뮤니티 소모임 상세 보기 */
  [ROUTES.COMMUNITY.GROUP.DETAIL]: {
    title: '소모임',
    type: 'Center',
    btnType: 'Back',
    backHref: ROUTES.COMMUNITY.GROUP.MAIN,
  },
  /** 소모임 채팅방 (/community/group/[id]/chat) - 제목은 setCustomTitle으로 그룹명 */
  [ROUTES.COMMUNITY.GROUP.CHAT]: {
    pathPattern: /^\/community\/group\/[^/]+\/chat$/,
    title: '채팅',
    type: 'Left',
    btnType: 'Back',
    navItem: HEADER_ITEMS[HEADER_NAV_ITEM_KEY.MORE],
  },
  /** 유지심사 현황 상세보기 */
  [ROUTES.SCHOLARSHIP.MAINTENANCE]: {
    title: '나의 유지심사',
    type: 'Left',
    btnType: 'Back',
  },
  /** MY활동 자치회 상세 페이지 (제목은 useHeaderStore.setCustomTitle으로 '4월 활동' 등 월별 표시) */
  [ROUTES.SCHOLARSHIP.REPORT.ACTIVITY]: {
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.MAIN,
  },
  /** 참여 멤버 상세 (제출 완료 뷰에서 이동, 백 버튼은 페이지에서 activity 쿼리 유지해 설정) */
  [ROUTES.SCHOLARSHIP.REPORT.PARTICIPATION]: {
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.REPORT.ACTIVITY,
  },
  /** 연간 필수 활동 – 학업계획서(GOAL) 상세 (pathPattern으로 타입별 타이틀) */
  'mandatory-goal': {
    pathPattern: /^\/scholarship\/mandatory\/goal\/[^/]+$/,
    title: '학업계획서',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.MAIN,
  },
  /** 연간 필수 활동 – 장학캠프(CAMP) 상세 */
  'mandatory-camp': {
    pathPattern: /^\/scholarship\/mandatory\/camp\/[^/]+$/,
    title: '장학캠프',

    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.MAIN,
  },
  /** 연간 필수 활동 – 만족도 조사(SURVEY) 상세 */
  'mandatory-survey': {
    pathPattern: /^\/scholarship\/mandatory\/survey\/[^/]+$/,
    title: '만족도 조사',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.MAIN,
  },
  /** 연간 필수 활동 상세 - 목록보다 먼저 두어 /scholarship/mandatory/[id] 매칭 */
  [ROUTES.SCHOLARSHIP.MANDATORY.DETAIL_PREFIX]: {
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.SCHOLARSHIP.MAIN,
  },
  /** 마이페이지 설정 메인 페이지 */
  [ROUTES.MYPAGE.SETTING.MAIN]: {
    title: '설정',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.MYPAGE.MAIN,
  },
  /** 마이페이지 개인정보 공개 설정 페이지 */
  [ROUTES.MYPAGE.SETTING.PRIVACY]: {
    title: '개인정보 공개 설정',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.MYPAGE.SETTING.MAIN,
  },
  /** 마이페이지 스크랩 페이지 */
  [ROUTES.MYPAGE.SETTING.SCRAP]: {
    title: '내가 스크랩한 글',
    type: 'Left',
    btnType: 'Back',
    backHref: ROUTES.MYPAGE.SETTING.MAIN,
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
    ariaLabel: '소모임 만들기',
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
  /** 멘토 검색 입력창 */
  MENTOR_SEARCH = 'MENTOR_SEARCH',
  /** 대화 상대 검색 입력창 */
  CHAT_SEARCH = 'CHAT_SEARCH',
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
    showEmoji: false,
    sendButton: true,
    showAnonymous: true,
  },
  [INPUT_BAR_TYPE.MENTOR_SEARCH]: {
    placeholder: '멘토 검색하기',
    leftIcon: 'IconLLineSearchLine',
    showAttach: false,
    showEmoji: false,
    sendButton: false,
  },
  [INPUT_BAR_TYPE.CHAT_SEARCH]: {
    placeholder: '대화 상대 검색하기',
    leftIcon: 'IconLLineSearchLine',
    showAttach: false,
    showEmoji: false,
    sendButton: false,
  },
} as const
