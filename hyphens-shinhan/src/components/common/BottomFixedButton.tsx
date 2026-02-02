import { cn } from "@/utils/cn";
import Button from "./Button";

interface BottomFixedButtonProps {
    /** 버튼 위에 올 컨텐츠 (예: 마감일 안내) */
    topContent?: React.ReactNode;
    /** 버튼 아래에 올 컨텐츠 (예: 안내 문구) */
    bottomContent?: React.ReactNode;
    /** 버튼 라벨 */
    label: string;
    /** 버튼 크기 */
    size?: 'L' | 'M' | 'S' | 'XS';
    /** 버튼 타입 */
    type?: 'primary' | 'secondary' | 'danger' | 'warning';
    disabled?: boolean;
    onClick?: () => void;
}

/** 하단 고정 버튼 + 위/아래 슬롯 (버튼만 쓸 수도, 위·아래 컨텐츠와 함께 쓸 수도 있음) */
export default function BottomFixedButton({
    topContent,
    bottomContent,
    label,
    size = 'L',
    type = 'primary',
    disabled = false,
    onClick,
}: BottomFixedButtonProps) {
    return (
        <div className={styles.container}>
            {topContent != null && <div className={styles.slot}>{topContent}</div>}
            <Button
                label={label}
                size={size}
                type={type}
                fullWidth={true}
                disabled={disabled}
                onClick={onClick}
            />
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
};