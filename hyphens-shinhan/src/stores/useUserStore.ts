import { create } from 'zustand'
import type { UserHomeProfile } from '@/types'
import type { UserRole } from '@/types'

/**
 * 홈용 내 프로필(GET /users/me) 저장 스토어.
 * 로그인 후 (tabs) 레이아웃에서 useMe()로 불러와 여기에 동기화해 두고,
 * 헤더·바텀네비 등에서 user를 구독해 사용합니다.
 */
interface UserState {
  /** 홈용 내 프로필 (null = 미로드 또는 비로그인) */
  user: UserHomeProfile | null
  setUser: (user: UserHomeProfile | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

/** AppRole → 바텀네비용 UserRole (YB | OB | MENTOR) */
export function toNavRole(role: UserHomeProfile['role']): UserRole {
  if (role === 'OB') return 'OB'
  /** TODO: 어드민 추가 필요 */
  if (role === 'MENTOR' || role === 'ADMIN') return 'MENTOR'
  return 'YB' // YB, YB_LEADER
}
