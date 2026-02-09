import { cn } from "@/utils/cn";

interface PropsType {
    label: string;
    color: 'blue' | 'grey' | 'green' | 'yellow' | 'red';
}

/** Info Tag 컴포넌트
 * 소모임 탭이나 공지사항 이벤트 탭에서 사용되는 컴포넌트
 * @param label - 태그 라벨
 * @param color - 태그 색상
 * @returns {React.ReactNode} Info Tag 컴포넌트
 * @example
 * <InfoTag label="현재 참여 중" color="blue" />
 */
export default function InfoTag({ label, color }: PropsType) {
    const containerStyle = cn(
        'w-fit flex items-center justify-center',
        'px-1.5 py-1 rounded-[6px]',
        'font-caption-caption4',
        tagColor[color],
        tagTextStyles[color],
    );

    return (
        <div className={containerStyle}>
            <span>{label}</span>
        </div>
    );
}

const tagColor = {
    blue: 'bg-primary-lighter',
    grey: 'bg-grey-1-1',
    green: 'bg-state-green-light',
    yellow: 'bg-state-yellow-light',
    red: 'bg-state-red-light',
};

const tagTextStyles = {
    blue: 'text-primary-shinhanblue',
    grey: 'text-grey-9',
    green: 'text-state-green-dark',
    yellow: 'text-state-yellow-dark',
    red: 'text-state-red-dark',
};