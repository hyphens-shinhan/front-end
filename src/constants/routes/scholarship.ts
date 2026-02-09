/** 장학 활동 라우트 상수 */
export const SCHOLARSHIP_ROUTES = {
  MAIN: '/scholarship',
  REPORT: {
    ACTIVITY: '/scholarship/activity',
    /** 참여 멤버 상세 (제출 완료 뷰에서 이동) */
    PARTICIPATION: '/scholarship/activity/participation',
  },
} as const
