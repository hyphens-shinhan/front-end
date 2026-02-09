'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

interface ChatOptionsMenuProps {
  otherUserId: string
  onClose: () => void
  className?: string
}

export default function ChatOptionsMenu({
  otherUserId,
  onClose,
  className,
}: ChatOptionsMenuProps) {
  const router = useRouter()

  const handleProfile = () => {
    onClose()
    router.push(`/mypage/${otherUserId}`)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-grey-4 shadow-lg py-2 min-w-[200px]',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleProfile}
        className="w-full px-4 py-2.5 text-left body-8 text-grey-11 hover:bg-grey-1-1 transition-colors"
      >
        프로필 보기
      </button>
    </div>
  )
}
