import apiClient from './apiClient'
import type {
  SemesterGradeListResponse,
  SemesterGradeCreate,
  SemesterGradeResponse,
  YearGPAResponse,
} from '@/types'

const BASE = '/grades'

export interface ListGradesParams {
  year?: number
  semester?: number
  limit?: number
  offset?: number
}

/**
 * 학점(Grades) API 서비스
 * - GET/POST /grades, GET /grades/{year}/gpa, DELETE /grades/{grade_id}
 */
export const GradesService = {
  /**
   * 학점 목록 (GET /grades?year=&semester=&limit=100&offset=0)
   */
  listGrades: async (
    params?: ListGradesParams,
  ): Promise<SemesterGradeListResponse> => {
    const search = new URLSearchParams()
    if (params?.year != null) search.set('year', String(params.year))
    if (params?.semester != null) search.set('semester', String(params.semester))
    if (params?.limit != null) search.set('limit', String(params.limit))
    if (params?.offset != null) search.set('offset', String(params.offset))
    const query = search.toString()
    const url = query ? `${BASE}?${query}` : BASE
    const response = await apiClient.get<SemesterGradeListResponse>(url)
    return response.data
  },

  /**
   * 학점 추가 (POST /grades)
   */
  createGrade: async (
    body: SemesterGradeCreate,
  ): Promise<SemesterGradeResponse> => {
    const response = await apiClient.post<SemesterGradeResponse>(BASE, body)
    return response.data
  },

  /**
   * 연도별 GPA (GET /grades/{year}/gpa)
   */
  getYearGpa: async (year: number): Promise<YearGPAResponse> => {
    const response = await apiClient.get<YearGPAResponse>(
      `${BASE}/${year}/gpa`,
    )
    return response.data
  },

  /**
   * 학점 삭제 (DELETE /grades/{grade_id})
   */
  deleteGrade: async (gradeId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${gradeId}`)
  },
}
