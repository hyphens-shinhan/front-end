'use client'

import { useMemo, useState } from 'react'
import type { Person } from '@/types/network'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import MentorCard from './MentorCard'
import InputBar, { INPUT_BAR_TYPE } from '../common/InputBar'
import { useBottomSheetStore } from '@/stores'
import MentorFilterSheet, {
  type MentorFilters,
  type RegionFilterId,
  REGION_OPTIONS,
  DEFAULT_FILTERS,
} from './MentorFilterSheet'

const MENTOR_TYPE_LABELS: Record<string, string> = {
  ob: 'OB 선배',
  professional: '전문 멘토',
}

const REGION_LABEL_MAP = Object.fromEntries(
  REGION_OPTIONS.map((r) => [r.id, r.label]),
) as Record<RegionFilterId, string>

interface MentorsSectionProps {
  mentors: Person[]
  onFollowRequest?: (personId: string) => void
  onPersonClick?: (person: Person) => void
}

export default function MentorsSection({
  mentors,
  onFollowRequest,
  onPersonClick,
}: MentorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<MentorFilters>(DEFAULT_FILTERS)
  const { onOpen: openBottomSheet } = useBottomSheetStore()

  const handleOpenFilterSheet = () => {
    openBottomSheet({
      content: (
        <MentorFilterSheet
          initialFilters={filters}
          onChange={setFilters}
        />
      ),
    })
  }

  /** 필터 상태에서 현재 활성화된 칩 목록 생성 */
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []

    if (filters.fieldKeyword.trim()) {
      chips.push({
        key: `field-${filters.fieldKeyword}`,
        label: filters.fieldKeyword,
        onRemove: () =>
          setFilters((prev) => ({ ...prev, fieldKeyword: '' })),
      })
    }

    filters.mentorTypes.forEach((type) => {
      chips.push({
        key: `type-${type}`,
        label: MENTOR_TYPE_LABELS[type] ?? type,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            mentorTypes: prev.mentorTypes.filter((t) => t !== type),
          })),
      })
    })

    filters.regions.forEach((id) => {
      chips.push({
        key: `region-${id}`,
        label: REGION_LABEL_MAP[id] ?? id,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            regions: prev.regions.filter((r) => r !== id),
          })),
      })
    })

    return chips
  }, [filters])

  const filteredMentors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const fieldKeyword = filters.fieldKeyword.trim().toLowerCase()

    return mentors.filter((person) => {
      const baseText = [
        person.name,
        person.university,
        person.company,
        person.currentRole,
        ...(person.tags ?? []),
        ...(person.interests ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (q && !baseText.includes(q)) return false

      if (fieldKeyword) {
        const fieldTarget = [
          person.university,
          person.currentRole,
          person.company,
          ...(person.tags ?? []),
          ...(person.interests ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!fieldTarget.includes(fieldKeyword)) return false
      }

      if (filters.mentorTypes.length) {
        const role = person.mentorListRole
        const tags = person.tags ?? []

        const isOb =
          role === 'YB' ||
          tags.some((t) => t.includes('OB') || t.includes('Ob') || t.includes('ob'))

        const isProfessional =
          role === 'MENTOR' ||
          tags.some((t) => t.includes('멘토') || t.toLowerCase().includes('mentor'))

        const matchesType =
          (filters.mentorTypes.includes('ob') && isOb) ||
          (filters.mentorTypes.includes('professional') && isProfessional)

        if (!matchesType) return false
      }

      if (filters.regions.length) {
        const target = [
          person.location?.address,
          ...(person.tags ?? []),
          ...(person.interests ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const regionMatches = filters.regions.some((id) => {
          const keywords = REGION_KEYWORDS[id] ?? []
          return keywords.some((kw) => target.includes(kw))
        })

        if (!regionMatches) return false
      }

      return true
    })
  }, [mentors, searchQuery, filters])

  return (
    <div className={styles.container}>
      <InputBar
        type={INPUT_BAR_TYPE.MENTOR_SEARCH}
        value={searchQuery}
        onChange={setSearchQuery}
        className={styles.searchInput}
      />

      <div className={styles.chipsWrapper}>
        {activeChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={styles.chipActive}
            onClick={chip.onRemove}
          >
            {chip.label}
            <Icon name="IconMBoldCloseCircle" size={16} className={styles.chipRemoveIcon} />
          </button>
        ))}
        <button
          type="button"
          className={cn(styles.sortButton, activeChips.length && styles.sortButtonActive)}
          aria-label="필터"
          onClick={handleOpenFilterSheet}
        >
          <Icon name="IconLLineSort" size={24} />
        </button>
      </div>

      <section className={styles.mentorList}>
        {filteredMentors.map((person) => (
          <MentorCard
            key={person.id}
            person={person}
            onFollowRequest={onFollowRequest}
            onClick={() => onPersonClick?.(person)}
          />
        ))}
      </section>
    </div>
  )
}

const styles = {
  container: cn('pt-2 pb-6 flex flex-col gap-2'),
  searchInput: cn('px-3'),
  chipsWrapper: cn('flex items-center gap-2 flex-wrap py-1'),
  chipActive: cn(
    'inline-flex items-center gap-1 pl-3 pr-2.5 py-2 rounded-[16px]',
    'font-caption-caption4 bg-primary-shinhanblue/10 text-primary-shinhanblue',
  ),
  chipRemoveIcon: cn('text-primary-light'),
  sortButton: cn('ml-auto text-grey-9 py-1'),
  sortButtonActive: cn('text-primary-light'),
  mentorList: cn('flex flex-col gap-5 px-3'),
}

const REGION_KEYWORDS: Record<RegionFilterId, string[]> = {
  seoul: ['서울'],
  gyeonggi_incheon: ['경기', '인천'],
  gangwon: ['강원'],
  jeonbuk: ['전북', '전주'],
  gwangju_jeonnam: ['광주', '전남'],
  daegu_gyeongbuk: ['대구', '경북'],
  busan_gyeongnam_ulsan: ['부산', '경남', '울산'],
  daejeon_sejong_chungcheong: ['대전', '세종', '충청'],
  jeju: ['제주'],
  overseas: ['해외'],
}
