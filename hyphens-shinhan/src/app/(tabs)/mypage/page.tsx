'use client'

import { useLogout } from '@/hooks/useAuth'

export default function MypagePage() {
  const logoutMutation = useLogout()

  return (
    <div>
      <p>MypagePage</p>
      <button
        type="button"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  )
}
