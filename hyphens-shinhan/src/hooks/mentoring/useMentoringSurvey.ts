import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MentorshipRequest } from '@/types/mentor'
import {
  getMySurvey,
  submitSurvey as submitSurveyApi,
  updateMySurvey as updateMySurveyApi,
  toSurveyCreate,
  fromSurveyResponse,
} from '@/services/mentoring-survey'

export const mentoringSurveyKeys = {
  all: ['mentoring', 'survey'] as const,
  me: () => [...mentoringSurveyKeys.all, 'me'] as const,
}

/**
 * 내 멘토링 설문 조회 (없으면 null, 404는 에러 아님)
 */
export function useMySurvey() {
  return useQuery({
    queryKey: mentoringSurveyKeys.me(),
    queryFn: getMySurvey,
  })
}

/**
 * 설문 폼용 훅: 내 설문 조회 + 제출/재제출 뮤테이션
 * - initialData: 기존 설문이 있으면 폼 초기값
 * - hasExistingSurvey: 재작성 여부 (true면 PUT, false면 POST)
 * - submitSurvey: 설문 제출 (MentorshipRequest -> API 변환 후 POST 또는 PUT)
 */
export function useMentoringSurvey() {
  const queryClient = useQueryClient()
  const mySurveyQuery = useMySurvey()

  const surveyData = mySurveyQuery.data ?? null
  const initialData = surveyData ? fromSurveyResponse(surveyData) : undefined
  const hasExistingSurvey = !!surveyData

  const submitSurveyMutation = useMutation({
    mutationFn: async ({
      request,
      isUpdate,
    }: {
      request: MentorshipRequest
      isUpdate: boolean
    }) => {
      const body = toSurveyCreate(request)
      return isUpdate ? updateMySurveyApi(body) : submitSurveyApi(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringSurveyKeys.me() })
    },
  })

  const submitSurvey = (request: MentorshipRequest) => {
    return submitSurveyMutation.mutateAsync({
      request,
      isUpdate: hasExistingSurvey,
    })
  }

  return {
    /** 내 설문 조회 쿼리 */
    mySurveyQuery,
    /** 기존 설문이 있으면 폼 initialData (없으면 undefined) */
    initialData,
    /** 기존 설문 존재 여부 (재작성 시 true → PUT) */
    hasExistingSurvey,
    /** 설문 조회 로딩 */
    isLoadingSurvey: mySurveyQuery.isLoading,
    /** 설문 조회 에러 (404는 제외하고 null 반환하므로 네트워크 등만) */
    surveyError: mySurveyQuery.error,
    /** 설문 제출 뮤테이션 */
    submitSurveyMutation,
    /** 설문 제출 (POST 또는 PUT) - Promise 반환 */
    submitSurvey,
  }
}
