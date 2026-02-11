'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/common/Icon'

// ── 상수 & 타입 (MentorsSection에서도 import) ──

export const REGION_OPTIONS = [
  { id: 'seoul', label: '서울' },
  { id: 'gyeonggi_incheon', label: '경기/인천' },
  { id: 'gangwon', label: '강원' },
  { id: 'jeonbuk', label: '전주/전북' },
  { id: 'gwangju_jeonnam', label: '광주/전남' },
  { id: 'daegu_gyeongbuk', label: '대구/경북' },
  { id: 'busan_gyeongnam_ulsan', label: '부산/경남/울산' },
  { id: 'daejeon_sejong_chungcheong', label: '대전/세종/충청' },
  { id: 'jeju', label: '제주' },
  { id: 'overseas', label: '해외' },
] as const

export type MentorTypeFilter = 'ob' | 'professional'
export type RegionFilterId = (typeof REGION_OPTIONS)[number]['id']

export interface MentorFilters {
  /** 전공/분야 키워드 */
  fieldKeyword: string
  /** 멘토 유형 필터 (OB 선배 / 전문 멘토) */
  mentorTypes: MentorTypeFilter[]
  /** 지역 필터 */
  regions: RegionFilterId[]
}

export const DEFAULT_FILTERS: MentorFilters = {
  fieldKeyword: '',
  mentorTypes: [],
  regions: [],
}

// ── 컴포넌트 ──

interface MentorFilterSheetProps {
  /** 시트가 열릴 때 초기값 */
  initialFilters: MentorFilters
  /** 필터가 변경될 때마다 부모에 동기화 */
  onChange: (next: MentorFilters) => void
}

/**
 * 멘토 필터 바텀시트 컨텐츠
 *
 * 자체 로컬 상태를 가지고 있어서 BottomModal 안에서도
 * 선택 UI가 즉시 반영됩니다.
 */
export default function MentorFilterSheet({
  initialFilters,
  onChange,
}: MentorFilterSheetProps) {
  // 로컬 상태 — 바텀시트 내부에서 즉시 반영
  const [local, setLocal] = useState<MentorFilters>(initialFilters)

  // 로컬 상태가 바뀔 때마다 부모에 동기화
  useEffect(() => {
    onChange(local)
  }, [local, onChange])

  const toggleMentorType = (type: MentorTypeFilter) => {
    setLocal((prev) => {
      const isSelected = prev.mentorTypes.includes(type)
      return {
        ...prev,
        mentorTypes: isSelected
          ? prev.mentorTypes.filter((t) => t !== type)
          : [...prev.mentorTypes, type],
      }
    })
  }

  const toggleRegion = (id: RegionFilterId) => {
    setLocal((prev) => {
      const isSelected = prev.regions.includes(id)
      return {
        ...prev,
        regions: isSelected
          ? prev.regions.filter((r) => r !== id)
          : [...prev.regions, id],
      }
    })
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <p className={styles.sectionLabel}>전공/분야</p>
        <input
          type="text"
          value={local.fieldKeyword}
          onChange={(e) =>
            setLocal((prev) => ({ ...prev, fieldKeyword: e.target.value }))
          }
          placeholder="관심 분야나 전공을 입력해주세요"
          className={styles.fieldInput}
        />
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>멘토 유형</p>
        <div>
          <FilterCheckRow
            label="OB 선배"
            selected={local.mentorTypes.includes('ob')}
            onToggle={() => toggleMentorType('ob')}
          />
          <FilterCheckRow
            label="전문 멘토"
            selected={local.mentorTypes.includes('professional')}
            onToggle={() => toggleMentorType('professional')}
          />
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>지역</p>
        <div className={styles.regionGrid}>
          {REGION_OPTIONS.map((region) => {
            const selected = local.regions.includes(region.id)
            return (
              <button
                key={region.id}
                type="button"
                className={cn(
                  styles.regionChip,
                  selected && styles.regionChipSelected,
                )}
                onClick={() => toggleRegion(region.id)}
              >
                {region.label}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/** 라벨 왼쪽 · 체크 아이콘 오른쪽 (justify-between) 행 */
function FilterCheckRow({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={styles.checkRow}
      onClick={onToggle}
    >
      <span className={cn(styles.checkLabel, selected && styles.checkLabelSelected)}>
        {label}
      </span>
      <Icon
        name="IconLBoldTickCircle"
        className={selected ? styles.checkIconSelected : styles.checkIcon}
      />
    </button>
  )
}

const styles = {
  container: cn('flex flex-col gap-4 pb-2 max-h-[50vh] overflow-y-auto scrollbar-hide'),
  section: cn('flex flex-col gap-2'),
  sectionLabel: cn('body-7 text-grey-8'),
  checkRow: cn('flex items-center justify-between w-full py-2'),
  checkLabel: cn('body-5 text-grey-9'),
  checkLabelSelected: cn('text-grey-11'),
  checkIcon: cn('text-grey-4'),
  checkIconSelected: cn('text-primary-shinhanblue'),
  fieldInput: cn(
    'w-full rounded-2xl border border-grey-2 bg-white px-4 py-3',
    'body-5 text-grey-10 placeholder:text-grey-7',
    'focus:outline-none focus:border-primary-light',
  ),
  regionGrid: cn('grid grid-cols-2 gap-2'),
  regionChip: cn(
    'inline-flex items-center justify-center px-4 py-3 rounded-[16px]',
    'border border-grey-2 bg-white',
    'body-7 text-grey-9',
  ),
  regionChipSelected: cn(
    'border-primary-shinhanblue bg-primary-shinhanblue/5 text-primary-shinhanblue',
  ),
}
