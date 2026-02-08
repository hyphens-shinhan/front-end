import { useQuery } from '@tanstack/react-query'
import { GradesService, type ListGradesParams } from '@/services/grades'

/**
 * Grades(학점) 쿼리 키 관리 객체
 */
export const gradeKeys = {
  all: ['grades'] as const,
  /** 학점 목록 (params 포함 시 캐시 키에 반영) */
  list: (params?: ListGradesParams) =>
    [...gradeKeys.all, 'list', params ?? {}] as const,
  /** 연도별 GPA */
  yearGpa: (year: number) => [...gradeKeys.all, 'gpa', year] as const,
}

/**
 * 학점 목록 조회 (GET /grades)
 */
export const useGrades = (params?: ListGradesParams) => {
  return useQuery({
    queryKey: gradeKeys.list(params),
    queryFn: () => GradesService.listGrades(params),
  })
}

/**
 * 연도별 GPA 조회 (GET /grades/{year}/gpa)
 */
export const useYearGpa = (year: number) => {
  return useQuery({
    queryKey: gradeKeys.yearGpa(year),
    queryFn: () => GradesService.getYearGpa(year),
    enabled: !!year,
  })
}
