import { NavItem } from '@/types';
import { ROUTES } from './routes';

/** 라우트 상수 */
export { ROUTES } from './routes';

/** 바텀 네비게이션 아이템 상수 */
export const NAV_ITEMS: NavItem[] = [
    { label: '홈', href: ROUTES.HOME.MAIN, icon: 'TEMP' },
    { label: '네트워킹', href: ROUTES.NETWORK.MAIN, icon: 'TEMP' },
    { label: '장학금', href: ROUTES.SCHOLARSHIP.MAIN, icon: 'TEMP' },
    { label: '커뮤니티', href: ROUTES.COMMUNITY.MAIN, icon: 'TEMP' },
    { label: '마이페이지', href: ROUTES.MYPAGE.MAIN, icon: 'TEMP' },
  ];