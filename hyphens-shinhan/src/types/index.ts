import { NavLink } from './routes';

/** 전체 라우트 타입 */
export type { AllRoutePath } from './routes';

/** 바텀 네비게이션 타입 */
export type { NavLink } from './routes';

/** 바텀 네비게이션 아이템 타입 */
export interface NavItem {
    label: string;
    href: NavLink;
    icon: string; // 임의로 문자열 처리
}