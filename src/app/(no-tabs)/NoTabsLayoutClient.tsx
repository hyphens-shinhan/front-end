'use client'

import { useEffect } from 'react'
import { useMe } from '@/hooks/user/useUser'
import { useUserStore } from '@/stores'

/**
 * (no-tabs) 라우트에서도 GET /users/me 호출 후 useUserStore에 동기화.
 * TabsLayoutClient와 동일하게 역할/헤더 등에서 user를 쓰는 페이지에서 필요합니다.
 */
export default function NoTabsLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: me, isSuccess, isError } = useMe()
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    if (isSuccess && me) {
      setUser(me)
    }
    if (isError) {
      setUser(null)
    }
  }, [isSuccess, isError, me, setUser])

  return <>{children}</>
}
