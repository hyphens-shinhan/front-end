'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { useHeaderStore } from '@/stores'
import { useCreateClub, useJoinClub } from '@/hooks/clubs/useClubMutations'
import { useJoinClubChat } from '@/hooks/chat/useChatMutations'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import type { ClubCategory, ClubAnonymity } from '@/types/clubs'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/common/Icon'
import { useMyProfile } from '@/hooks/user/useUser'
import { useImageUpload } from '@/hooks/useImageUpload'

const CATEGORIES: { value: ClubCategory; label: string }[] = [
  { value: 'STUDY', label: '스터디' },
  { value: 'VOLUNTEER', label: '봉사' },
  { value: 'GLOBAL', label: '취미' },
]

const PARTICIPATION_OPTIONS: { value: ClubAnonymity; label: string }[] = [
  { value: 'PUBLIC', label: '실명 참가' },
  { value: 'PRIVATE', label: '익명 참가' },
  { value: 'BOTH', label: '둘 다 가능' },
]

const MAX_NAME_LENGTH = 40
const MAX_DESCRIPTION_LENGTH = 500

export default function CreateGroup() {
  const router = useRouter()
  const { setHandlers, resetHandlers } = useHeaderStore()
  const toast = useToast()

  // 커버 이미지 (useImageUpload 훅 – 업로드 로직은 submit 시 uploadImages() 사용)
  const {
    images: coverImages,
    fileInputRef: coverInputRef,
    handleImageSelect: handleCoverSelect,
    handleRemoveImage: handleRemoveCover,
    openFilePicker: openCoverPicker,
    uploadImages: uploadCoverImages,
  } = useImageUpload({ maxImages: 1, bucket: 'clubs', pathPrefix: 'covers' })

  const coverFile = coverImages[0] ?? null

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClubCategory | null>(null)
  const [participationMode, setParticipationMode] = useState<ClubAnonymity | null>(null)
  const [description, setDescription] = useState('')

  // Mutations & Data
  const { data: myProfile } = useMyProfile()
  const { mutateAsync: createClub, isPending: isSubmitting } = useCreateClub()
  const { mutateAsync: joinClub } = useJoinClub()
  const { mutateAsync: joinClubChat } = useJoinClubChat()

  const canSubmit =
    name.trim().length >= 2 &&
    category !== null &&
    participationMode !== null &&
    !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (name.trim().length < 2) toast.error('소모임 이름을 2자 이상 입력해주세요.')
      else if (!category) toast.error('카테고리를 선택해주세요.')
      else if (!participationMode) toast.error('참가 방식을 선택해주세요.')
      return
    }

    try {
      // 1. 커버 이미지 업로드 (선택)
      let coverImageUrl: string | null = null
      if (coverImages.length > 0) {
        const urls = await uploadCoverImages()
        coverImageUrl = urls[0] ?? null
      }

      // 2. 소모임 생성
      const created = await createClub({
        name: name.trim(),
        description: description.trim(),
        category: category!,
        anonymity: participationMode!,
        cover_image_url: coverImageUrl,
      })

      // 3. 소모임 가입 (방장 가입)
      // participationMode가 'PRIVATE'이면 익명, 그 외(PUBLIC, BOTH)는 실명으로 기본 가입 처리
      const isAnonymous = participationMode === 'PRIVATE';

      await joinClub({
        clubId: created.id,
        profile: {
          is_anonymous: isAnonymous,
          nickname: isAnonymous ? `${myProfile?.name || '방장'}` : '방장',
          avatar_url: myProfile?.avatar_url || null,
        }
      })

      // 4. 채팅방 입장
      try {
        await joinClubChat(created.id)
        toast.show(TOAST_MESSAGES.GROUP.CREATE_SUCCESS)
      } catch (chatErr) {
        console.error('Chat join error:', chatErr)
      }

      router.replace(`${ROUTES.COMMUNITY.GROUP.DETAIL}/${created.id}`)

    } catch (err) {
      console.error('Creation/Join error:', err)
      toast.error('소모임 만들기에 실패했어요.')
    }
  }

  // 헤더 버튼 핸들러 연결
  const handleSubmitRef = useRef<() => Promise<void>>(handleSubmit)
  handleSubmitRef.current = handleSubmit

  useEffect(() => {
    setHandlers({ onClick: () => handleSubmitRef.current?.() })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  const handleCoverClick = () => {
    if (coverFile) {
      handleRemoveCover(0)
      openCoverPicker()
    } else {
      openCoverPicker()
    }
  }

  return (
    <main className="mx-auto max-w-[480px] px-5 pt-6 pb-20">
      {/* 커버 이미지 섹션 (useImageUpload 훅 사용, 제출 시 uploadImages()로 업로드) */}
      <section className="mb-10">
        <p className="title-16 text-grey-11">
          커버 이미지 <span className="body-6 text-grey-8">(선택)</span>
        </p>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverSelect}
          className="hidden"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={handleCoverClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCoverClick()
            }
          }}
          className={cn(
            'flex w-full aspect-2/1 items-center justify-center overflow-hidden rounded-[16px] bg-grey-1-1 mt-4 cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
          )}
        >
          {coverFile ? (
            <div className="relative h-full w-full group">
              <img
                src={coverFile.preview}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <span className="text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  변경
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveCover(0)
                }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Icon name="IconLLineClose" />
              </button>
            </div>
          ) : (
            <span className="body-7 text-grey-8 flex items-center gap-2">
              이미지 추가
            </span>
          )}
        </div>
      </section>

      {/* 이름 섹션 */}
      <section className="mb-10">
        <label htmlFor="group-name" className="mb-3 block title-16 text-grey-11">
          소모임 이름
        </label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="소모임 이름을 입력하세요"
          maxLength={MAX_NAME_LENGTH}
          className={cn(
            'w-full rounded-[16px] bg-white px-4 py-2.5 body-8 text-grey-11 placeholder:body-7 placeholder:text-grey-7',
            'focus:outline-none focus:ring-1 focus:ring-primary-light border border-grey-2'
          )}
        />
        <p className="font-caption-caption4 text-grey-8 text-right mt-1">
          {name.length} / {MAX_NAME_LENGTH}
        </p>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mb-8">
        <p className="mb-3 title-16 text-grey-11">카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                'rounded-full px-3 py-2 font-caption-caption4 transition-colors',
                category === value
                  ? 'bg-primary-light text-white'
                  : 'bg-grey-2 text-grey-10 hover:bg-grey-3'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 참가 방식 섹션 */}
      <section className="mb-8">
        <p className="mb-3 title-16 text-grey-11">참가 방식</p>
        <div className="flex flex-wrap gap-2">
          {PARTICIPATION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setParticipationMode(value)}
              className={cn(
                'rounded-full px-3 py-2 font-caption-caption4 transition-colors',
                participationMode === value
                  ? 'bg-primary-light text-white'
                  : 'bg-grey-2 text-grey-10 hover:bg-grey-3'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="mb-6">
        <label htmlFor="group-desc" className="mb-3 title-16 text-grey-11">
          소개
        </label>
        <textarea
          id="group-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
          placeholder="소모임을 소개해 주세요. (선택)"
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={5}
          className={cn(
            'w-full rounded-[16px] bg-white px-4 py-2.5 body-8 text-grey-11 placeholder:body-7 placeholder:text-grey-7',
            'focus:outline-none focus:ring-1 focus:ring-primary-light mt-2 border border-grey-2'
          )}
        />
        <p className="font-caption-caption4 text-grey-8 text-right">
          {description.length} / {MAX_DESCRIPTION_LENGTH}
        </p>
      </section>
    </main>
  )
}