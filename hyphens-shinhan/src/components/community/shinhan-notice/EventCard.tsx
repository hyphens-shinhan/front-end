import { cn } from "@/utils/cn";
import { Icon } from "@/components/common/Icon";
import InfoTag from "@/components/common/InfoTag";
import { EventPostResponse, EventStatus } from "@/types/posts";

interface EventCardProps {
    event: EventPostResponse;
}

/** 이벤트 카드 컴포넌트
 * @param {EventCardProps} props - 이벤트 데이터
 * @returns {React.ReactNode} 이벤트 카드 컴포넌트
 * @example
 * <EventCard event={eventData} />
 */
export default function EventCard({ event }: EventCardProps) {
    const {
        title,
        content,
        event_start,
        event_end,
        event_location,
        event_status,
        event_category,
        participants_count,
        max_participants,
    } = event;

    // 이벤트 상태 라벨 및 색상
    const getStatusInfo = (status?: EventStatus | null) => {
        switch (status) {
            case EventStatus.OPEN:
                return { label: '모집중', color: 'green' as const };
            case EventStatus.CLOSED:
                return { label: '종료', color: 'grey' as const };
            case EventStatus.SCHEDULED:
                return { label: '예정', color: 'blue' as const };
            default:
                return { label: '모집중', color: 'green' as const };
        }
    };

    // 날짜/시간 포맷팅 (예: 2026.01.23 14:00~16:00)
    const formatEventTime = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateStr = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`;
        const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
        const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
        return `${dateStr} ${startTime}~${endTime}`;
    };

    const statusInfo = getStatusInfo(event_status);

    return (
        <div className={styles.container}>
            {/** 태그들 */}
            <div className={styles.tagContainer}>
                {event_category && <InfoTag label={event_category} color="blue" />}
                <InfoTag label={statusInfo.label} color={statusInfo.color} />
            </div>

            {/** 제목, 본문 내용 */}
            <div className={styles.contentContainer}>
                <p className={styles.title}>{title}</p>
                <p className={styles.content}>{content}</p>
            </div>

            {/** 시간, 진행방식, 인원수 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldCalendar' />
                    <p>{formatEventTime(event_start, event_end)}</p>
                </div>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldLocation' />
                    <p>{event_location}</p>
                </div>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldProfile2user' />
                    <p>{participants_count}{max_participants ? ` / ${max_participants}명` : '명'}</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-4',
        'px-4 py-5'
    ),
    tagContainer: cn(
        'flex gap-1.5',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
    content: cn(
        'body-8 text-grey-11',
    ),
    infoContainer: cn(
        'flex flex-col gap-2.5',
    ),
    infoItem: cn(
        'flex gap-2',
        'text-grey-9 body-8',
    ),
};