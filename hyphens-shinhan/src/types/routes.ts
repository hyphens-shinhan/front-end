import { ROUTES } from "@/constants";

/** 전체 경로에 대한 타입 */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
