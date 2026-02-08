'use client'

function parseReason(
  reason: string
): { label: string; value: string } | null {
  const colonIndex = reason.indexOf(': ')
  if (colonIndex === -1) return null
  return {
    label: reason.slice(0, colonIndex).trim(),
    value: reason.slice(colonIndex + 2).trim(),
  }
}

const SHORT_LABELS: Record<string, string> = {
  '완벽한 분야 매칭': '분야',
  '보조 분야 매칭': '분야',
  '전문성 수준 일치': '전문성',
  '목표 기간 일치': '기간',
  '가능한 시간 일치': '시간',
  '부분적인 시간 일치': '시간',
  '선호하는 만남 방식 일치': '방식',
  '커뮤니케이션 스타일 일치': '소통',
  '작업 속도 일치': '속도',
  '멘토링 스타일 일치': '스타일',
  '같은 대학교': '대학',
  '같은 전공': '전공',
  '같은 기수': '기수',
}

function getShortLabel(fullLabel: string): string {
  return SHORT_LABELS[fullLabel] ?? fullLabel
}

interface MatchReasonsProps {
  reasons: string[]
}

export default function MatchReasons({ reasons }: MatchReasonsProps) {
  if (reasons.length === 0) return null

  const items = reasons
    .slice(0, 4)
    .map(parseReason)
    .filter((r): r is { label: string; value: string } => r !== null)

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-grey-2 text-[12px] text-grey-8 leading-tight"
        >
          <span className="text-grey-7 shrink-0">
            {getShortLabel(item.label)}
          </span>
          <span className="font-medium truncate max-w-[140px] sm:max-w-[180px]">
            {item.value}
          </span>
        </span>
      ))}
    </div>
  )
}
