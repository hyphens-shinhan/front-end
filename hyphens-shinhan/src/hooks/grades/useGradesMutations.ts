import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GradesService } from '@/services/grades'
import { gradeKeys } from './useGrades'
import type { SemesterGradeCreate } from '@/types'

/**
 * 학점 추가 훅 (POST /grades)
 */
export const useCreateGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SemesterGradeCreate) =>
      GradesService.createGrade(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
      queryClient.invalidateQueries({
        queryKey: gradeKeys.yearGpa(data.year),
      })
    },
  })
}

/**
 * 학점 삭제 훅 (DELETE /grades/{grade_id})
 */
export const useDeleteGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (gradeId: string) => GradesService.deleteGrade(gradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
    },
  })
}
