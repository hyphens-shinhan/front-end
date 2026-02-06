import { cn } from "@/utils/cn";
import Button from "./Button";

type ButtonSize = 'L' | 'M' | 'S' | 'XS'
type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning'

interface BottomFixedButtonProps {
    /** 버튼 위에 올 컨텐츠 (예: 마감일 안내) */
    topContent?: React.ReactNode;
    /** 버튼 아래에 올 컨텐츠 (예: 안내 문구) */
    bottomContent?: React.ReactNode;
    /** (첫 번째) 버튼 라벨 */
    label: string;
    /** 버튼 크기 */
    size?: ButtonSize;
    /** (첫 번째) 버튼 타입 */
    type?: ButtonType;
    disabled?: boolean;
    /** (첫 번째) 버튼 클릭 */
    onClick?: () => void;
    /** 두 번째 버튼 라벨. 있으면 버튼 두 개 가로 배치 */
    secondLabel?: string;
    /** 두 번째 버튼 타입 (기본: secondary) */
    secondType?: ButtonType;
    /** 두 번째 버튼 비활성화 */
    secondDisabled?: boolean;
    /** 두 번째 버튼 클릭 */
    onSecondClick?: () => void;
}

/** 하단 고정 버튼. 버튼 1개 또는 2개(가로 배치) + 위/아래 슬롯 */
export default function BottomFixedButton({
    topContent,
    bottomContent,
    label,
    size = 'L',
    type = 'primary',
    disabled = false,
    onClick,
    secondLabel,
    secondType = 'secondary',
    secondDisabled = false,
    onSecondClick,
}: BottomFixedButtonProps) {
    const hasTwoButtons = secondLabel != null

    return (
        <div className={styles.container}>
            {topContent != null && <div className={styles.slot}>{topContent}</div>}
            <div className={cn(hasTwoButtons && styles.buttonRow)}>
                {hasTwoButtons && (
                    <Button
                        label={secondLabel}
                        size={size}
                        type={secondType}
                        fullWidth
                        disabled={secondDisabled}
                        onClick={onSecondClick}
                        className={styles.flexButton}
                    />
                )}
                <Button
                    label={label}
                    size={size}
                    type={type}
                    fullWidth={true}
                    disabled={disabled}
                    onClick={onClick}
                    className={hasTwoButtons ? styles.flexButton : undefined}
                />
            </div>
            {bottomContent != null && <div className={styles.slot}>{bottomContent}</div>}
        </div>
    );
}

const styles = {
    container: cn(
        'w-full max-w-md mx-auto fixed bottom-0 left-0 right-0',
        'flex flex-col gap-2',
        'px-4 pb-12 pt-4',
        'bg-white'
    ),
    slot: cn('text-center body-7 text-grey-10'),
    buttonRow: cn('flex gap-2 w-full'),
    flexButton: cn('flex-1 min-w-0'),
};