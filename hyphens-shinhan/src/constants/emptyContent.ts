/** EmptyContent(로딩/빈/에러) 문구 상수 */
export const EMPTY_CONTENT_MESSAGES = {
  LOADING: {
    DEFAULT: '로딩 중...',
    COMMENT: '댓글을 불러오는 중...',
    GROUP: '소모임 목록을 불러오는 중...',
  },
  EMPTY: {
    COMMENT: '아직 댓글이 없습니다.',
    GROUP: '소모임이 없습니다.',
    MY_GROUP: '참여 중인 소모임이 없습니다.',
    GALLERY: '등록된 앨범 사진이 없어요',
    /** 앨범 탭에서 비멤버일 때 */
    GALLERY_MEMBERS_ONLY: '앨범은 소모임 멤버에게만 공개됩니다.\n참여 후 사진을 확인해 보세요.',
    /** 연간 필수 활동 없음 */
    MANDATORY_ACTIVITY: '연간 필수 활동이 없습니다.',
    /** 내가 신청한 프로그램 없음 */
    APPLIED_PROGRAMS: '신청한 프로그램이 없습니다.',
    /** 해당 연도 이사회 정보 없음 (활동 보고서 상세) */
    REPORT_NO_COUNCIL: '해당 연도의 이사회 정보가 없습니다.',
  },
  ERROR: {
    /** 리스트 공통 (피드/공지/이벤트 목록) */
    LIST: '데이터를 불러오는 중 오류가 발생했습니다.',
    FEED: '게시글을 불러오는 중 오류가 발생했습니다.',
    NOTICE: '공지사항을 불러오는 중 오류가 발생했습니다.',
    EVENT: '이 이벤트를 불러올 수 없습니다.',
    COMMENT: '댓글을 불러오는 중 오류가 발생했습니다.',
    GROUP: '소모임 목록을 불러오는 중 오류가 발생했습니다.',
    /** 활동 보고서 상세 조회 실패 */
    REPORT: '보고서를 불러올 수 없습니다.',
  },
} as const
