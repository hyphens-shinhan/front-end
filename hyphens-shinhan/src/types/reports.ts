/**
 * Report API 타입 (서버 app/schemas/report.py 기준)
 *
 * - Base path: /api/v1/reports
 * - 회의(council) 활동 보고서 조회/초안 수정/제출, 출석 확인·취소 등에 사용
 */

// ========== Enums ==========

/** 출석 상태: 참석 / 불참 */
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
} as const
export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus]

/** (제출된 보고서에서) 내 출석 확인 여부: 대기 중 / 확인 완료 */
export const ConfirmationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
} as const
export type ConfirmationStatus =
  (typeof ConfirmationStatus)[keyof typeof ConfirmationStatus]

// ========== 요청용 (PATCH 등) ==========

/** 영수증 항목 생성 요청: 품목명과 금액 */
export interface ReceiptItemCreate {
  /** 품목명 */
  item_name: string
  /** 단가 (원) */
  price: number
}

/** 영수증 생성 요청: 가게명, 이미지, 항목 목록 */
export interface ReceiptCreate {
  /** 가게(매장) 이름 */
  store_name: string
  /** 영수증 이미지 URL */
  image_url: string
  /** 품목 목록 */
  items: ReceiptItemCreate[]
}

/** 출석 항목: 특정 사용자의 출석 상태 (초안 수정 시 사용) */
export interface AttendanceItem {
  /** 사용자 UUID */
  user_id: string
  /** 출석 여부 (PRESENT / ABSENT) */
  status: AttendanceStatus
}

/**
 * 활동 보고서 초안 수정 요청 (PATCH body)
 * - 리더만 사용. 모든 필드 optional, null이면 해당 필드 제거/초기화로 해석 가능
 */
export interface ReportUpdate {
  /** 활동 제목 */
  title?: string | null
  /** 활동 일자 (ISO date "YYYY-MM-DD") */
  activity_date?: string | null
  /** 활동 장소 */
  location?: string | null
  /** 활동 내용 (본문) */
  content?: string | null
  /** 활동 사진 URL 목록 */
  image_urls?: string[] | null
  /** 영수증 목록 (생성용) */
  receipts?: ReceiptCreate[] | null
  /** 출석 명단 (user_id + status) */
  attendance?: AttendanceItem[] | null
}

// ========== 응답용 ==========

/** 영수증 항목 응답: 서버 부여 id 포함 */
export interface ReceiptItemResponse {
  /** 항목 ID (UUID) */
  id: string
  /** 품목명 */
  item_name: string
  /** 단가 (원) */
  price: number
}

/** 영수증 응답: 가게명, 이미지, 생성 시각, 항목 목록 */
export interface ReceiptResponse {
  /** 영수증 ID (UUID) */
  id: string
  /** 가게(매장) 이름 */
  store_name: string
  /** 영수증 이미지 URL */
  image_url: string
  /** 생성 시각 (ISO 8601 datetime) */
  created_at: string
  /** 품목 목록 */
  items: ReceiptItemResponse[]
}

/** 출석 한 명 응답: 사용자 정보 + 출석/확인 상태 */
export interface AttendanceResponse {
  /** 사용자 UUID */
  user_id: string
  /** 표시 이름 */
  name: string
  /** 프로필 이미지 URL (없으면 null) */
  avatar_url: string | null
  /** 출석 여부 (PRESENT / ABSENT) */
  status: AttendanceStatus
  /** 내 출석 확인 여부 (제출된 보고서에서만 의미 있음) */
  confirmation: ConfirmationStatus
}

/**
 * 활동 보고서 응답 (GET / PATCH / POST submit 결과)
 * - 연·월별 회의 보고서 한 건
 */
export interface ReportResponse {
  /** 보고서 ID (UUID) */
  id: string
  /** 회의(council) ID (UUID) */
  council_id: string
  /** 연도 */
  year: number
  /** 월 (4–12, API 검증) */
  month: number
  /** 활동 제목 */
  title: string
  /** 활동 일자 (ISO date, 없으면 null) */
  activity_date: string | null
  /** 활동 장소 (없으면 null) */
  location: string | null
  /** 제출 여부 (리더가 submit 한 경우 true) */
  is_submitted: boolean
  /** 제출 시각 (ISO 8601 datetime) */
  submitted_at: string
  /** 영수증 목록 */
  receipts: ReceiptResponse[]
  /** 출석 명단 (이름, 아바타, 출석/확인 상태 포함) */
  attendance: AttendanceResponse[]
  /** 활동 내용 본문 (없으면 null) */
  content: string | null
  /** 활동 사진 URL 목록 (없으면 null) */
  image_urls: string[] | null
}
