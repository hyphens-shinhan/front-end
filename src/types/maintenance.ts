/**
 * 유지심사 상세 API 타입 (필수활동 완료 현황, 봉사시간)
 * - GET /api/v1/users/me/mandatory-status
 * - GET/PATCH /api/v1/users/me/volunteer
 */

/** 필수활동 1건 상태 (GET /users/me/mandatory-status 응답용, activities.ts MandatoryActivityStatus와 별개) */
export interface MandatoryStatusActivity {
  id: string
  title: string
  due_date: string
  activity_type: string
  is_completed: boolean
}

/** 필수활동 완료 현황 응답 */
export interface MandatoryStatusResponse {
  year: number
  total: number
  completed: number
  activities: MandatoryStatusActivity[]
}

/** 봉사시간 조회 응답 */
export interface VolunteerHoursResponse {
  volunteer_hours: number
}

/** 봉사시간 수정 요청 (0~10000) */
export interface VolunteerHoursUpdate {
  volunteer_hours: number
}

/** 유지심사 대시보드용 타입 (hyphens-frontend 동일 구조) */
export type CriterionStatus = '충족' | '주의' | '위험' | '미달'
export type EventAttendanceStatus = 'attended' | 'missed' | 'upcoming' | 'pending'

export interface GpaTracking {
  current: number
  required: number
  maxGpa: number
  lastUpdated?: string
  nextUpdate?: string
  semesterBreakdown?: { semester: string; gpa: number; credits: number }[]
  status: CriterionStatus
}

export interface CreditTracking {
  current: number
  required: number
  status: CriterionStatus
  semesterBreakdown: {
    semester: string
    credits: number
    courses?: { name: string; credits: number; grade?: string }[]
  }[]
  deadline: string
  progressPercentage: number
}

export interface VolunteerActivity {
  id: string
  date: string
  activityName: string
  hours: number
  status: 'approved' | 'pending' | 'rejected'
  organization?: string
}

export interface VolunteerTracking {
  current: number
  required: number
  pending: number
  status: CriterionStatus
  activities: VolunteerActivity[]
  deadline: string
  progressPercentage: number
}

export interface MaintenanceEvent {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  type: string
  attendanceStatus: EventAttendanceStatus
}

export interface EventTracking {
  attended: number
  required: number
  missed: number
  upcoming: number
  status: CriterionStatus
  events: MaintenanceEvent[]
  nextEvent?: MaintenanceEvent
}

export interface IncomeTracking {
  status: CriterionStatus
  isBasicLivelihoodRecipient?: boolean
  isLegalNextLevelClass?: boolean
  supportBracket?: number
  supportBracketRequired: number
  lastUpdated?: string
  nextApplicationDeadline?: string
  documents?: {
    id: string
    name: string
    type: string
    uploadedDate: string
    status: 'approved' | 'pending' | 'rejected'
  }[]
}

export interface MaintenanceCriteria {
  gpa: GpaTracking
  credits: CreditTracking
  volunteer: VolunteerTracking
  events: EventTracking
  income: IncomeTracking
}

export interface MaintenanceDashboard {
  year: number
  overallStatus: '양호' | '주의' | '위험' | '미달'
  criteria: MaintenanceCriteria
  nextDeadline?: { date: string; description: string; title?: string }
  progressPercentage: number
}
