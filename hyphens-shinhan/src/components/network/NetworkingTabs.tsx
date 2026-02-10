'use client'

import PillTabs from '@/components/common/PillTabs'

export type NetworkTab = 'networking' | 'mentors' | 'friends'

const NETWORK_TABS: { value: NetworkTab; label: string }[] = [
  { value: 'networking', label: '네트워킹' },
  { value: 'mentors', label: '멘토' },
  { value: 'friends', label: '내 친구' },
]

interface NetworkingTabsProps {
  activeTab: NetworkTab
  onTabChange: (tab: NetworkTab) => void
}

export default function NetworkingTabs({
  activeTab,
  onTabChange,
}: NetworkingTabsProps) {
  const activeIndex = NETWORK_TABS.findIndex((t) => t.value === activeTab)

  return (
    <>
      <PillTabs
        tabs={NETWORK_TABS.map((t) => t.label)}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onChange={(index) => onTabChange(NETWORK_TABS[index].value)}
      />
    </>
  )
}
