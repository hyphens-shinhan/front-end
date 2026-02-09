/** 멘토링 라우트 상수 */
export const MENTOR_ROUTES = {
  /** 멘토 찾기 설문 (신청하기 플로우) */
  QUESTIONNAIRE: '/mentors/questionnaire',
  /** 멘토 매칭 결과 목록 */
  MATCHES: '/mentors/matches',
  /** 나의 멘토링 내역 */
  HISTORY: '/mentors/history',
  /** 멘토 프로필 상세 - use with /mentors/[id] */
  DETAIL_PREFIX: '/mentors/',
} as const
