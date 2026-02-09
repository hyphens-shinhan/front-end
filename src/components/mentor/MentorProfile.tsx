'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Mentor, MeetingFormat, DayOfWeek } from '@/types/mentor'
import { getMajorLabel } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

const CATEGORY_LABELS: Record<string, string> = {
  career_job_search: '커리어 및 취업',
  academic_excellence: '학업 우수성',
  leadership_soft_skills: '리더십 및 소프트 스킬',
  entrepreneurship_innovation: '창업 및 혁신',
  mental_health_wellness: '정신 건강 및 웰빙',
  financial_management: '재무 관리',
  personal_development: '자기계발',
  volunteer_community_service: '봉사 및 지역사회',
  specific_major_field: '전공 분야',
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

const FORMAT_LABELS: Record<MeetingFormat, string> = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  in_person: '대면',
  phone_call: '전화',
  any: '상관없음',
}

interface MentorProfileProps {
  mentor: Mentor
  matchScore?: number
  onRequestMentorship?: () => void
  onMessage?: () => void
}

export default function MentorProfile({
  mentor,
  matchScore,
  onRequestMentorship,
  onMessage,
}: MentorProfileProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const availableFormats = mentor.availability.preferredFormats.filter(
    (f) => f !== 'google_meet'
  )
  const [selectedFormat, setSelectedFormat] = useState<MeetingFormat>(
    availableFormats[0] ?? 'zoom'
  )
  const [message, setMessage] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function generateTimeSlotsByDay(_day: DayOfWeek): string[] {
    const set = new Set<string>()
    mentor.availability.timeOfDay.forEach((time) => {
      if (time === 'morning') {
        ['09:00', '09:30', '10:00'].forEach((t) => set.add(t))
      } else if (time === 'afternoon') {
        ['14:00', '14:30', '15:00'].forEach((t) => set.add(t))
      } else if (time === 'evening') {
        ['19:00', '19:30', '20:00', '20:30'].forEach((t) => set.add(t))
      } else if (time === 'late_night') {
        ['21:00', '21:30', '22:00'].forEach((t) => set.add(t))
      } else if (time === 'flexible') {
        ['10:00', '14:00', '19:00'].forEach((t) => set.add(t))
      }
    })
    return Array.from(set).sort()
  }

  function getTimeSlotsForSelectedDay(): string[] {
    if (!selectedDate) return []
    const date = new Date(selectedDate)
    const dayIndex = date.getDay()
    const dayMap: Record<number, DayOfWeek> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    }
    const dayOfWeek = dayMap[dayIndex]
    if (dayOfWeek && mentor.availability.days.includes(dayOfWeek)) {
      return generateTimeSlotsByDay(dayOfWeek)
    }
    return []
  }

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  function isDateAvailable(date: Date): boolean {
    const dayIndex = date.getDay()
    const dayMap: Record<number, DayOfWeek> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    }
    const dayOfWeek = dayMap[dayIndex]
    return dayOfWeek ? mentor.availability.days.includes(dayOfWeek) : false
  }

  function formatDateForSelection(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  function isDateSelected(date: Date) {
    return selectedDate === formatDateForSelection(date)
  }

  function isPastDate(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  function handleDateClick(date: Date) {
    if (isPastDate(date) || !isDateAvailable(date)) return
    setSelectedDate(formatDateForSelection(date))
    setSelectedTime('')
  }

  function getMonthName(date: Date) {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  }

  function navigateMonth(dir: 'prev' | 'next') {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + (dir === 'next' ? 1 : -1))
      return next
    })
  }

  const handleRequestClick = () => setShowRequestForm((v) => !v)

  async function handleSubmitRequest() {
    if (!selectedDate || !selectedTime) {
      setSubmitError('날짜와 시간을 선택해주세요.')
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Mock submit: in a real app would call API or Supabase
      await new Promise((r) => setTimeout(r, 600))
      setRequestSubmitted(true)
      setShowRequestForm(false)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : '요청 생성 중 오류가 발생했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const avatarSrc =
    mentor.avatar && !imageError
      ? mentor.avatar
      : '/assets/images/male1.png'
  const metaParts = [
    mentor.university,
    mentor.major && getMajorLabel(mentor.major),
    mentor.cohortYear,
  ].filter(Boolean)

  const availDays = mentor.availability.days
    .map((d) => {
      const dayMap: Record<string, string> = {
        monday: '월',
        tuesday: '화',
        wednesday: '수',
        thursday: '목',
        friday: '금',
        saturday: '토',
        sunday: '일',
      }
      return dayMap[d] ?? d
    })
    .join(', ')

  const availTimes = mentor.availability.timeOfDay
    .map((t) => {
      const timeMap: Record<string, string> = {
        morning: '오전',
        afternoon: '오후',
        evening: '저녁',
        late_night: '밤',
        flexible: '유연',
      }
      return timeMap[t] ?? t
    })
    .join(', ')

  const formatsLine = mentor.availability.preferredFormats
    .filter((f) => f !== 'google_meet')
    .map((f) => FORMAT_LABELS[f])
    .join(', ')

  const handleMessage = () => {
    if (onMessage) {
      onMessage()
    } else {
      router.push(`${ROUTES.CHAT_DETAIL_PREFIX}${mentor.id}`)
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full bg-grey-2 overflow-hidden">
              <img
                src={avatarSrc}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-semibold text-grey-11 tracking-tight leading-tight">
              {mentor.name}
            </h1>
            <p className="mt-1 text-[15px] text-grey-8">
              {mentor.type === 'professional' ? '전문 멘토' : '선배 멘토'}
              {metaParts.length > 0 && ` · ${metaParts.join(' · ')}`}
            </p>
            {(mentor.currentRole || mentor.company) && (
              <p className="mt-0.5 text-sm text-grey-7">
                {mentor.currentRole}
                {mentor.company ? ` · ${mentor.company}` : ''}
              </p>
            )}
            {matchScore !== undefined && (
              <div className="mt-5 flex items-center gap-3">
                <span className="text-[15px] font-semibold text-grey-11 tabular-nums">
                  {matchScore}
                </span>
                <div className="flex-1 min-w-0 h-1 bg-grey-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-shinhanblue rounded-full"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {!requestSubmitted && (
                <button
                  type="button"
                  onClick={onRequestMentorship ?? handleRequestClick}
                  className="min-h-[48px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  멘토링 요청
                </button>
              )}
              <button
                type="button"
                onClick={handleMessage}
                className="min-h-[48px] min-w-[48px] rounded-lg flex items-center justify-center border border-grey-4 text-grey-8 hover:bg-grey-2 transition-colors"
                aria-label="메시지"
              >
                <span className="text-sm font-medium">메시지</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request form */}
      {showRequestForm && (
        <section className="pt-8">
          <p className="text-[11px] font-semibold text-grey-7 uppercase tracking-wider mb-6">
            멘토링 요청
          </p>
          <div className="space-y-6">
            <div>
              <p className="text-[13px] text-grey-7 mb-3">날짜</p>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="p-2 -m-2 text-grey-8 hover:opacity-70"
                  aria-label="이전 달"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-[15px] font-semibold text-grey-11">
                  {getMonthName(currentMonth)}
                </span>
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="p-2 -m-2 text-grey-8 hover:opacity-70"
                  aria-label="다음 달"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                  <div
                    key={d}
                    className="text-center text-[11px] text-grey-7 py-2"
                  >
                    {d}
                  </div>
                ))}
                {(() => {
                  const {
                    daysInMonth,
                    startingDayOfWeek,
                    year,
                    month,
                  } = getDaysInMonth(currentMonth)
                  const out: React.ReactNode[] = []
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    out.push(<div key={`e-${i}`} />)
                  }
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day)
                    const available = isDateAvailable(date)
                    const selected = isDateSelected(date)
                    const past = isPastDate(date)
                    out.push(
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateClick(date)}
                        disabled={!available || past}
                        className={cn(
                          'aspect-square rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-40',
                          selected
                            ? 'bg-primary-shinhanblue text-white'
                            : available
                              ? 'bg-grey-2 text-grey-11 hover:bg-grey-3'
                              : 'text-grey-5'
                        )}
                      >
                        {day}
                      </button>
                    )
                  }
                  return out
                })()}
              </div>
            </div>
            {selectedDate && (
              <div>
                <p className="text-[13px] text-grey-7 mb-3">시간</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {getTimeSlotsForSelectedDay().map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'min-h-[44px] rounded-lg text-sm font-semibold transition-colors',
                        selectedTime === time
                          ? 'bg-primary-shinhanblue text-white'
                          : 'bg-grey-2 text-grey-11 hover:bg-grey-3'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[13px] text-grey-7 mb-3">만남 방식</p>
              <div className="flex flex-wrap gap-2">
                {availableFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setSelectedFormat(format)}
                    className={cn(
                      'min-h-[44px] px-4 rounded-lg text-sm font-semibold transition-colors',
                      selectedFormat === format
                        ? 'bg-primary-shinhanblue text-white'
                        : 'bg-grey-2 text-grey-11 hover:bg-grey-3'
                    )}
                  >
                    {FORMAT_LABELS[format]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-grey-7 mb-2">메시지 (선택)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="인사말이나 질문을 남겨주세요"
                className="w-full min-h-[100px] px-4 py-3 rounded-lg bg-grey-2 text-grey-11 placeholder:text-grey-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue focus:ring-offset-0 resize-none border border-transparent"
                rows={4}
              />
            </div>
            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="w-full min-h-[52px] rounded-lg bg-primary-shinhanblue text-white text-[15px] font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                {isSubmitting ? '전송 중...' : '요청 보내기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRequestForm(false)
                  setSelectedDate('')
                  setSelectedTime('')
                  setMessage('')
                  setSubmitError(null)
                }}
                disabled={isSubmitting}
                className="py-3 text-sm font-semibold text-grey-7 hover:opacity-80 disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Success confirmation */}
      {requestSubmitted && (
        <section className="pt-8">
          <h2 className="text-[18px] font-semibold text-grey-11 tracking-tight mb-2">
            멘토링 요청이 전송되었습니다
          </h2>
          <p className="text-sm text-grey-8 leading-relaxed mb-6">
            {mentor.name} 멘토님께 요청을 보냈습니다. 응답을 기다려주세요.
          </p>
          {selectedDate && selectedTime && (
            <div className="space-y-1 mb-6 text-sm text-grey-8">
              <p>
                날짜:{' '}
                {new Date(selectedDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
              <p>
                시간: {selectedTime} · {FORMAT_LABELS[selectedFormat]}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => router.push(ROUTES.MENTORS.HISTORY)}
            className="w-full min-h-[52px] rounded-lg bg-primary-shinhanblue text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
          >
            나의 멘토링 내역 보기
          </button>
        </section>
      )}

      {mentor.bio && (
        <section>
          <p className="text-[11px] font-semibold text-grey-7 uppercase tracking-wider mb-3">
            소개
          </p>
          <p className="text-[15px] text-grey-8 leading-relaxed">{mentor.bio}</p>
        </section>
      )}

      <section>
        <p className="text-[11px] font-semibold text-grey-7 uppercase tracking-wider mb-3">
          전문 분야
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-2 rounded-lg bg-grey-2 text-[13px] font-medium text-grey-8">
            {getCategoryLabel(mentor.primaryCategory)}
          </span>
          {mentor.secondaryCategories?.map((cat) => (
            <span
              key={cat}
              className="px-3 py-2 rounded-lg bg-grey-2 text-[13px] text-grey-7"
            >
              {getCategoryLabel(cat)}
            </span>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[11px] font-semibold text-grey-7 uppercase tracking-wider mb-3">
          가능 시간
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-grey-7 mb-1">요일</p>
            <p className="text-[15px] font-medium text-grey-11">{availDays}</p>
          </div>
          <div>
            <p className="text-[11px] text-grey-7 mb-1">시간대</p>
            <p className="text-[15px] font-medium text-grey-11">{availTimes}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-grey-7 mb-1">주당</p>
              <p className="text-[15px] font-medium text-grey-11">
                {mentor.availability.hoursPerWeek}시간
              </p>
            </div>
            <div>
              <p className="text-[11px] text-grey-7 mb-1">방식</p>
              <p className="text-[15px] font-medium text-grey-11">
                {formatsLine}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
