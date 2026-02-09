/**
 * 학점(Grades) API 타입
 * - GET/POST /api/v1/grades, GET /api/v1/grades/{year}/gpa, DELETE /api/v1/grades/{grade_id}
 */

export type LetterGrade =
  | 'A+'
  | 'A'
  | 'B+'
  | 'B'
  | 'C+'
  | 'C'
  | 'D+'
  | 'D'
  | 'F'

export type Semester = 1 | 2

/** 학기별 성적 1건 응답 */
export interface SemesterGradeResponse {
  id: string
  user_id: string
  year: number
  semester: Semester
  course_name: string
  grade: LetterGrade
  credits: number
  created_at: string
}

/** 학점 목록 응답 */
export interface SemesterGradeListResponse {
  grades: SemesterGradeResponse[]
  total: number
}

/** 학점 추가 요청 */
export interface SemesterGradeCreate {
  year: number
  semester: Semester
  course_name: string
  grade: LetterGrade
  credits: number
}

/** 학점 수정 요청 (PATCH /grades/{grade_id}) – 모두 선택 */
export interface SemesterGradeUpdate {
  course_name?: string
  grade?: LetterGrade
  credits?: number
}

/** 연도별 GPA 학기별 breakdown 1건 */
export interface SemesterBreakdownItem {
  semester: number
  credits: number
  gpa: number
}

/** 연도별 GPA 응답 */
export interface YearGPAResponse {
  year: number
  total_credits: number
  gpa: number
  semester_breakdown: SemesterBreakdownItem[]
  grades: SemesterGradeResponse[]
}
