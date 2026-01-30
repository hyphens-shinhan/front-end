import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import SendButton from "./SendButton";
import { INPUT_BAR_TYPE, INPUT_BAR_ITEMS } from "@/constants";

export { INPUT_BAR_TYPE } from "@/constants";

interface InputBarProps {
    /** InputBar 타입 */
    type: INPUT_BAR_TYPE;
    /** input element ref (포커스 등에 사용) */
    inputRef?: React.RefObject<HTMLInputElement | null>;
    /** 입력값 */
    value?: string;
    /** 입력값 변경 핸들러 */
    onChange?: (value: string) => void;
    /** 전송 핸들러 */
    onSend?: () => void;
    /** 전송 중 여부 */
    isSubmitting?: boolean;
    /** 첨부 버튼 클릭 핸들러 */
    onAttach?: () => void;
    /** 이모지 버튼 클릭 핸들러 */
    onEmoji?: () => void;
    /** 익명 여부 */
    isAnonymous?: boolean;
    /** 익명 버튼 클릭 핸들러 */
    onAnonymousToggle?: () => void;
    /** 추가 className */
    className?: string;
}

/**
 * 범용 입력바 컴포넌트
 * 
 * @param type - INPUT_BAR_TYPE enum 값 (SEARCH, CHAT, COMMENT)
 * @example
 * <InputBar type={INPUT_BAR_TYPE.SEARCH} />
 * <InputBar type={INPUT_BAR_TYPE.CHAT} onAttach={handleAttach} />
 * <InputBar type={INPUT_BAR_TYPE.COMMENT} value={comment} onChange={setComment} />
 */
export default function InputBar({
    type,
    inputRef,
    value,
    onChange,
    onSend,
    isSubmitting = false,
    onAttach,
    onEmoji,
    isAnonymous = false,
    onAnonymousToggle,
    className,
}: InputBarProps) {
    const config = INPUT_BAR_ITEMS[type];
    const canSend = (value?.trim().length ?? 0) > 0 && !isSubmitting;

    return (
        <div className={cn(styles.container, className)}>
            {/** 왼쪽 아이콘 */}
            {config.leftIcon && (
                <Icon name={config.leftIcon} className={styles.icon} />
            )}

            {/** 입력 필드 */}
            <input
                ref={inputRef}
                type="text"
                placeholder={config.placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={styles.input}
            />

            {/** 첨부 버튼 */}
            {config.showAttach && (
                <button type="button" onClick={onAttach}>
                    <Icon name="IconLBoldAttachCircle" className={styles.icon} />
                </button>
            )}

            {/** 이모지 버튼 */}
            {config.showEmoji && (
                <button type="button" onClick={onEmoji}>
                    <Icon name="IconLBoldEmotion" className={styles.icon} />
                </button>
            )}
            {/** 익명 버튼 */}
            {config.showAnonymous && (
                <button type="button" onClick={onAnonymousToggle} className={styles.anonymousButton}>
                    <Icon
                        name="IconMBoldTickCircle"
                        className={isAnonymous ? styles.anonymousIconActive : styles.anonymousIcon}
                    />
                    <p className={isAnonymous ? styles.anonymousTextActive : styles.anonymousText}>
                        익명
                    </p>
                </button>
            )}

            {/** 전송 버튼 */}
            {config.sendButton && (
                <SendButton onClick={onSend} disabled={!canSend} />
            )}
        </div>
    );
}

const styles = {
    container: cn(
        'flex items-center gap-2.5 min-w-0',
        'px-5 py-2 bg-grey-2',
        'rounded-[24px]',
    ),
    icon: cn('text-grey-8 shrink-0'),
    anonymousButton: cn('flex items-center gap-1 shrink-0'),
    anonymousIcon: cn('text-grey-6 shrink-0'),
    anonymousIconActive: cn('text-primary-shinhanblue shrink-0'),
    anonymousText: cn('font-caption-caption3 text-grey-7'),
    anonymousTextActive: cn('font-caption-caption3 text-primary-light'),
    input: cn(
        'flex-1 min-w-0',
        'body-6',
        'text-grey-10 bg-transparent',
        'placeholder:text-grey-8 placeholder:body-5',
        'outline-none focus:outline-none',
    ),
}
