'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { useHeaderStore } from '@/stores'
import { useCreateClub } from '@/hooks/clubs/useClubMutations'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import type { ClubCategory, ClubAnonymity } from '@/types/clubs'
import { cn } from '@/utils/cn'

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

/**
 * 소모임 만들기 폼 (hyphens-frontend community/groups/create와 동일 구조).
 * 커버 이미지(선택) → 소모임 이름 → 카테고리 → 참가 방식 → 소개(선택) → 헤더 "만들기"로 제출.
 */
export default function CreateGroup() {
  const router = useRouter()
  const { setHandlers, resetHandlers } = useHeaderStore()
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClubCategory | null>(null)
  const [participationMode, setParticipationMode] = useState<ClubAnonymity | null>(null)
  const [coverFile, setCoverFile] = useState<{ url: string; file: File } | null>(null)
  const [description, setDescription] = useState('')

  const { mutateAsync: createClub, isPending: isSubmitting } = useCreateClub()
  const toast = useToast()

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
      const created = await createClub({
        name: name.trim(),
        description: description.trim(),
        category: category!,
        anonymity: participationMode!,
      })
      toast.show(TOAST_MESSAGES.GROUP.CREATE_SUCCESS)
      router.replace(`${ROUTES.COMMUNITY.GROUP.DETAIL}/${created.id}`)
    } catch (err) {
      console.error(err)
      toast.error('소모임 만들기에 실패했어요.')
    }
  }

  const handleSubmitRef = useRef<() => Promise<void>>(handleSubmit)
  handleSubmitRef.current = handleSubmit

  useEffect(() => {
    setHandlers({ onClick: () => handleSubmitRef.current?.() })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  const handleCoverClick = () => coverInputRef.current?.click()

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    if (coverFile?.url) URL.revokeObjectURL(coverFile.url)
    setCoverFile({ url: URL.createObjectURL(file), file })
    e.target.value = ''
  }

  const removeCover = () => {
    if (coverFile?.url) URL.revokeObjectURL(coverFile.url)
    setCoverFile(null)
  }

  return (
    <main className="mx-auto max-w-[480px] px-5 pt-6 pb-20">
      {/* Cover (optional) */}
      <section className="mb-10">
        <p className="mb-3 text-[13px] font-medium tracking-tight text-grey-10">
          커버 이미지 <span className="font-normal text-grey-8">(선택)</span>
        </p>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleCoverClick}
          className={cn(
            'flex w-full aspect-2/1 items-center justify-center overflow-hidden rounded-2xl bg-grey-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
          )}
        >
          {coverFile ? (
            <div className="relative h-full w-full group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverFile.url}
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
                  removeCover()
                }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="커버 이미지 제거"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="text-[15px] tracking-tight text-grey-8">
              이미지 추가
            </span>
          )}
        </button>
      </section>

      {/* Name */}
      <section className="mb-10">
        <label
          htmlFor="group-name"
          className="mb-3 block text-[13px] font-medium tracking-tight text-grey-10"
        >
          소모임 이름
        </label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="이름을 입력하세요"
          maxLength={MAX_NAME_LENGTH}
          className={cn(
            'w-full rounded-2xl bg-white px-4 py-4 text-[17px] text-grey-11 placeholder:text-grey-7',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
          )}
        />
        <p className="mt-2 text-[13px] text-grey-8">
          {name.length} / {MAX_NAME_LENGTH}
        </p>
      </section>

      {/* Category */}
      <section className="mb-8">
        <p className="mb-3 text-[13px] font-medium tracking-tight text-grey-10">
          카테고리
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                'h-8 rounded-full px-3 text-[13px] font-medium transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
                category === value
                  ? 'bg-primary-shinhanblue text-white'
                  : 'bg-grey-2 text-grey-10 hover:bg-grey-3'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Participation mode */}
      <section className="mb-8">
        <p className="mb-3 text-[13px] font-medium tracking-tight text-grey-10">
          참가 방식
        </p>
        <div className="flex flex-wrap gap-2">
          {PARTICIPATION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setParticipationMode(value)}
              className={cn(
                'h-9 rounded-full px-4 text-[13px] font-medium transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
                participationMode === value
                  ? 'bg-primary-shinhanblue text-white'
                  : 'bg-grey-2 text-grey-10 hover:bg-grey-3'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="mb-6">
        <label
          htmlFor="group-desc"
          className="mb-3 block text-[13px] font-medium tracking-tight text-grey-10"
        >
          소개
        </label>
        <textarea
          id="group-desc"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))
          }
          placeholder="소모임을 소개해 주세요. (선택)"
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={5}
          className={cn(
            'w-full resize-none rounded-2xl bg-white px-4 py-4 text-[16px] leading-relaxed text-grey-11 placeholder:text-grey-7',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
          )}
        />
        <p className="mt-2 text-[13px] text-grey-8">
          {description.length} / {MAX_DESCRIPTION_LENGTH}
        </p>
      </section>
    </main>
  )
}
