type DateInput = string | Date;

function toDate(value: DateInput): Date {
  return typeof value === 'string' ? new Date(value) : value;
}

/** 날짜만 표기 (예: 2024.12.15) */
export function formatDateYMD(date: DateInput): string {
  const d = toDate(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** 한국어 날짜 + 시간 (예: 12월 15일 14:30) */
export function formatDateKrWithTime(date: DateInput): string {
  const d = toDate(date);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 시간만 표기 (예: 14:00) */
export function formatTime(date: DateInput): string {
  const d = toDate(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 이벤트 시간 범위 (예: 2026.01.23 14:00~16:00) */
export function formatEventTimeRange(start: string, end: string): string {
  const startDate = toDate(start);
  const endDate = toDate(end);
  return `${formatDateYMD(startDate)} ${formatTime(startDate)}~${formatTime(endDate)}`;
}

/** 해당 날짜의 00:00:00 (로컬) - 날짜 비교용 */
export function startOfDay(date: DateInput): Date {
  const d = toDate(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
