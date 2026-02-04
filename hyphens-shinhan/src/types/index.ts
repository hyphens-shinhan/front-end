import { NavLink } from './routes'
import { IconName } from '@/components/common/Icon'
import { AllRoutePath } from './routes'

/** 전체 라우트 타입 */
export type { AllRoutePath } from './routes'

/** 바텀 네비게이션 타입 */
export type { NavLink } from './routes'

/** 사용자 역할 타입 */
export type UserRole = 'YB' | 'OB' | 'MENTOR'

/** 바텀 네비게이션 아이템 타입 */
export interface NavItem {
  label: string
  href: NavLink
  icon: IconName
}

/** 상단 헤더 네비게이션 아이템 타입 */
export interface HeaderNavItem {
  href?: string
  icon?: IconName
  type?: 'button' | 'link'
  /** 텍스트 버튼일 경우 표시할 텍스트 */
  text?: string
  /** 접근성: 링크에 부여할 이름 */
  ariaLabel: string
}

/** 포스트 플로팅 액션 버튼 타입 */
export interface PostFABItem {
  icon: IconName
  href: AllRoutePath
  /** 접근성: 링크에 부여할 이름 */
  ariaLabel: string
}

/** InputBar 설정 타입 */
export interface InputBarConfig {
  placeholder: string
  leftIcon?: IconName
  showAttach?: boolean
  showEmoji?: boolean
  sendButton?: boolean
  showAnonymous?: boolean // 익명 버튼 표시 여부
}

// MARK: - Activities (활동) API 타입
export type {
  CouncilReportStatus,
  AcademicReportStatus,
  MandatoryActivityType,
  MandatoryActivityStatus,
  MandatoryReportStatus,
  AppliedEventStatus,
  AppliedEventsStatus,
  MonthlyActivityStatus,
  YearlyActivitySummary,
  ActivitiesSummaryResponse,
} from './activities'
