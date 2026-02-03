import { memo } from "react";
import { cn } from "@/utils/cn";
import { formatEventTimeRange } from "@/utils/date";
import { Icon } from "@/components/common/Icon";
import { EventPostResponse } from "@/types/posts";
import EventTitleHeader from "./EventTitleHeader";

interface EventCardProps {
    event: EventPostResponse;
}

function areEventPropsEqual(prev: EventCardProps, next: EventCardProps): boolean {
    const a = prev.event;
    const b = next.event;
    if (a.id !== b.id) return false;
    if (a.title !== b.title) return false;
    if (a.content !== b.content) return false;
    if (a.event_start !== b.event_start) return false;
    if (a.event_end !== b.event_end) return false;
    if (a.event_location !== b.event_location) return false;
    if (a.event_status !== b.event_status) return false;
    if (a.event_category !== b.event_category) return false;
    if (a.participants_count !== b.participants_count) return false;
    if (a.max_participants !== b.max_participants) return false;
    return true;
}

/** 이벤트 카드 컴포넌트
 * @param {EventCardProps} props - 이벤트 데이터
 * @returns {React.ReactNode} 이벤트 카드 컴포넌트
 * @example
 * <EventCard event={eventData} />
 */
function EventCard({ event }: EventCardProps) {
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

export default memo(EventCard, areEventPropsEqual);