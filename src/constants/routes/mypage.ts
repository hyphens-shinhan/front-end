/** 마이페이지 라우트 상수 */
export const MYPAGE_ROUTES = {
  MAIN: '/mypage',
  /** 퍼블릭 프로필 페이지 (다른 유저 프로필) */
  PUBLIC_PROFILE: (userId: string) => `/mypage/${userId}`,
  SETTING: {
    MAIN: '/mypage/setting',
    SCRAP: '/mypage/setting/scrap',
    PRIVACY: '/mypage/setting/privacy',
    LOGOUT: '/mypage/setting/logout',
  },
} as const
