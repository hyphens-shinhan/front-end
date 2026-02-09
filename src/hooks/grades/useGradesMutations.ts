import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GradesService } from '@/services/grades'
import { gradeKeys } from './useGrades'
import { userKeys } from '@/hooks/user/useUser'
import type { SemesterGradeCreate, SemesterGradeUpdate } from '@/types'

/**
 * 학점 추가 훅 (POST /grades)
 * 전체 탭 학업/GPA가 갱신되도록 grades + user 즉시 refetch
 */
export const useCreateGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SemesterGradeCreate) =>
      GradesService.createGrade(body),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
      queryClient.invalidateQueries({
        queryKey: gradeKeys.yearGpa(data.year),
      })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      await Promise.all([
        queryClient.refetchQueries({ queryKey: gradeKeys.all }),
        queryClient.refetchQueries({ queryKey: userKeys.all }),
      ])
    },
  })
}

/**
 * 학점 수정 훅 (PATCH /grades/{grade_id})
 * 전체 탭(전체 현황) 학업/GPA가 갱신되도록 grades + scholarship-eligibility 즉시 refetch
 */
export const useUpdateGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      gradeId,
      data,
    }: {
      gradeId: string
      data: SemesterGradeUpdate
    }) => GradesService.updateGrade(gradeId, data),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
      queryClient.invalidateQueries({
        queryKey: gradeKeys.yearGpa(data.year),
      })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      // 전체 탭 학업 4.5/4.5 등이 바로 갱신되도록 즉시 refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: gradeKeys.all }),
        queryClient.refetchQueries({ queryKey: userKeys.all }),
      ])
    },
  })
}

/**
 * 학점 삭제 훅 (DELETE /grades/{grade_id})
 * 전체 탭 학업/GPA가 갱신되도록 grades + user 즉시 refetch
 */
export const useDeleteGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (gradeId: string) => GradesService.deleteGrade(gradeId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      await Promise.all([
        queryClient.refetchQueries({ queryKey: gradeKeys.all }),
        queryClient.refetchQueries({ queryKey: userKeys.all }),
      ])
    },
  })
}
