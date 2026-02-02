'use client';

import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import { cn } from "@/utils/cn";
import { formatEventTimeRange, getDaysUntil } from "@/utils/date";
import {
    getEventApplicationPhase,
    getEventDetailBottomContent,
} from "@/utils/eventApplication";
import { useEventPost } from "@/hooks/posts/usePosts";
import { useApplyEventPost, useCancelApplyEventPost } from "@/hooks/posts/usePostMutations";
import EventTitleHeader from "./EventTitleHeader";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import Separator from "@/components/common/Separator";
import BottomFixedButton from "@/components/common/BottomFixedButton";

interface EventDetailContentProps {
    eventId: string;
}

/** 신한장학재단 이벤트 상세 콘텐츠 */
export default function EventDetailContent({ eventId }: EventDetailContentProps) {
    const router = useRouter();
    const { data: event, isLoading, isError, error } = useEventPost(eventId);
    const applyMutation = useApplyEventPost();
    const cancelApplyMutation = useCancelApplyEventPost();

    if (isLoading) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (isError || !event) {
        const errorDetail =
            error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
                : null;
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.EVENT}
                subMessage={
                    errorDetail && process.env.NODE_ENV === 'development' ? (
                        <span className="font-mono text-xs text-grey-7">{errorDetail}</span>
                    ) : undefined
                }
                action={
                    <Button
                        label="목록으로 돌아가기"
                        size="M"
                        type="primary"
                        onClick={() => router.push(ROUTES.COMMUNITY.EVENT.MAIN)}
                    />
                }
            />
        );
    }

    const {
        title,
        content,
        application_start,
        application_end,
        event_start,
        event_end,
        event_location,
        event_status,
        event_category,
        participants_count,
        max_participants,
        is_applied,
    } = event;

    const phase = getEventApplicationPhase({
        application_start,
        application_end,
        event_status,
    });
    const deadlineDate = application_end ?? event_end;
    const isApplying: boolean =
        applyMutation.isPending || cancelApplyMutation.isPending;
    const { topContentText, buttonLabel, isButtonDisabled } =
        getEventDetailBottomContent({
            phase,
            application_start,
            application_end,
            deadlineDate,
            is_applied,
            isApplying,
        });

    const daysUntil = getDaysUntil(event_end);
    const dDayLabel =
        daysUntil < 0 ? null : daysUntil === 0 ? 'D-Day' : `D-${daysUntil}`;

    const handleApplyClick = () => {
        if (is_applied) {
            cancelApplyMutation.mutate(eventId);
        } else {
            applyMutation.mutate(eventId);
        }
    };

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
                topContent={<p>{topContentText}</p>}
                label={buttonLabel}
                disabled={isButtonDisabled}
                onClick={isButtonDisabled ? undefined : handleApplyClick}
            />
        </article>
    );
}

const styles = {
    imageContainer: cn('py-3 rounded-[16px] h-[158px] bg-grey-4'),
    container: cn('flex flex-col gap-3', 'px-4 py-3'),
    contentTitle: cn('body-5 text-grey-11 pt-3'),
    content: cn('body-8 text-grey-11', 'whitespace-pre-wrap'),
    infoContainer: cn('flex flex-col gap-1.5'),
    infoItem: cn('flex gap-2', 'text-grey-9 body-8'),
};
