import { HOME_ROUTES } from './home';
import { COMMUNITY_ROUTES } from './community';
import { MYPAGE_ROUTES } from './mypage';
import { NETWORK_ROUTES } from './network';
import { SCHOLARSHIP_ROUTES } from './scholarship';

/** 전체 라우트 상수 */
export const ROUTES = {
    /** 홈 라우트 상수 */
    HOME: HOME_ROUTES,
    /** 커뮤니티 라우트 상수 */
    COMMUNITY: COMMUNITY_ROUTES,
    /** 마이페이지 라우트 상수 */
    MYPAGE: MYPAGE_ROUTES,
    /** 네트워크 라우트 상수 */
    NETWORK: NETWORK_ROUTES,
    /** 장학 활동 라우트 상수 */
    SCHOLARSHIP: SCHOLARSHIP_ROUTES,
} as const;
