/**
 * Reports(활동 보고서) API 타입
 * - 서버 API 요청/응답과 동일한 구조로 유지
 */

// ========== Enums ==========

export type AttendanceStatus = 'PRESENT' | 'ABSENT'

export type ConfirmationStatus = 'PENDING' | 'CONFIRMED'

// ========== 영수증 (요청) ==========

export interface ReceiptItemCreate {
  item_name: string
  price: number
}

export interface ReceiptCreate {
  store_name: string
  image_url: string
  items: ReceiptItemCreate[]
}

// ========== 출석 (요청) ==========

export interface AttendanceItem {
  user_id: string // UUID
  status: AttendanceStatus
}

// ========== 보고서 생성 (POST Body) ==========

export interface ReportCreate {
  title: string
  activity_date: string // "YYYY-MM-DD"
  location: string
  content?: string | null
  image_urls?: string[] | null
  receipts?: ReceiptCreate[] | null
  attendance?: AttendanceItem[] | null
}

// ========== 영수증 (응답) ==========

export interface ReceiptItemResponse {
  id: string
  item_name: string
  price: number
}

export interface ReceiptResponse {
  id: string
  store_name: string
  image_url: string
  created_at: string // ISO datetime
  items: ReceiptItemResponse[]
}

// ========== 출석 (응답) ==========

export interface AttendanceResponse {
  user_id: string
  status: AttendanceStatus
  confirmation: ConfirmationStatus
}

// ========== 보고서 (응답) ==========

export interface ReportResponse {
  id: string
  council_id: string
  year: number
  month: number
  title: string
  activity_date: string // "YYYY-MM-DD"
  location: string
  submitted_at: string // ISO datetime
  receipts: ReceiptResponse[]
  attendance: AttendanceResponse[]
  content: string | null
  image_urls: string[] | null
}
