/** 멘토링 라우트 상수 */
export const MENTOR_ROUTES = {
  MAIN: '/mentors',
  /** 멘토 찾기 설문 (신청하기 플로우) */
  QUESTIONNAIRE: '/mentors/questionnaire',
  /** 멘토 매칭 결과 목록 */
  MATCHES: '/mentors/matches',
  /** 나의 멘토링 내역 */
  HISTORY: '/mentors/history',
  /** 멘토링 신청 풀스크린 - pathPattern /mentors/[id]/apply */
  APPLY: '/mentors/apply',
} as const
