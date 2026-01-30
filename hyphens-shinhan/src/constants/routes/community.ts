/** 커뮤니티 라우트 상수 */
export const COMMUNITY_ROUTES = {
  MAIN: '/community',
  SHINHAN_NOTICE: '/community/shinhan-notice',
  FEED: {
    CREATE: '/community/feed/create',
    DETAIL: '/community/feed',
  },
  GROUP: {
    CREATE: '/community/group/create',
  },
} as const
