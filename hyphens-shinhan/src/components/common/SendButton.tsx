import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

interface SendButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}
/**
 * 전송 버튼 컴포넌트
 * 
 * @param onClick - 클릭 이벤트 핸들러
 * @param disabled - 버튼 비활성화 여부
 * @example
 * <SendButton onClick={() => {}} disabled={false} />
 */
export default function SendButton({ onClick, disabled }: SendButtonProps) {
    return (
        <button
            type="button"
            className={cn(styles.button, disabled && styles.disabled)}
            onClick={onClick}
            disabled={disabled}
        >
            <Icon name='IconMBoldSend2' className={cn(styles.icon, disabled && styles.disabledIcon)} />
        </button>
    )
}

const styles = {
    button: cn(
        'px-3 py-1.5 rounded-full bg-primary-light shrink-0',
        'flex items-center justify-center',
        'transition-opacity hover:bg-primary-dark',
        'active:scale-98',
    ),
    disabled: cn(
        'cursor-not-allowed bg-grey-5',
        'hover:bg-grey-5',
    ),
    icon: cn('text-white'),
    disabledIcon: cn('text-grey-2'),
}
