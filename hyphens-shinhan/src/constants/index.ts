import { NavItem, UserRole } from '@/types';
import { ROUTES } from './routes';

/** 라우트 상수 */
export { ROUTES } from './routes';

/** 바텀 네비게이션 아이템 상수 
 * 사용자 역할에 따라 바텀 네비게이션 아이템 상수를 반환합니다.
*/
export const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  // TODO: 멘토 - 임의로 넣어둠 달라질 예정
  MENTOR: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'TEMP' },
    { label: '활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'TEMP' },
    { label: '커뮤니티', href: ROUTES.COMMUNITY.MAIN, icon: 'TEMP' },
    { label: '네트워킹', href: ROUTES.NETWORK.MAIN, icon: 'TEMP' },    
    { label: '마이페이지', href: ROUTES.MYPAGE.MAIN, icon: 'TEMP' },
  ],
  // TODO: 졸업 장학생 - 활동 탭만 다름 임의로 넣어둠 달라질 예정
  OB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'TEMP' },
    { label: '활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'TEMP' },
    { label: '커뮤니티', href: ROUTES.COMMUNITY.MAIN, icon: 'TEMP' },
    { label: '네트워킹', href: ROUTES.NETWORK.MAIN, icon: 'TEMP' },    
    { label: '마이페이지', href: ROUTES.MYPAGE.MAIN, icon: 'TEMP' },
  ],
  // 기본 장학생
  YB: [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'TEMP' },
    { label: '활동', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'TEMP' },
    { label: '커뮤니티', href: ROUTES.COMMUNITY.MAIN, icon: 'TEMP' },
    { label: '네트워킹', href: ROUTES.NETWORK.MAIN, icon: 'TEMP' },    
    { label: '마이페이지', href: ROUTES.MYPAGE.MAIN, icon: 'TEMP' },
  ],
};