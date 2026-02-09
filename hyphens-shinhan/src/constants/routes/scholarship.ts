/** 장학 활동 라우트 상수 */
export const SCHOLARSHIP_ROUTES = {
  MAIN: '/scholarship',
  REPORT: {
    ACTIVITY: '/scholarship/activity',
    /** 참여 멤버 상세 (제출 완료 뷰에서 이동) */
    PARTICIPATION: '/scholarship/activity/participation',
  },
  /** 연간 필수 활동 - 타입별 상세. 링크 시 `${GOAL}/${activityId}` 등 사용 */
  MANDATORY: {
    DETAIL: '/scholarship/mandatory',
    DETAIL_PREFIX: '/scholarship/mandatory/',
    /** 학업 계획서 제출 (GOAL) */
    GOAL: '/scholarship/mandatory/goal',
    /** 장학캠프 (SIMPLE_REPORT) */
    CAMP: '/scholarship/mandatory/camp',
    /** 만족도 조사 (URL_REDIRECT) */
    SURVEY: '/scholarship/mandatory/survey',
  },
} as const
