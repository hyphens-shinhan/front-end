import { ROUTES } from "@/constants/routes";

/** * 1. 유틸리티 타입: 객체 내부의 모든 문자열 값을 재귀적으로 추출 */
type FlattenObjectValues<T> = T extends string
  ? T
  : T extends object
  ? FlattenObjectValues<T[keyof T]>
  : never;

/** * 2. 앱 전체 경로 타입: 모든 상세 페이지 포함 ('/network/person' 등) */
export type AllRoutePath = FlattenObjectValues<typeof ROUTES>;

/** * 3. 바텀 네비게이션 전용 타입: 각 도메인의 메인 입구만 제한 */
export type NavLink =
  | typeof ROUTES.HOME.MAIN
  | typeof ROUTES.NETWORK.MAIN
  | typeof ROUTES.SCHOLARSHIP.MAIN
  | typeof ROUTES.COMMUNITY.MAIN
  | typeof ROUTES.MYPAGE.MAIN
  | typeof ROUTES.MENTOR_DASHBOARD.MAIN
  | typeof ROUTES.MENTOR_DASHBOARD.MENTEES
  | typeof ROUTES.MENTOR_DASHBOARD.MESSAGES
  | typeof ROUTES.MENTOR_DASHBOARD.CALENDAR
  | typeof ROUTES.MENTOR_DASHBOARD.PROFILE;
