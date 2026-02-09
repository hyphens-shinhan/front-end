'use client'

import { useParams } from 'next/navigation'
import GroupChatView from '../../../../../../components/community/group/GroupChatView'

/**
 * 소모임 채팅방 페이지.
 * 참여하기 완료 후 이동하거나, 소모임 상세에서 채팅방 입장 시 사용.
 */
export default function GroupChatPage() {
  const params = useParams()
  const clubId = params?.id as string

  if (!clubId) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-grey-8">로딩 중...</p>
      </div>
    )
  }

  return <GroupChatView clubId={clubId} />
}
