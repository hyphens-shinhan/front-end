/**
 * 이미지 업로드(Supabase Storage)용 bucket / pathPrefix / 최대 장수 상수
 * - useImageUpload 훅 및 커뮤니티·자치회 활동 등 업로드 사용처에서 공통 사용
 * - 버킷: posts(커뮤니티), reports(자치회 활동 보고서)
 */
export const IMAGE_UPLOAD = {
  /** Supabase Storage 버킷 이름 (용도별) */
  BUCKET: {
    /** 커뮤니티 피드 */
    POSTS: 'posts',
    /** 자치회 활동 보고서 (사진·영수증) */
    REPORTS: 'reports',
    /** 프로필 아바타 이미지 */
    AVATARS: 'avatars',
  },

  /** 저장 경로 접두사 (버킷 내 폴더 구분) */
  PATH_PREFIX: {
    /** 커뮤니티 피드 이미지 (posts 버킷) */
    FEEDS: 'feeds',
    /** 자치회 활동 보고서 사진 (reports 버킷) */
    REPORT_PHOTOS: 'photos',
    /** 자치회 활동 영수증 (reports 버킷) */
    REPORT_RECEIPTS: 'receipts',
  },

  /** 화면별 최대 이미지 개수 */
  MAX_IMAGES: {
    /** 커뮤니티 피드 */
    FEED: 5,
    /** 자치회 활동 보고서 사진 */
    ACTIVITY_PHOTOS: 5,
    /** 자치회 활동 영수증 */
    RECEIPTS: 3,
    /** 업로드 없이 기존 이미지만 표시할 때 (추가 선택 불가) */
    VIEW_ONLY: 0,
  },
} as const
