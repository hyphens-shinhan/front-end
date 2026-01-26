import { NavItem, UserRole } from '@/types'
import { ROUTES } from './routes'

/** 라우트 상수 */
export { ROUTES } from './routes'

/** 바텀 네비게이션 아이템 상수
 * 사용자 역할에 따라 바텀 네비게이션 아이템 상수를 반환합니다.
 */
export const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  // TODO: 멘토 - 임의로 넣어둠 달라질 예정
  MENTOR: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
  // TODO: 졸업 장학생 - 활동 탭만 다름 임의로 넣어둠 달라질 예정
  OB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
  // 기본 장학생
  YB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'IconLBoldHome' },
    { label: 'MY활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'IconLBoldChart2' },
    {
      label: '커뮤니티',
      href: ROUTES.COMMUNITY.MAIN,
      icon: 'IconLBoldNote2',
    },
    {
      label: '네트워크',
      href: ROUTES.NETWORK.MAIN,
      icon: 'IconLBoldGlobal',
    },
    {
      label: '프로필',
      href: ROUTES.MYPAGE.MAIN,
      icon: 'IconLBoldFrame',
    },
  ],
}
