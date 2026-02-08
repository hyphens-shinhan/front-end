'use client'

import { cn } from '@/utils/cn'

export type NetworkTab = 'networking' | 'mentors' | 'friends'

interface NetworkingTabsProps {
  activeTab: NetworkTab
  onTabChange: (tab: NetworkTab) => void
}

export default function NetworkingTabs({
  activeTab,
  onTabChange,
}: NetworkingTabsProps) {
  const tabClass =
    'w-[100px] px-6 py-2.5 rounded-full font-medium text-sm leading-[22px] transition-colors'
  const activeClass = 'bg-[#E0E3ED] text-black'
  const inactiveClass = 'bg-transparent text-[#CBD0DD]'

  return (
    <div className="flex items-center justify-start gap-[10px] px-4 mt-[15px] mb-[15px] h-[50px] pt-px pb-[10px]">
      <button
        type="button"
        onClick={() => onTabChange('networking')}
        className={cn(tabClass, activeTab === 'networking' ? activeClass : inactiveClass)}
      >
        네트워킹
      </button>
      <button
        type="button"
        onClick={() => onTabChange('mentors')}
        className={cn(tabClass, activeTab === 'mentors' ? activeClass : inactiveClass)}
      >
        멘토
      </button>
      <button
        type="button"
        onClick={() => onTabChange('friends')}
        className={cn(tabClass, activeTab === 'friends' ? activeClass : inactiveClass)}
      >
        내 친구
      </button>
    </div>
  )
}
