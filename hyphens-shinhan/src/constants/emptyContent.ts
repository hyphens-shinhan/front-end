/** EmptyContent(로딩/빈/에러) 문구 상수 */
export const EMPTY_CONTENT_MESSAGES = {
  LOADING: {
    DEFAULT: '로딩 중...',
    COMMENT: '댓글을 불러오는 중...',
  },
  EMPTY: {
    COMMENT: '아직 댓글이 없습니다.',
  },
  ERROR: {
    /** 리스트 공통 (피드/공지/이벤트 목록) */
    LIST: '데이터를 불러오는 중 오류가 발생했습니다.',
    FEED: '게시글을 불러오는 중 오류가 발생했습니다.',
    NOTICE: '공지사항을 불러오는 중 오류가 발생했습니다.',
    EVENT: '이 이벤트를 불러올 수 없습니다.',
    COMMENT: '댓글을 불러오는 중 오류가 발생했습니다.',
  },
} as const
