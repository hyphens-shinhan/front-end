import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MandatoryService } from '@/services/mandatory'
import { activityKeys } from '@/hooks/activities/useActivities'
import { mandatoryKeys } from './useMandatory'
import type {
  MandatoryActivityCreate,
  GoalSubmissionCreate,
  GoalSubmissionUpdate,
  SimpleReportSubmissionCreate,
  SimpleReportSubmissionUpdate,
} from '@/types/mandatory'

// ---------- Admin: Activity ----------

/**
 * [Admin] 필수 활동 생성
 */
export const useAdminCreateMandatoryActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: MandatoryActivityCreate) =>
      MandatoryService.adminCreateActivity(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.adminActivities(),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
    },
  })
}

/**
 * [Admin] 필수 활동 삭제
 */
export const useAdminDeleteMandatoryActivity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (activityId: string) =>
      MandatoryService.adminDeleteActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.adminActivities(),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
    },
  })
}

// ---------- 제출 생성 ----------

/**
 * [제출 생성] GOAL
 */
export const useCreateSubmissionGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      activityId,
      body,
    }: {
      activityId: string
      body: GoalSubmissionCreate
    }) => MandatoryService.createSubmissionGoal(activityId, body),
    onSuccess: (_, { activityId }) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(activityId),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

/**
 * [제출 생성] SIMPLE_REPORT
 */
export const useCreateSubmissionReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      activityId,
      body,
    }: {
      activityId: string
      body: SimpleReportSubmissionCreate
    }) => MandatoryService.createSubmissionReport(activityId, body),
    onSuccess: (_, { activityId }) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(activityId),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

/**
 * [제출 생성] URL_REDIRECT
 */
export const useCreateSubmissionRedirect = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (activityId: string) =>
      MandatoryService.createSubmissionRedirect(activityId),
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(activityId),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

// ---------- 제출 수정 / 제출·완료 ----------

/**
 * GOAL 제출 수정
 */
export const useUpdateSubmissionGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      submissionId,
      body,
    }: {
      submissionId: string
      body: GoalSubmissionUpdate
    }) => MandatoryService.updateSubmissionGoal(submissionId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(data.activity_id),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

/**
 * SIMPLE_REPORT 제출 수정
 */
export const useUpdateSubmissionReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      submissionId,
      body,
    }: {
      submissionId: string
      body: SimpleReportSubmissionUpdate
    }) => MandatoryService.updateSubmissionReport(submissionId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(data.activity_id),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

/**
 * 제출하기
 */
export const useSubmitSubmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (submissionId: string) =>
      MandatoryService.submitSubmission(submissionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(data.activity_id),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}

/**
 * 완료하기
 */
export const useCompleteSubmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (submissionId: string) =>
      MandatoryService.completeSubmission(submissionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mandatoryKeys.activityLookup(data.activity_id),
      })
      queryClient.invalidateQueries({ queryKey: mandatoryKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.summary() })
    },
  })
}
