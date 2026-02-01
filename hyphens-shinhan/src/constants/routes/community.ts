/** 커뮤니티 라우트 상수 */
export const COMMUNITY_ROUTES = {
  MAIN: '/community',
  NOTICE: {
    MAIN: '/community/notice',
    /** 공지 상세 베이스 - 링크 시 `${DETAIL}/${id}` 사용 (FEED와 동일 패턴) */
    DETAIL: '/community/notice',
    /** 공지 상세 경로 prefix - 헤더 설정 매칭용 (목록과 구분) 실제 경로는 `${DETAIL}/${id}` */
    DETAIL_PREFIX: '/community/notice/',
  },
  FEED: {
    CREATE: '/community/feed/create',
    DETAIL: '/community/feed',
  },
  GROUP: {
    CREATE: '/community/group/create',
  },
} as const
