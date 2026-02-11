import CreateGroup from '@/components/community/group/CreateGroup'
import { cn } from '@/utils/cn'

/**
 * 소모임 만들기 페이지 (hyphens-frontend community/groups/create와 동일 구조).
 */
export default function CreateGroupPage() {
  return (
    <div className={cn('min-h-full')}>
      <CreateGroup />
    </div>
  )
}