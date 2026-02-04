import apiClient from './apiClient'
import type {
  MandatoryActivityCreate,
  MandatoryActivityResponse,
  MandatoryActivitiesForYearResponse,
  MandatorySubmissionLookupResponse,
  MandatorySubmissionResponse,
  GoalSubmissionCreate,
  GoalSubmissionUpdate,
  SimpleReportSubmissionCreate,
  SimpleReportSubmissionUpdate,
} from '@/types/mandatory'

const BASE = '/reports/mandatory'
const ADMIN_ACTIVITIES = `${BASE}/admin/activities`
const ADMIN_SUBMISSIONS = (activityId: string) =>
  `${BASE}/admin/submissions/${activityId}`
const SUBMISSION = (submissionId: string) =>
  `${BASE}/submission/${submissionId}`

/**
 * Mandatory(필수 활동) API 서비스
 */
export const MandatoryService = {
  // ---------- Admin: Activity ----------
  /** [Admin] 필수 활동 생성 */
  adminCreateActivity: async (
    body: MandatoryActivityCreate,
  ): Promise<MandatoryActivityResponse> => {
    const { data } = await apiClient.post<MandatoryActivityResponse>(
      ADMIN_ACTIVITIES,
      body,
    )
    return data
  },

  /** [Admin] 필수 활동 목록 */
  adminListActivities: async (): Promise<MandatoryActivityResponse[]> => {
    const { data } =
      await apiClient.get<MandatoryActivityResponse[]>(ADMIN_ACTIVITIES)
    return data
  },

  /** [Admin] 필수 활동 단건 */
  adminGetActivity: async (
    activityId: string,
  ): Promise<MandatoryActivityResponse> => {
    const { data } = await apiClient.get<MandatoryActivityResponse>(
      `${ADMIN_ACTIVITIES}/${activityId}`,
    )
    return data
  },

  /** [Admin] 필수 활동 삭제 */
  adminDeleteActivity: async (activityId: string): Promise<void> => {
    await apiClient.delete(`${ADMIN_ACTIVITIES}/${activityId}`)
  },

  /** [Admin] 특정 활동의 제출 목록 */
  adminListSubmissions: async (
    activityId: string,
  ): Promise<MandatorySubmissionResponse[]> => {
    const { data } = await apiClient.get<MandatorySubmissionResponse[]>(
      ADMIN_SUBMISSIONS(activityId),
    )
    return data
  },

  // ---------- 사용자: 연도/활동 조회 ----------
  /** 연도별 필수 활동 목록 */
  getByYear: async (
    year: number,
  ): Promise<MandatoryActivitiesForYearResponse> => {
    const { data } = await apiClient.get<MandatoryActivitiesForYearResponse>(
      `${BASE}/${year}`,
    )
    return data
  },

  /** 활동 + 내 제출 조회 */
  getActivityLookup: async (
    activityId: string,
  ): Promise<MandatorySubmissionLookupResponse> => {
    const { data } = await apiClient.get<MandatorySubmissionLookupResponse>(
      `${BASE}/activity/${activityId}`,
    )
    return data
  },

  // ---------- 제출 생성 (GOAL / SIMPLE_REPORT / URL_REDIRECT) ----------
  /** [제출 생성] GOAL */
  createSubmissionGoal: async (
    activityId: string,
    body: GoalSubmissionCreate,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.post<MandatorySubmissionResponse>(
      `${BASE}/activity/${activityId}/goal`,
      body,
    )
    return data
  },

  /** [제출 생성] SIMPLE_REPORT */
  createSubmissionReport: async (
    activityId: string,
    body: SimpleReportSubmissionCreate,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.post<MandatorySubmissionResponse>(
      `${BASE}/activity/${activityId}/report`,
      body,
    )
    return data
  },

  /** [제출 생성] URL_REDIRECT (body 없음) */
  createSubmissionRedirect: async (
    activityId: string,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.post<MandatorySubmissionResponse>(
      `${BASE}/activity/${activityId}/redirect`,
    )
    return data
  },

  // ---------- 제출 수정 / 제출·완료 ----------
  /** GOAL 제출 수정 */
  updateSubmissionGoal: async (
    submissionId: string,
    body: GoalSubmissionUpdate,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.patch<MandatorySubmissionResponse>(
      `${SUBMISSION(submissionId)}/goal`,
      body,
    )
    return data
  },

  /** SIMPLE_REPORT 제출 수정 */
  updateSubmissionReport: async (
    submissionId: string,
    body: SimpleReportSubmissionUpdate,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.patch<MandatorySubmissionResponse>(
      `${SUBMISSION(submissionId)}/report`,
      body,
    )
    return data
  },

  /** 제출하기 */
  submitSubmission: async (
    submissionId: string,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.post<MandatorySubmissionResponse>(
      `${SUBMISSION(submissionId)}/submit`,
    )
    return data
  },

  /** 완료하기 */
  completeSubmission: async (
    submissionId: string,
  ): Promise<MandatorySubmissionResponse> => {
    const { data } = await apiClient.post<MandatorySubmissionResponse>(
      `${SUBMISSION(submissionId)}/complete`,
    )
    return data
  },
}
