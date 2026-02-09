'use client'

import { POST_FAB_ITEM_KEY, POST_FAB_ITEMS } from "@/constants";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface PropsType {
    type: POST_FAB_ITEM_KEY;
}

/**
 * 플로팅 액션 버튼 (FAB) 컴포넌트
 * 바텀 네비게이션 바로 위에 고정되어 스크롤과 무관하게 표시됩니다.
 * max-w-md 컨테이너 기준으로 오른쪽 하단에 배치됩니다.
 * 
 * @param type - POST_FAB_ITEM_KEY enum 값
 * @example
 * <PostFAB type={POST_FAB_ITEM_KEY.WRITE} />
 */
export default function PostFAB({ type }: PropsType) {
    return (
        <div className={styles.wrapper}>
            <Link
                href={POST_FAB_ITEMS[type].href}
                className={styles.container}
                aria-label={POST_FAB_ITEMS[type].ariaLabel}
            >
                <Icon name={POST_FAB_ITEMS[type].icon} className="text-white" />
            </Link>
        </div>
    );
}

const styles = {
    // 1. 화면 정중앙에 고정된 두께 없는 선(기둥) 역할을 합니다.
    wrapper: cn(
        'fixed bottom-[calc(var(--bottom-nav-height)+1rem)]',
        'left-1/2 -translate-x-1/2', // 화면의 정중앙으로 이동
        'w-full max-w-md',          // 중앙 레이아웃과 똑같은 너비 설정
        'pointer-events-none',      // 이 래퍼 자체가 클릭을 가로막지 않게 함
        'z-[60] px-8',               // 안쪽에 32px 여백 확보
    ),
    // 2. 실제 버튼 (wrapper 안에서 오른쪽 끝으로 밀어버림)
    container: cn(
        'ml-auto pointer-events-auto', // 버튼만 클릭 가능하게 복구 + 오른쪽 정렬
        'w-15 h-15 rounded-full bg-primary-shinhanblue',
        'flex items-center justify-center',
        'shadow-lg transition-transform active:scale-95 hover:bg-primary-dark',
    ),
};