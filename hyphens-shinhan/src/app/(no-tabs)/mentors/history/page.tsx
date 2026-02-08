'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorRequestItem } from '@/types/mentor'
import { getMentorByIdSync, getMajorLabel } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

const FALLBACK_AVATARS = ['/assets/images/male1.png', '/assets/images/woman1.png']

function getFallbackAvatar(id: string): string {
  const index =
    id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    FALLBACK_AVATARS.length
  return FALLBACK_AVATARS[index]
}

function formatRequestDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  } catch {
    return dateStr
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '대기 중',
    accepted: '수락됨',
    declined: '거절됨',
    completed: '완료됨',
  }
  return labels[status] || status
}

/** Mock 나의 멘토링 내역 (요청 목록) */
const MOCK_REQUESTS: MentorRequestItem[] = [
  {
    id: 'req_1',
    mentorId: 'mentor_1',
    date: '2026-01-22',
    time: '09:30',
    format: 'Zoom',
    message: '안녕하세요, 멘토링을 받고 싶습니다.',
    status: 'pending',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'req_2',
    mentorId: 'mentor_3',
    date: '2026-01-25',
    time: '19:00',
    format: '대면',
    status: 'accepted',
    createdAt: '2026-01-10T14:00:00Z',
  },
]

export default function MentoringHistoryPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<MentorRequestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const withMentors = MOCK_REQUESTS.map((req) => {
      const mentor = getMentorByIdSync(req.mentorId)
      return { ...req, mentor: mentor ?? undefined }
    }).filter((r) => r.mentor)
    setRequests(withMentors)
    setLoading(false)
  }, [])

  const handleViewMentor = (mentorId: string) => {
    router.push(`${ROUTES.MENTORS.DETAIL_PREFIX}${mentorId}`)
  }

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-10">
        <p className="text-sm text-grey-7">로딩 중...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-12">
        <p className="text-sm text-grey-7 mb-6">아직 보낸 멘토링 요청이 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
          className={cn(
            'min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg',
            'hover:opacity-90 transition-opacity'
          )}
        >
          멘토 찾기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 pt-6 pb-20">
      <h1 className="text-[20px] font-semibold text-grey-11 tracking-[-0.02em] mb-2">
        보낸 요청
      </h1>
      <p className="text-sm text-grey-7 mb-8">{requests.length}건</p>

      <div className="divide-y divide-grey-2">
        {requests.map((request) => {
          if (!request.mentor) return null
          const mentor = request.mentor
          const meta = [
            mentor.university,
            mentor.major && getMajorLabel(mentor.major),
          ].filter(Boolean).join(' · ')
          const avatarSrc = mentor.avatar || getFallbackAvatar(mentor.id)

          return (
            <article key={request.id} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-grey-3 shrink-0 overflow-hidden">
                  <img
                    src={avatarSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[16px] font-semibold text-grey-11 tracking-[-0.02em]">
                      {mentor.name}
                    </h2>
                    <span className="text-[12px] text-grey-7">
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  {meta && (
                    <p className="text-[13px] text-grey-7 truncate">{meta}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-grey-2 text-[12px] text-grey-8 border border-grey-2">
                  <span className="text-grey-7">날짜</span>
                  <span>{formatRequestDate(request.date)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-grey-2 text-[12px] text-grey-8 border border-grey-2">
                  <span className="text-grey-7">시간</span>
                  <span>{request.time}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-grey-2 text-[12px] text-grey-8 border border-grey-2">
                  <span className="text-grey-7">방식</span>
                  <span>{request.format}</span>
                </span>
              </div>

              {request.message && (
                <p className="text-[13px] text-grey-7 mb-4 leading-snug">
                  {request.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleViewMentor(request.mentorId)}
                className={cn(
                  'w-full min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg',
                  'hover:opacity-90 transition-opacity'
                )}
              >
                프로필 보기
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
