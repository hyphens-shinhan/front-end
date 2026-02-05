'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetStore, useHeaderStore } from '@/stores'
import { useAutoResize } from '@/hooks/useAutoResize'
import { useImageUpload } from '@/hooks/useImageUpload'
import { IMAGE_UPLOAD } from '@/constants/imageUpload'
import { useCreateFeedPost } from '@/hooks/posts/usePostMutations'
import SelectableOption from '@/components/community/SelectableOption'
import Accordion from '@/components/common/Accordion'
import ImagePicker from '@/components/common/ImagePicker'
import { cn } from '@/utils/cn'

const WRITE_OPTIONS = [
  { value: 'anonymous', label: '익명으로 글 쓰기' },
  { value: 'real', label: '실명으로 글 쓰기' },
]

/**
 * 게시글 작성 컴포넌트
 *
 * 훅, 이벤트, 상태관리 등 클라이언트 로직 담당
 */
export default function CreateFeed() {
  const router = useRouter()

  // 모달 상태 관리
  const { isOpen, onOpen } = useBottomSheetStore()
  // 헤더 핸들러 설정
  const { setHandlers, resetHandlers } = useHeaderStore()
  // 작성 타입 선택
  const [isAnonymous, setIsAnonymous] = useState(true)
  // 게시글 내용
  const [content, setContent] = useState('')

  // textarea 높이 자동 조절
  const { textareaRef, handleResize } = useAutoResize()

  // 이미지 업로드 훅
  const {
    images,
    isUploading,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    openFilePicker,
    uploadImages,
    canAddMore,
  } = useImageUpload({
    maxImages: IMAGE_UPLOAD.MAX_IMAGES.FEED,
    bucket: IMAGE_UPLOAD.BUCKET,
    pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.FEEDS,
  })

  // 피드 생성 훅
  const { mutateAsync: createFeedPost, isPending } = useCreateFeedPost()

  // ─────────────────────────────────────────────────────────────
  // 완료 버튼 클릭 핸들러
  // ─────────────────────────────────────────────────────────────
  const handleComplete = async () => {
    if (!content.trim()) {
      // TODO: 에러 메시지 표시 - toast 만들어서 쓰는게 좋지 않을까 ?
      alert('내용을 입력해주세요.')
      return
    }

    try {
      // 1. 이미지가 있으면 먼저 Supabase에 업로드
      let imageUrls: string[] = []
      if (images.length > 0) {
        try {
          imageUrls = await uploadImages()
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError)
          // TODO: toast 만들어서 쓰는게 좋지 않을까 ?
          alert('이미지 업로드에 실패했습니다. 네트워크 연결을 확인해주세요.')
          return // 피드 생성 중단
        }
      }

      // 2. 피드 생성 API 호출
      const result = await createFeedPost({
        content: content.trim(),
        is_anonymous: isAnonymous,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      })

      // 3. 생성된 게시글 상세로 이동
      router.push(`/community/feed/${result.id}`)
    } catch (error) {
      console.error('게시글 생성 실패:', error)
      alert('게시글 생성에 실패했습니다. 네트워크 연결을 확인해주세요.')
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 헤더 핸들러 설정
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setHandlers({ onClick: handleComplete })
    return () => resetHandlers()
  }, [content, isAnonymous, images])

  // ─────────────────────────────────────────────────────────────
  // 바텀시트 열기
  // ─────────────────────────────────────────────────────────────
  const handleOpenBottomSheet = () => {
    onOpen({
      content: (
        <SelectableOption
          options={WRITE_OPTIONS}
          defaultValue={isAnonymous ? 'anonymous' : 'real'}
          onChange={(value) => {
            setIsAnonymous(value === 'anonymous')
          }}
        />
      ),
      closeOnOverlayClick: true,
    })
  }

  // ─────────────────────────────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────────────────────────────
  const isSubmitting = isPending || isUploading

  return (
    <div className={styles.container}>
      <Accordion
        title={isAnonymous ? '익명' : '실명'}
        isOpen={isOpen}
        onClick={handleOpenBottomSheet}
      />
      {/** 게시글 내용 작성 폼 */}
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
        {/** 이미지 첨부 영역 */}
        <ImagePicker
          images={images}
          onSelect={handleImageSelect}
          onRemove={handleRemoveImage}
          onAdd={openFilePicker}
          canAddMore={canAddMore}
          disabled={isSubmitting}
          fileInputRef={fileInputRef}
        />
      </div>

      {/** TODO: 로딩 오버레이 */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <span className={styles.loadingText}>
            {isUploading ? '이미지 업로드 중...' : '게시 중...'}
          </span>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: cn('flex flex-col h-full relative overflow-y-auto scrollbar-hide px-4'),
  contentContainer: cn('flex flex-col gap-5.5'),
  contentInput: cn(
    'w-full',
    'body-6 text-grey-11',
    'placeholder:text-grey-6 placeholder:body-5',
    'outline-none focus:outline-none',
    'resize-none',
    'disabled:opacity-50',
  ),
  loadingOverlay: cn(
    'absolute inset-0',
    'flex items-center justify-center',
    'bg-white/70',
  ),
  loadingText: cn('body-5 text-grey-8'),
}
