'use client'

import { cn } from "@/utils/cn";
import InputBar from "./InputBar";
import { INPUT_BAR_TYPE } from "@/constants";

interface MessageInputProps {
    /** InputBar 타입 (COMMENT, CHAT) */
    type: INPUT_BAR_TYPE;
    /** 입력값 */
    value: string;
    /** 입력값 변경 핸들러 */
    onChange: (value: string) => void;
    /** 전송 핸들러 */
    onSend: () => void;
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
 * 메시지 입력 컴포넌트 (InputBar + SendButton)
 * 
 * 댓글, 채팅 입력창에서 공통으로 사용
 * 
 * @example
 * <MessageInput
 *   type={INPUT_BAR_TYPE.COMMENT}
 *   value={comment}
 *   onChange={setComment}
 *   onSend={handleSend}
 *   isSubmitting={isPending}
 * />
 */
export default function MessageInput({
    type,
    value,
    onChange,
    onSend,
    isSubmitting = false,
    onAttach,
    onEmoji,
    isAnonymous = false,
    onAnonymousToggle,
    className,
}: MessageInputProps) {
    const canSend = value.trim().length > 0 && !isSubmitting;

    // Enter 키로 전송
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && canSend) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className={cn(styles.container, className)} onKeyDown={handleKeyDown}>
            <InputBar
                type={type}
                value={value}
                onChange={onChange}
                onSend={onSend}
                isSubmitting={isSubmitting}
                onAttach={onAttach}
                onEmoji={onEmoji}
                isAnonymous={isAnonymous}
                onAnonymousToggle={onAnonymousToggle}
                className="flex-1 min-w-0"
            />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-row items-center gap-2',
        'px-4 pt-2.5 pb-6 bg-white',
    ),
}
