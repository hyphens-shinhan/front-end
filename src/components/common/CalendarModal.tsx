'use client';

import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@/components/common/Icon';
import { cn } from '@/utils/cn';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function parseDateKey(str: string): Date | null {
  if (!str || str === 'YYYY.MM.DD') return null;
  const [y, m, d] = str.split('.').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Initial/current value YYYY.MM.DD */
  value?: string;
  onSelect: (dateString: string) => void;
  /** If true, render inline (no overlay popup) */
  inline?: boolean;
}

export default function CalendarModal({ isOpen, onClose, value = '', onSelect, inline = false }: CalendarModalProps) {
  const parsed = parseDateKey(value);
  const [viewDate, setViewDate] = useState(() => parsed ?? new Date());

  useEffect(() => {
    if (isOpen) {
      const p = parseDateKey(value);
      setViewDate(p ?? new Date());
    }
  }, [isOpen, value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendarDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const prevMonth = new Date(year, month, 0);
    const prevDays = prevMonth.getDate();
    const rows: (Date | null)[][] = [];
    let row: (Date | null)[] = [];

    for (let i = 0; i < startPad; i++) {
      row.push(new Date(year, month - 1, prevDays - startPad + i + 1));
    }
    for (let d = 1; d <= daysInMonth; d++) {
      row.push(new Date(year, month, d));
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length) {
      let next = 1;
      while (row.length < 7) row.push(new Date(year, month + 1, next++));
      rows.push(row);
    }
    return rows;
  }, [year, month]);

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (d: Date | null) => {
    if (!d) return;
    onSelect(formatDateKey(d));
    onClose();
  };

  const selectedKey = value && value !== 'YYYY.MM.DD' ? value : null;

  useEffect(() => {
    if (!inline && isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [inline, isOpen]);

  if (!isOpen) return null;

  const content = (
    <div
      className={inline ? 'w-full bg-white rounded-xl border border-grey-2 overflow-hidden' : 'w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in'}
      onClick={(e) => !inline && e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-grey-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 -m-2 rounded-full hover:bg-grey-1-1 text-grey-9"
          aria-label="이전 달"
        >
          <Icon name="IconLLineArrowLeft" size={24} />
        </button>
        <p className="title-16 text-grey-11">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 -m-2 rounded-full hover:bg-grey-1-1 text-grey-9"
          aria-label="다음 달"
        >
          <Icon name="IconLLineArrowRight" size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-grey-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className={cn(
              'py-2 text-center body-8',
              w === '일' ? 'text-state-red' : 'text-grey-8',
            )}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="p-2">
        {calendarDays.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-0.5">
            {row.map((d, di) => {
              if (!d) return <div key={di} />;
              const isCurrentMonth = d.getMonth() === month;
              const key = formatDateKey(d);
              const isSelected = selectedKey === key;
              const isToday = formatDateKey(new Date()) === key;
              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDayClick(d)}
                  className={cn(
                    'aspect-square rounded-full body-8 flex items-center justify-center',
                    !isCurrentMonth && 'text-grey-5',
                    isCurrentMonth && 'text-grey-11',
                    isSelected && 'bg-primary-shinhanblue text-white',
                    !isSelected && isCurrentMonth && 'hover:bg-grey-1-1',
                    isToday && !isSelected && 'ring-1 ring-primary-shinhanblue',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl body-8 text-grey-9 bg-grey-2"
        >
          취소
        </button>
      </div>
    </div>
  );

  if (inline) return content;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="날짜 선택"
      onClick={onClose}
    >
      {content}
    </div>
  );
}

export { formatDateKey, parseDateKey };
