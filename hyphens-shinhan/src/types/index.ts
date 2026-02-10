/**
 * 공통 타입 진입점
 * - 라우트/네비/UI 설정 타입과 API 타입 re-export
 */
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

// MARK: - Activities (활동 요약/상태) API 타입
export type {
  ActivityStatus,
  CouncilReportStatus,
  AcademicReportStatus,
  MandatoryActivityType,
  MandatoryActivityStatus,
  AppliedEventStatus,
  MonthlyActivityStatus,
  YearlyActivitySummary,
  ActivitiesSummaryResponse,
} from './activities'

// MARK: - 공통 (Mandatory 등에서 공통 사용, AcademicGoalCategory는 academic에서 export)
export type { ActivityStatusType } from './common'

// MARK: - Mandatory (필수 활동) API 타입
export type {
  MandatoryActivityType as MandatoryApiActivityType,
  MandatoryActivityCreate,
  MandatoryActivityResponse,
  MandatoryGoalCreate,
  MandatoryGoalResponse,
  GoalSubmissionCreate,
  GoalSubmissionUpdate,
  SimpleReportSubmissionCreate,
  SimpleReportSubmissionUpdate,
  MandatorySubmissionResponse,
  MandatorySubmissionLookupResponse,
  MandatoryActivitiesForYearResponse,
} from './mandatory'

// MARK: - Academic (유지 심사/월별 학업 보고서) API 타입
export { AcademicGoalCategory } from './academic'
export type {
  GoalCreate,
  GoalResponse,
  AcademicReportCreate,
  AcademicReportUpdate,
  AcademicReportResponse,
  AcademicReportListResponse,
  AcademicReportLookupResponse,
  MonitoringEnableResponse,
  MonitoringDisableResponse,
  UserMonitoringYearsResponse,
  AcademicApi,
} from './academic'

// MARK: - Reports (활동 보고서) API 타입
export { AttendanceStatus, ConfirmationStatus } from './reports'
export type {
  ReceiptItemCreate,
  ReceiptCreate,
  AttendanceItem,
  ReportUpdate,
  ReceiptItemResponse,
  ReceiptResponse,
  AttendanceResponse,
  ReportResponse,
  PublicAttendanceResponse,
  PublicReportResponse,
  ToggleVisibilityResponse,
  ReportApi,
} from './reports'

// MARK: - Councils API 타입
export type {
  CouncilCreate,
  CouncilUpdate,
  CouncilMemberAddRequest,
  CouncilResponse,
  CouncilListResponse,
  CouncilMemberResponse,
  MonthActivityStatus,
  CouncilActivity,
  CouncilActivityResponse,
  CouncilMessageResponse,
} from './councils'

// MARK: - User (유저 프로필/프라이버시) API 타입
export type {
  UserHomeProfile,
  UserMyProfile,
  UserPublicProfile,
  UserProfileUpdate,
  UserPrivacySettings,
  UserPrivacyUpdate,
  ScholarshipEligibilityResponse,
} from './user'
export { AppRole, ScholarshipType } from './user'

// MARK: - Maintenance (유지심사 상세: 필수활동 현황, 봉사시간)
export type {
  MandatoryStatusActivity,
  MandatoryStatusResponse,
  VolunteerHoursResponse,
  VolunteerHoursUpdate,
} from './maintenance'

// MARK: - Grades (학점/GPA)
export type {
  LetterGrade,
  Semester,
  SemesterGradeResponse,
  SemesterGradeListResponse,
  SemesterGradeCreate,
  SemesterGradeUpdate,
  SemesterBreakdownItem,
  YearGPAResponse,
} from './grades'

// MARK: - Network (네트워크/멘토/팔로잉)
export type {
  Generation,
  ScholarshipType as NetworkScholarshipType,
  Location,
  MentorListRole,
  Person,
} from './network'

// MARK: - Chat (채팅: DM + Group)
export type {
  ChatRoomType,
  ChatRoomMember,
  MessageResponse,
  MessageCreate,
  MessageListResponse,
  ChatRoomResponse,
  ChatRoomListResponse,
  // Legacy DM types (하위 호환성)
  MessageAttachment,
  ChatMessage,
  Conversation,
} from './chat'

// MARK: - Clubs (소모임)
export type {
  ClubCategory,
  ClubAnonymity,
  ClubCreate,
  ClubUpdate,
  UserClubProfile,
  ClubResponse,
  ClubListResponse,
  ClubListQuery,
  GalleryImageCreate,
  GalleryImageResponse,
  GalleryListResponse,
  GalleryListQuery,
  ClubJoinResponse,
  ClubLeaveResponse,
  GalleryDeleteResponse,
  ClubMemberResponse,
  ClubMemberListResponse,
  RandomNicknameResponse,
} from './clubs'

// MARK: - Videos (비디오 목록/생성/삭제, ADMIN 전용 생성·삭제)
export type { VideoCreate, VideoResponse, VideoListResponse } from './videos'
