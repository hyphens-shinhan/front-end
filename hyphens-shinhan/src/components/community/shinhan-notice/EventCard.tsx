import { cn } from "@/utils/cn";
import { formatEventTimeRange } from "@/utils/date";
import { Icon } from "@/components/common/Icon";
import { EventPostResponse } from "@/types/posts";
import EventTitleHeader from "./EventTitleHeader";

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

    return (
        <div className={styles.container}>
            <EventTitleHeader
                event_category={event_category}
                event_status={event_status}
                title={title}
                variant="card"
            />

            {/** 본문 내용 */}
            <p className={styles.content}>{content}</p>

            {/** 시간, 진행방식, 인원수 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldCalendar' />
                    <time>{formatEventTimeRange(event_start, event_end)}</time>
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
    content: cn('body-8 text-grey-11 line-clamp-2'),
    infoContainer: cn(
        'flex flex-col gap-1.5',
    ),
    infoItem: cn(
        'flex gap-2',
        'text-grey-9 body-8',
    ),
};