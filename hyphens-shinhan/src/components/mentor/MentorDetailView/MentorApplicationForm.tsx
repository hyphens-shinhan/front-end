'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Mentor, DayOfWeek, MeetingFormat } from '@/types/mentor'
import { ROUTES } from '@/constants'
import { TOAST_MESSAGES } from '@/constants/toast'
import { useToast } from '@/hooks/useToast'
import { useCreateMentoringRequest } from '@/hooks/mentoring/useMentoring'
import { cn } from '@/utils/cn'
import BottomFixedButton from '@/components/common/BottomFixedButton'

const FORMAT_LABELS: Record<MeetingFormat, string> = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  in_person: '대면',
  phone_call: '전화',
  any: '무관',
}

function getTimeSlotsForDay(timeOfDay: string[]): string[] {
  const slots: string[] = []
  timeOfDay.forEach((t) => {
    if (t === 'morning') slots.push('09:00', '09:30', '10:00')
    else if (t === 'afternoon') slots.push('14:00', '14:30', '15:00')
    else if (t === 'evening') slots.push('19:00', '19:30', '20:00', '20:30')
    else if (t === 'late_night') slots.push('21:00', '21:30', '22:00')
    else if (t === 'flexible') slots.push('10:00', '14:00', '19:00')
  })
  return slots.length ? slots : ['19:00', '19:30', '20:00']
}

export interface MentorApplicationFormProps {
  mentor: Mentor
  /** Called when user taps 취소; default is router.back() */
  onCancel?: () => void
}

/**
 * Full-screen 멘토링 요청 폼: 날짜 → 시간 → 만남 방식 → 메시지(선택) → 요청 보내기 / 취소.
 * Used on /mentors/[id]/apply page.
 */
export function MentorApplicationForm({
  mentor,
  onCancel,
}: MentorApplicationFormProps) {
  const router = useRouter()
  const toast = useToast()
  const createRequest = useCreateMentoringRequest()

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedFormat, setSelectedFormat] = useState<MeetingFormat>(
    mentor.availability.preferredFormats[0] ?? 'zoom'
  )
  const [message, setMessage] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const dayMap: Record<number, DayOfWeek> = {
    0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
    4: 'thursday', 5: 'friday', 6: 'saturday',
  }

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = dayMap[date.getDay()]
    return dayOfWeek ? mentor.availability.days.includes(dayOfWeek) : false
  }

  const formatDateForSelection = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const isPastDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || !isDateAvailable(date)) return
    setSelectedDate(formatDateForSelection(date))
    setSelectedTime('')
  }

  const getTimeSlotsForSelectedDay = (): string[] => {
    if (!selectedDate) return []
    const date = new Date(selectedDate)
    const dayOfWeek = dayMap[date.getDay()]
    if (dayOfWeek && mentor.availability.days.includes(dayOfWeek)) {
      return getTimeSlotsForDay(mentor.availability.timeOfDay)
    }
    return []
  }

  const timeSlots = getTimeSlotsForSelectedDay()
  const getMonthName = (date: Date) =>
    date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + (dir === 'next' ? 1 : -1))
      return next
    })
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('날짜와 시간을 선택해주세요.')
      return
    }
    setIsSubmitting(true)
    try {
      await createRequest.mutateAsync({
        mentor_id: mentor.id,
        message: message.trim() || undefined,
      })
      toast.show(TOAST_MESSAGES.MENTOR.REQUEST_SUCCESS)
      router.push(ROUTES.MENTORS.HISTORY)
    } catch {
      toast.error(TOAST_MESSAGES.MENTOR.REQUEST_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedDate('')
    setSelectedTime('')
    setMessage('')
    if (onCancel) onCancel()
    else router.back()
  }

  const formats =
    mentor.availability.preferredFormats.length > 0
      ? mentor.availability.preferredFormats
      : (['zoom'] as MeetingFormat[])

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth)

  return (
    <div className={styles.root}>
      <p className={styles.title}>멘토링 요청</p>

      {/* 날짜 */}
      <div className={styles.section}>
        <p className={styles.labelSm}>날짜</p>
        <div className={styles.monthHeader}>
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className={styles.monthNavButton}
            aria-label="이전 달"
          >
            <span className={styles.monthNavIcon}>‹</span>
          </button>
          <span className={styles.monthLabel}>
            {getMonthName(currentMonth)}
          </span>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className={styles.monthNavButton}
            aria-label="다음 달"
          >
            <span className={styles.monthNavIcon}>›</span>
          </button>
        </div>
        <div className={styles.calendarGrid}>
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <div
              key={d}
              className={styles.weekday}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: startingDayOfWeek }, (_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month, i + 1)
            const available = isDateAvailable(date)
            const selected = selectedDate === formatDateForSelection(date)
            const past = isPastDate(date)
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={!available || past}
                className={cn(
                  styles.calendarDay,
                  selected && styles.calendarDaySelected,
                  available && !selected && !past && styles.calendarDayAvailable,
                  (!available || past) && styles.calendarDayDisabled,
                )}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* 시간 */}
      {selectedDate && (
        <div className={styles.section}>
          <p className={styles.labelSm}>시간</p>
          <div className={styles.timeGrid}>
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={cn(
                  styles.timeButton,
                  selectedTime === time
                    ? styles.timeButtonSelected
                    : styles.timeButtonUnselected,
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 만남 방식 */}
      <div className={styles.section}>
        <p className={styles.labelSm}>만남 방식</p>
        <div className={styles.formatsWrapper}>
          {formats.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setSelectedFormat(format)}
              className={cn(
                styles.formatButton,
                selectedFormat === format
                  ? styles.formatButtonSelected
                  : styles.formatButtonUnselected,
              )}
            >
              {FORMAT_LABELS[format]}
            </button>
          ))}
        </div>
      </div>

      {/* 메시지 (선택) */}
      <div className={styles.section}>
        <p className={styles.labelSm}>메시지 (선택)</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="인사말이나 질문을 남겨주세요"
          className={styles.messageTextarea}
          rows={3}
        />
      </div>

      {/* 버튼 */}
      <div className={styles.bottomSpacer} />
      <BottomFixedButton
        label={isSubmitting ? '전송 중...' : '요청 보내기'}
        size="L"
        type="primary"
        disabled={!selectedDate || !selectedTime || isSubmitting}
        onClick={handleSubmit}
        secondLabel="취소"
        secondType="secondary"
        secondDisabled={isSubmitting}
        onSecondClick={handleCancel}
      />
    </div>
  )
}

const styles = {
  root: 'flex flex-col',
  title: 'text-xs font-medium uppercase tracking-wider text-grey-8',
  section: 'mt-4',
  labelSm: 'mb-2 text-sm text-grey-8',

  monthHeader: 'mb-3 flex items-center justify-between',
  monthNavButton: 'p-2 -m-2 text-grey-10 hover:opacity-80',
  monthNavIcon: 'text-lg leading-none',
  monthLabel: 'text-sm font-medium text-grey-11',

  calendarGrid: 'grid grid-cols-7 gap-1',
  weekday: 'py-1.5 text-center text-xs text-grey-8',
  calendarDay: 'aspect-square rounded-lg text-[13px] font-medium',
  calendarDaySelected: 'bg-primary-shinhanblue text-white',
  calendarDayAvailable: 'bg-grey-2 text-grey-11',
  calendarDayDisabled: 'cursor-not-allowed opacity-40',

  timeGrid: 'grid grid-cols-3 gap-2 sm:grid-cols-4',
  timeButton: 'min-h-[44px] rounded-lg text-sm font-medium',
  timeButtonSelected: 'bg-primary-shinhanblue text-white',
  timeButtonUnselected: 'bg-grey-2 text-grey-11',

  formatsWrapper: 'flex flex-wrap gap-2',
  formatButton: 'min-h-[44px] rounded-lg px-4 text-sm font-medium',
  formatButtonSelected: 'bg-primary-shinhanblue text-white',
  formatButtonUnselected: 'bg-grey-2 text-grey-11',

  messageTextarea:
    'w-full min-h-[100px] resize-none rounded-lg border border-grey-2 bg-white px-4 py-3 text-sm text-grey-11 placeholder:text-grey-6 focus:border-primary-shinhanblue focus:outline-none focus:ring-1 focus:ring-primary-shinhanblue',

  bottomSpacer: 'mt-6 h-24',
} as const
