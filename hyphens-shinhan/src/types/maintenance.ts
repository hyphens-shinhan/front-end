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
