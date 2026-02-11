/** 멘토 대시보드 라우트 상수 (멘토 전용 탭/페이지) */
export const MENTOR_DASHBOARD_ROUTES = {
  MAIN: '/mentor/home',
  MENTEES: '/mentor/mentees',
  /** 멘티 상세 (userId는 mentee의 user id) */
  MENTEE_DETAIL: (menteeId: string) => `/mentor/mentees/${menteeId}`,
  MESSAGES: '/mentor/messages',
  CALENDAR: '/mentor/calendar',
  PROFILE: '/mentor/profile',
  PROFILE_EDIT: '/mentor/profile/edit',
} as const
