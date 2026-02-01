'use client';

import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { formatDateYMD, formatEventTimeRange, formatTime, getDaysUntil } from "@/utils/date";
import { useEventPost } from "@/hooks/posts/usePosts";
import EventTitleHeader from "./EventTitleHeader";
import { ROUTES } from "@/constants";
import { EventStatus } from "@/types/posts";
import Link from "next/link";
import Separator from "@/components/common/Separator";
import BottomFixedButton from "@/components/common/BottomFixedButton";

interface EventDetailContentProps {
    eventId: string;
}

/** 신한장학재단 이벤트 상세 콘텐츠 */
export default function EventDetailContent({ eventId }: EventDetailContentProps) {
    const { data: event, isLoading, isError, error } = useEventPost(eventId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-grey-7">로딩 중...</p>
            </div>
        );
    }

    if (isError || !event) {
        const errorDetail =
            error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
                : null;
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorText}>
                    이 이벤트를 불러올 수 없습니다.
                    {errorDetail && process.env.NODE_ENV === 'development' && (
                        <span className="mt-2 block font-mono text-xs text-grey-7">{errorDetail}</span>
                    )}
                </p>
                <Link href={ROUTES.COMMUNITY.EVENT.MAIN} className={styles.errorBackLink}>
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

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

    // D-Day: event_end와 오늘 비교, 과거면 미표시
    const daysUntil = getDaysUntil(event_end);
    const dDayLabel =
        daysUntil < 0 ? null : daysUntil === 0 ? 'D-Day' : `D-${daysUntil}`;

    // 신청 마감일 표기 (event_end 기준)
    const deadlineText = `신청 마감일 : ${formatDateYMD(event_end)} ${formatTime(event_end)}`;
    const isClosed = event_status === EventStatus.CLOSED;

    return (
        <article className={styles.container}>
            {/* 사진 */}
            <div className={styles.imageContainer}>
                {/** TODO: 이미지 추가 */}
            </div>

            {/** 제목 */}
            <EventTitleHeader
                extra={dDayLabel != null ? dDayLabel : undefined}
                event_category={event_category}
                event_status={event_status}
                title={title}
                variant="detail"
            />

            {/** 시간, 장소, 인원수 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem}>
                    <Icon name="IconLBoldCalendar" />
                    <time>{formatEventTimeRange(event_start, event_end)}</time>
                </div>
                <div className={styles.infoItem}>
                    <Icon name="IconLBoldLocation" />
                    <p>{event_location}</p>
                </div>
                <div className={styles.infoItem}>
                    <Icon name="IconLBoldProfile2user" />
                    <p>
                        {participants_count}
                        {max_participants ? ` / ${max_participants}명` : '명'}
                    </p>
                </div>
            </div>

            <Separator />

            {/** 본문 내용 */}
            <div className={styles.contentTitle}>프로그램 소개</div>
            <div className={styles.content}>{content}</div>

            {/** 하단 고정 버튼 */}
            <BottomFixedButton
                topContent={<p>{deadlineText}</p>}
                label={isClosed ? '마감됨' : '신청하기'}
                disabled={isClosed}
                onClick={isClosed ? undefined : () => { }}
            />
        </article>
    );
}

const styles = {
    imageContainer: cn('py-3 rounded-[16px] h-[158px] bg-grey-4'),
    errorContainer: cn(
        'flex flex-col items-center justify-center gap-4',
        'px-4 py-20'
    ),
    errorText: cn('text-center body-6 text-grey-11'),
    errorBackLink: cn('body-6 text-primary-light underline', 'hover:text-primary-shinhanblue'),
    container: cn('flex flex-col gap-3', 'px-4 py-3'),
    contentTitle: cn('body-5 text-grey-11 pt-3'),
    content: cn('body-8 text-grey-11', 'whitespace-pre-wrap'),
    infoContainer: cn('flex flex-col gap-1.5'),
    infoItem: cn('flex gap-2', 'text-grey-9 body-8'),
};
