/** 토스트 메시지 상수 (해요체) */
export const TOAST_MESSAGES = {
  /** 프로필 편집 */
  PROFILE: {
    SAVE_SUCCESS: '프로필이 저장되었어요',
    SAVE_ERROR: '프로필 저장에 실패했어요',
  },
  /** 피드(게시글/댓글) */
  FEED: {
    POST_CREATE_ERROR: '네트워크 연결을 확인해주세요',
    POST_UPDATE_SUCCESS: '게시글이 수정되었어요',
    POST_UPDATE_ERROR: '게시글 수정에 실패했어요',
    POST_DELETE_SUCCESS: '게시글이 삭제되었어요',
    POST_DELETE_ERROR: '게시글 삭제에 실패했어요',
    CONTENT_REQUIRED: '내용을 입력해주세요',
    IMAGE_UPLOAD_ERROR:
      '이미지 업로드에 실패했어요 네트워크 연결을 확인해주세요',
    COMMENT_CREATE_ERROR: '댓글 작성에 실패했어요',
    COMMENT_UPDATE_SUCCESS: '댓글이 수정되었어요',
    COMMENT_UPDATE_ERROR: '댓글 수정에 실패했어요',
    COMMENT_DELETE_SUCCESS: '댓글이 삭제되었어요',
    COMMENT_DELETE_ERROR: '댓글 삭제에 실패했어요',
  },
  /** 소모임 */
  GROUP: {
    JOIN_SUCCESS: '소모임에 참여했어요',
    JOIN_ERROR: '참여에 실패했어요',
  },
  /** 활동 보고서 */
  REPORT: {
    DRAFT_SAVE_SUCCESS: '임시 저장했어요',
    DRAFT_SAVE_ERROR: '임시 저장에 실패했어요',
    SUBMIT_SUCCESS: '제출이 완료되었어요',
    SUBMIT_ERROR: '제출에 실패했어요',
    ATTENDANCE_ERROR: '처리에 실패했어요',
  },
  /** 이벤트 */
  EVENT: {
    APPLY_SUCCESS: '이벤트 신청이 완료되었어요',
    APPLY_ERROR: '신청에 실패했어요',
    CANCEL_SUCCESS: '이벤트 신청이 취소되었어요',
    CANCEL_ERROR: '신청 취소에 실패했어요',
  },
  /** 설정 */
  SETTING: {
    PRIVACY_SAVE_SUCCESS: '설정이 저장되었어요',
    PRIVACY_SAVE_ERROR: '설정 저장에 실패했어요',
  },
  /** 인증 */
  AUTH: {
    LOGIN_ERROR: '로그인에 실패했어요',
    LOGOUT_ERROR: '로그아웃에 실패했어요',
  },
} as const
