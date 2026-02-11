'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'

interface ChatOptionsMenuProps {
  otherUserId: string
  onClose: () => void
}

export default function ChatOptionsMenu({
  otherUserId,
  onClose,
}: ChatOptionsMenuProps) {
  const router = useRouter()

  const handleProfile = () => {
    onClose()
    router.push(`/mypage/${otherUserId}`)
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={handleProfile}
        className={styles.option}
      >
        프로필 보기
      </button>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col gap-1 pb-2'),
  option: cn(
    'w-full px-2 py-3 text-left body-5 text-grey-11',
    'rounded-lg active:bg-grey-1-1 transition-colors',
  ),
}
