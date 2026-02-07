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
  EVENT: {
    /** 이벤트 목록 = 공지 페이지 이벤트 탭 (뒤로가기/목록으로용) */
    MAIN: '/community/notice?tab=이벤트',
    /** 이벤트 상세 베이스 - 링크 시 `${DETAIL}/${id}` 사용 */
    DETAIL: '/community/event',
    /** 이벤트 상세 경로 prefix - 헤더 설정 매칭용 */
    DETAIL_PREFIX: '/community/event/',
  },
  FEED: {
    CREATE: '/community/feed/create',
    DETAIL: '/community/feed',
  },
  COUNCIL: {
    /** 자치회 리포트 상세 베이스 - 링크 시 `${DETAIL}/${id}` 사용 */
    DETAIL: '/community/council',
  },
  GROUP: {
    /** 이벤트 목록 = 공지 페이지 이벤트 탭 (뒤로가기/목록으로용) */
    MAIN: '/community?tab=소모임',
    CREATE: '/community/group/create',
    DETAIL: '/community/group',
  },
} as const
