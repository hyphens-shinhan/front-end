'use client'

import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function parseYYYYMMDD(value: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return null
  return { year: y, month: m, day: d }
}

function toYYYYMMDD(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getCalendarGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month - 1, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const rows: (Date | null)[][] = []
  let row: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) row.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(new Date(year, month - 1, d))
    if (row.length === 7) {
      rows.push(row)
      row = []
    }
  }
  if (row.length) {
    while (row.length < 7) row.push(null)
    rows.push(row)
  }
  return rows
}

interface DatePickerProps {
  /** Current value (YYYY-MM-DD). Empty string = no selection. */
  value: string
  /** Called when user selects a date (YYYY-MM-DD). */
  onChange: (value: string) => void
  className?: string
}

/**
 * Inline calendar date picker matching the page design system.
 * Same structure as other form blocks: rounded-[16px], border-grey-2, body-5/body-6.
 */
export default function DatePicker({ value, onChange, className }: DatePickerProps) {
  const parsed = useMemo(() => parseYYYYMMDD(value), [value])
  const [[y, m], setView] = useState<[number, number]>(() => {
    if (parsed) return [parsed.year, parsed.month]
    const now = new Date()
    return [now.getFullYear(), now.getMonth() + 1]
  })

  useEffect(() => {
    if (parsed) setView([parsed.year, parsed.month])
  }, [parsed?.year, parsed?.month])
  const grid = useMemo(() => getCalendarGrid(y, m), [y, m])
  const selectedParsed = parsed

  const goPrev = () => {
    if (m === 1) setView([y - 1, 12])
    else setView([y, m - 1])
  }
  const goNext = () => {
    if (m === 12) setView([y + 1, 1])
    else setView([y, m + 1])
  }

  const handleDayClick = (date: Date) => {
    onChange(toYYYYMMDD(date.getFullYear(), date.getMonth() + 1, date.getDate()))
  }

  const isSelected = (date: Date) =>
    selectedParsed &&
    selectedParsed.year === date.getFullYear() &&
    selectedParsed.month === date.getMonth() + 1 &&
    selectedParsed.day === date.getDate()

  return (
    <div
      className={cn(
        'rounded-[16px] border border-grey-2 bg-white px-4 py-4',
        'flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="p-2 -m-2 rounded-lg text-grey-7 hover:bg-grey-1 active:opacity-80 transition-opacity touch-manipulation"
          aria-label="이전 달"
        >
          <Icon name="IconLLineArrowCircleLeft" size={24} />
        </button>
        <span className="body-5 text-grey-10">
          {y}년 {m}월
        </span>
        <button
          type="button"
          onClick={goNext}
          className="p-2 -m-2 rounded-lg text-grey-7 hover:bg-grey-1 active:opacity-80 transition-opacity touch-manipulation"
          aria-label="다음 달"
        >
          <Icon name="IconLLineArrowCircleRight" size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center py-1 font-caption-caption4 text-grey-8"
          >
            {label}
          </div>
        ))}
        {grid.flat().map((date, i) =>
          date ? (
            <button
              key={date.getTime()}
              type="button"
              onClick={() => handleDayClick(date)}
              className={cn(
                'aspect-square flex items-center justify-center rounded-lg body-6 text-grey-10',
                'hover:bg-grey-1 active:opacity-80 transition-colors touch-manipulation',
                isSelected(date) && 'bg-grey-3 font-semibold text-grey-11'
              )}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={`empty-${i}`} className="aspect-square" />
          )
        )}
      </div>
    </div>
  )
}
