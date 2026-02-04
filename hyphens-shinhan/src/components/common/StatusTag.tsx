import { cn } from "@/utils/cn";

type StatusType = 'inProgress' | 'scheduled' | 'completed' | 'beforeStart';

interface PropsType {
    status: StatusType;
}

const statusConfig = {
    inProgress: {
        label: '진행중',
        bg: 'bg-primary-lighter',
        text: 'text-primary-shinhanblue',
    },
    scheduled: {
        label: '참여예정',
        bg: 'bg-primary-lighter',
        text: 'text-primary-shinhanblue',
    },
    completed: {
        label: '완료',
        bg: 'bg-state-green-light',
        text: 'text-state-green-dark',
    },
    beforeStart: {
        label: '시작전',
        bg: 'bg-grey-2',
        text: 'text-grey-9',
    },
} as const;

/** Status Tag 컴포넌트
 * 진행 상태를 표시하는 태그 (진행중/참여예정-파란색, 완료-초록색, 시작전-회색)
 * @param status - 상태 값 (inProgress | scheduled | completed | beforeStart)
 * @returns {React.ReactNode} Status Tag 컴포넌트
 * @example
 * <StatusTag status="inProgress" />
 * <StatusTag status="completed" />
 */
export default function StatusTag({ status }: PropsType) {
    const { label, bg, text } = statusConfig[status];

    const containerStyle = cn(
        'w-fit flex items-center justify-center',
        'px-1.5 py-1 rounded-[24px]',
        'font-caption-caption4',
        bg,
        text,
    );

    return (
        <div className={containerStyle}>
            <span>{label}</span>
        </div>
    );
}
