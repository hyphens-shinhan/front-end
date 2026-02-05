/**
 * Councils API 타입 (서버 app/schemas/council.py 기준)
 * Base: /api/v1/councils
 */

// --- 요청 ---

/** POST /councils */
export interface CouncilCreate {
  year: number
  affiliation: string
  region: string
  leader_id?: string | null
}

/** PATCH /councils/{council_id} */
export interface CouncilUpdate {
  year?: number | null
  affiliation?: string | null
  region?: string | null
  leader_id?: string | null
}

/** POST /councils/{council_id}/members */
export interface CouncilMemberAddRequest {
  target_user_id: string
}

// --- 응답 ---

export interface CouncilResponse {
  id: string
  year: number
  affiliation: string
  region: string
  member_count: number
  leader_id: string | null
}

/** GET /councils (목록) */
export interface CouncilListResponse {
  councils: CouncilResponse[]
  total: number
}

/** GET /councils/{council_id}/members */
export interface CouncilMemberResponse {
  id: string
  name: string
  avatar_url: string | null
  is_leader?: boolean
}

/** 월별 활동 리포트 상태 (4~12월) */
export interface MonthActivityStatus {
  submitted: boolean
  report_id?: string | null
  title?: string | null
}

/** GET /councils/me/{year} 내 council + 활동 상태 */
export interface CouncilActivity {
  id: string
  year: number
  affiliation: string
  region: string
  member_count: number
  leader_id: string | null
  /** 4~12월 키, MonthActivityStatus 값 */
  activity_status: Record<number, MonthActivityStatus>
}

/** GET /councils/me/{year} */
export interface CouncilActivityResponse {
  year: number
  councils: CouncilActivity[]
}

// --- 기타 응답 (메시지만) ---

export interface CouncilMessageResponse {
  message: string
}
