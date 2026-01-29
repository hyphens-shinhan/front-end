'use client';

import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";

/** 더보기 버튼
 * - 더보기 버튼 클릭 시 메뉴 노출
 * @example
 * <MoreButton />
 */
export default function MoreButton() {
    const handleMoreButtonClick = () => {
        console.log('더보기 버튼 클릭');
    };

    return (
        <button className={styles.moreButton} aria-label="더보기 버튼" onClick={handleMoreButtonClick}>
            <Icon name='IconMLine3DotVertical' />
        </button>
    );
}

const styles = {
    moreButton: cn(
        'text-grey-9',
        'transition-all duration-100 active:scale-90',
    ),
};