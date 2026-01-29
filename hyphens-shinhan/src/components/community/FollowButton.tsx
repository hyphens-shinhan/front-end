'use client';
import Button from "@/components/common/Button";
import { Icon } from "../common/Icon";
import { cn } from "@/utils/cn";

/** 팔로우 버튼 타입
 * - addIcon: 아이콘 형태로 팔로우 버튼 표시
 * - button: 버튼 형태로 팔로우 버튼 표시
 * @example
 * <FollowButton type="addIcon" />
 * <FollowButton type="button" />
 */
interface PropsType {
    type: 'addIcon' | 'button';
}
export default function FollowButton({ type }: PropsType) {
    const handleButtonClick = () => {
        console.log('팔로우 버튼 클릭');
    };

    return (
        <>
            {type === 'addIcon' && (
                <button className={styles.addIconButton} aria-label="팔로우 버튼" onClick={handleButtonClick}>
                    <Icon name='IconLLinePlus' className={styles.addIconIcon} />
                </button>
            )}
            {type === 'button' && (
                <Button
                    label="팔로우"
                    size="XS"
                    type="primary"
                    disabled={false}
                    onClick={handleButtonClick}
                />
            )}
        </>
    );
}

const styles = {
    addIconButton: cn(
        'w-4 h-4 flex items-center justify-center',
        'bg-grey-11 rounded-full text-grey-9 border border-white',
        'transition-all duration-100 active:scale-90',
    ),
    addIconIcon: cn(
        'w-2 h-2 text-white',
    ),
};