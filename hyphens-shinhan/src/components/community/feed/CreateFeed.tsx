'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useBottomSheetStore, useHeaderStore } from '@/stores'
import { useAutoResize } from '@/hooks/useAutoResize'
import { useImageUpload } from '@/hooks/useImageUpload'
import { IMAGE_UPLOAD } from '@/constants/imageUpload'
import { useFeedPost } from '@/hooks/posts/usePosts'
import { useCreateFeedPost, useUpdateFeedPost } from '@/hooks/posts/usePostMutations'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import { ROUTES } from '@/constants'
import SelectableOption from '@/components/community/SelectableOption'
import Accordion from '@/components/common/Accordion'
import ImagePicker from '@/components/common/ImagePicker'
import EmptyContent from '@/components/common/EmptyContent'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

// Accordion 클릭 시 바텀시트에 띄울 옵션 (SelectableOption에 전달)
const WRITE_OPTIONS = [
  { value: 'anonymous', label: '익명으로 글 쓰기' },
  { value: 'real', label: '실명으로 글 쓰기' },
]

// 기존 + 새 이미지 합쳐서 이 개수를 넘을 수 없음 (API/상수와 동일)
const MAX_FEED_IMAGES = IMAGE_UPLOAD.MAX_IMAGES.FEED

interface CreateFeedProps {
  /** 없으면 작성 모드, 있으면 해당 id 게시글 수정 모드 */
  postId?: string
}

/**
 * 게시글 작성/수정 컴포넌트
 * - postId 없음: 새 게시글 작성
 * - postId 있음: 해당 게시글 불러와서 수정 (익명 여부는 수정 불가)
 */
export default function CreateFeed({ postId }: CreateFeedProps) {
  const router = useRouter()
  const { isOpen, onOpen } = useBottomSheetStore() // 익명/실명 선택 바텀시트 열림 상태
  const { setHandlers, resetHandlers } = useHeaderStore() // 헤더 우측 '완료' 버튼에 연결할 핸들러

  // isAnonymous: 작성 모드에서만 사용. 기본 익명(true)
  const [isAnonymous, setIsAnonymous] = useState(true)
  // content: 본문 텍스트. 수정 모드에서는 post 로드 후 post.content 로 덮어씀
  const [content, setContent] = useState('')
  // existingImageUrls: 수정 모드 전용. 서버에 이미 올라가 있는 이미지 URL (삭제/유지만 가능, 새 파일 아님)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])

  const isEditMode = !!postId // postId가 넘어오면 수정 모드
  // 수정 모드일 때만 쿼리 실행. postId 빈 문자열이면 enabled: false 로 호출 안 함
  const { data: post, isLoading: isLoadingPost, isError: isErrorPost } = useFeedPost(postId ?? '', { enabled: isEditMode })

  // useImageUpload에 넘길 "새로 추가 가능한 이미지 개수"
  // 수정: (전체 5장 - 기존 이미지 수)만큼만 새로 추가 가능. 작성: 5장 전부
  const maxNewImages = isEditMode ? Math.max(0, MAX_FEED_IMAGES - existingImageUrls.length) : MAX_FEED_IMAGES
  const {
    images,           // 새로 선택한 파일 목록 (File + preview URL). 아직 업로드 전
    isUploading,      // Supabase 업로드 진행 중 여부
    fileInputRef,     // <input type="file"> ref (ImagePicker 내부에서 사용)
    handleImageSelect,
    handleRemoveImage,
    openFilePicker,
    uploadImages,     // images를 Supabase에 올리고 URL[] 반환
    canAddMore,       // images.length < maxImages (작성 모드에서만 그대로 사용)
  } = useImageUpload({
    maxImages: maxNewImages,
    bucket: IMAGE_UPLOAD.BUCKET.POSTS,
    pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.FEEDS,
  })

  const { textareaRef, handleResize } = useAutoResize() // textarea 높이 자동 조절
  const { mutateAsync: createFeedPost, isPending: isCreatePending } = useCreateFeedPost()
  const { mutateAsync: updateFeedPost, isPending: isUpdatePending } = useUpdateFeedPost()
  const toast = useToast()

  // 현재 모드에 맞는 API 제출 중 여부 (완료 버튼 비활성·중복 클릭 방지에 사용)
  const isPending = isEditMode ? isUpdatePending : isCreatePending

  // 수정 모드: post 데이터가 들어오면 폼 값 동기화 + textarea 높이 재계산
  useEffect(() => {
    if (post) {
      setContent(post.content)
      setExistingImageUrls(post.image_urls ?? []) // null/undefined면 빈 배열
      // setState 후 렌더링이 완료된 뒤 textarea 높이를 재계산
      requestAnimationFrame(() => handleResize())
    }
  }, [post, handleResize])

  /**
   * 헤더 '완료' 클릭 시 실행.
   * 순서: 중복 방지 → 본문 필수 검사 → 이미지 업로드(있으면) → 생성/수정 API → 상세 페이지로 replace
   */
  const handleCompleteRef = useRef<(() => Promise<void>) | null>(null)
  const handleComplete = async () => {
    // 이미 제출 중이거나 이미지 업로드 중이면 무시 (중복 클릭 방지)
    if (isPending || isUploading) return
    if (!content.trim()) {
      toast.error(TOAST_MESSAGES.FEED.CONTENT_REQUIRED)
      return
    }

    try {
      // API에 넘길 최종 image_urls 배열 구성
      // 수정: 기존 URL부터 유지. 작성: 처음부터 비어 있음
      let imageUrls: string[] = isEditMode ? [...existingImageUrls] : []
      if (images.length > 0) {
        try {
          const uploaded = await uploadImages() // 선택한 File들을 Supabase에 올리고 URL[] 반환
          // 수정: 기존 + 새로 업로드한 URL. 작성: 업로드한 URL만
          imageUrls = isEditMode ? [...existingImageUrls, ...uploaded] : uploaded
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError)
          toast.error(TOAST_MESSAGES.FEED.IMAGE_UPLOAD_ERROR)
          return // 업로드 실패 시 API 호출하지 않고 여기서 종료
        }
      }

      if (isEditMode && postId) {
        await updateFeedPost({
          postId,
          data: {
            content: content.trim(),
            image_urls: imageUrls.length > 0 ? imageUrls : null, // 빈 배열이면 null (API 스펙에 맞춤)
          },
        })
        toast.show(TOAST_MESSAGES.FEED.POST_UPDATE_SUCCESS)
        router.replace(`${ROUTES.COMMUNITY.FEED.DETAIL}/${postId}`) // 히스토리에서 수정 페이지 제거 후 상세로
      } else {
        const result = await createFeedPost({
          content: content.trim(),
          is_anonymous: isAnonymous,
          image_urls: imageUrls.length > 0 ? imageUrls : null,
        })
        router.replace(`${ROUTES.COMMUNITY.FEED.DETAIL}/${result.id}`)
      }
    } catch (error) {
      console.error(isEditMode ? '게시글 수정 실패' : '게시글 생성 실패', error)
      toast.error(isEditMode ? TOAST_MESSAGES.FEED.POST_UPDATE_ERROR : TOAST_MESSAGES.FEED.POST_CREATE_ERROR)
    }
  }
  handleCompleteRef.current = handleComplete

  // 마운트 시 한 번만 헤더에 등록. ref로 항상 최신 handleComplete 호출 → 입력마다 setHandlers 호출 방지
  useEffect(() => {
    setHandlers({ onClick: () => handleCompleteRef.current?.() })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  // 수정 모드: 기존 이미지 중 index번째를 목록에서 제거 (실제 삭제는 완료 시 image_urls에서 제외됨)
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  // ─── 수정 모드 전용: 로딩/에러 시 폼 대신 단순 UI만 렌더 ───
  if (isEditMode && isLoadingPost) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingPlaceholder}>로딩 중...</div>
      </div>
    )
  }

  if (isEditMode && (isErrorPost || !post)) {
    return (
      <div className={styles.container}>
        <EmptyContent variant="error" message="게시글을 불러올 수 없어요." />
      </div>
    )
  }

  // 제출 중이면 버튼 비활성·로딩 문구 표시용 (API 호출 중이거나 이미지 업로드 중)
  const isSubmitting = isPending || isUploading
  // ImagePicker "추가" 버튼 노출 여부. 수정: 기존+새 합계가 5장 미만일 때만. 작성: 훅의 canAddMore
  const canAddMoreTotal = isEditMode ? existingImageUrls.length + images.length < MAX_FEED_IMAGES : canAddMore

  return (
    <div className={styles.container}>
      {/* 작성 모드에서만 표시. 클릭 시 바텀시트로 익명/실명 선택 */}
      {!isEditMode && (
        <Accordion
          title={isAnonymous ? '익명' : '실명'}
          isOpen={isOpen}
          onClick={() =>
            onOpen({
              content: (
                <SelectableOption
                  options={WRITE_OPTIONS}
                  defaultValue={isAnonymous ? 'anonymous' : 'real'}
                  onChange={(value) => setIsAnonymous(value === 'anonymous')}
                />
              ),
              closeOnOverlayClick: true,
            })
          }
        />
      )}
      <div className={styles.contentContainer}>
        <textarea
          ref={textareaRef}
          id="feed-content"
          name="content"
          className={styles.contentInput}
          placeholder="공유하고 싶은 내용이 있나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={handleResize}
          rows={1}
          disabled={isSubmitting}
        />

        {/* 기존 이미지 + 새 이미지 + 추가 버튼을 한 행에 배치 (flex-wrap으로 줄바꿈) */}
        <div className={styles.imagesRow}>
          {/* 수정 모드: 서버에서 가져온 기존 이미지 (삭제 가능) */}
          {isEditMode &&
            existingImageUrls.map((url, index) => (
              <div key={url} className={styles.existingImageWrap}>
                <Image
                  src={url}
                  alt={`기존 이미지 ${index + 1}`}
                  width={80}
                  height={80}
                  className={styles.existingImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveExistingImage(index)}
                  disabled={isSubmitting}
                  aria-label="이미지 제거"
                >
                  <Icon name="IconLLineClose" />
                </button>
              </div>
            ))}
          {/* 새로 선택한 이미지 미리보기 + 추가 버튼 (noWrapper로 같은 행에 흐름) */}
          <ImagePicker
            images={images}
            onSelect={handleImageSelect}
            onRemove={handleRemoveImage}
            onAdd={openFilePicker}
            canAddMore={canAddMoreTotal}
            disabled={isSubmitting}
            fileInputRef={fileInputRef}
            noWrapper
          />
        </div>
      </div>

      {/* API 제출 중 또는 이미지 업로드 중일 때 전체 덮는 로딩 레이어 */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <span className={styles.loadingText}>
            {isUploading ? '이미지 업로드 중...' : isEditMode ? '수정 중...' : '게시 중...'}
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 스타일
// ─────────────────────────────────────────────────────────────
const styles = {
  container: cn('flex flex-col h-full relative overflow-y-auto scrollbar-hide px-4 pb-40'),
  contentContainer: cn('flex flex-col gap-5.5'),
  contentInput: cn(
    'w-full',
    'body-6 text-grey-11',
    'placeholder:text-grey-6 placeholder:body-5',
    'outline-none focus:outline-none',
    'resize-none',
    'disabled:opacity-50',
  ),
  /** 기존 + 새 이미지 + 추가 버튼 한 행 (flex-wrap) */
  imagesRow: cn('flex flex-row flex-wrap gap-2'),
  existingImageWrap: cn('relative'),
  existingImage: cn('rounded-[16px] object-cover w-20 h-20'),
  removeButton: cn(
    'absolute -top-1 -right-1',
    'w-5 h-5 flex items-center justify-center',
    'bg-grey-10 rounded-full text-white text-sm',
    'disabled:opacity-50',
  ),
  loadingPlaceholder: cn('body-5 text-grey-8 py-8'),
  loadingOverlay: cn('absolute inset-0 flex items-center justify-center bg-white/70'),
  loadingText: cn('body-5 text-grey-8'),
}
