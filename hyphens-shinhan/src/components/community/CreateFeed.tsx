'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetStore, useHeaderStore } from '@/stores'
import { useAutoResize } from '@/hooks/useAutoResize'
import SelectableOption from '@/components/community/SelectableOption'
import Accordion from '@/components/common/Accordion'
import { cn } from '@/utils/cn'
import { Icon } from '../common/Icon'

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
  const writeTypeRef = useRef('anonymous')
  // textarea 높이 자동 조절
  const { textareaRef, handleResize } = useAutoResize()

  // ─────────────────────────────────────────────────────────────
  // 완료 버튼 클릭 핸들러
  // ─────────────────────────────────────────────────────────────
  const handleComplete = async () => {
    // TODO: 게시물 생성 API 호출
    // const postId = await createPost({ ... })

    const postId = '1' // 임시: 실제로는 API 응답에서 받은 ID
    router.push(`/community/feed/${postId}`)
  }

  // ─────────────────────────────────────────────────────────────
  // 헤더 핸들러 설정
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setHandlers({ onClick: handleComplete })
    return () => resetHandlers()
  }, [])

  // ─────────────────────────────────────────────────────────────
  // 바텀시트 열기
  // ─────────────────────────────────────────────────────────────
  const handleOpenBottomSheet = () => {
    onOpen({
      content: (
        <SelectableOption
          options={WRITE_OPTIONS}
          defaultValue={writeTypeRef.current}
          onChange={(value) => {
            writeTypeRef.current = value
          }}
        />
      ),
      closeOnOverlayClick: true,
    })
  }

  // ─────────────────────────────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <Accordion
        title="익명"
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
          onInput={handleResize}
          rows={1}
        />
        {/** 이미지 첨부 영역 */}
        <div className={styles.imageContainer}>
          {/** 이미지 미리보기 영역 */}
          <div className={styles.imagePreview} />
          <div className={styles.imagePreview} />
          <div className={styles.imagePreview} />

          {/** 이미지 첨부 버튼 */}
          <div className={cn(styles.imagePreview, styles.imageUploadButton)}>
            <Icon name='IconLLinePlus' />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col h-full'),
  contentContainer: cn('flex flex-col p-4 gap-5.5'),
  contentInput: cn(
    'w-full',
    'body-6 text-grey-11',
    'placeholder:text-grey-6 placeholder:body-5',
    'outline-none focus:outline-none',
    'resize-none',
  ),
  imageContainer: cn(
    'flex flex-row flex-wrap gap-2'
  ),
  imagePreview: cn(
    'flex items-center justify-center',
    'w-20 h-20',
    'bg-grey-2 rounded-[16px]',
  ),
  imageUploadButton: cn(
    'bg-grey-2 text-grey-6',
  ),
}
