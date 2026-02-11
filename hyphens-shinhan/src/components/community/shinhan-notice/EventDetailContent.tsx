'use client';

import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import { cn } from "@/utils/cn";
import { formatEventTimeRange, getDaysUntil } from "@/utils/date";
import { getEventDetailBottomContent } from "@/utils/eventApplication";
import { useEventPost } from "@/hooks/posts/usePosts";
import { useApplyEventPost, useCancelApplyEventPost } from "@/hooks/posts/usePostMutations";
import EventTitleHeader from "./EventTitleHeader";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { TOAST_MESSAGES } from "@/constants/toast";
import { useToast } from "@/hooks/useToast";
import Separator from "@/components/common/Separator";
import BottomFixedButton from "@/components/common/BottomFixedButton";
import Thumbnail from "@/components/common/Thumbnail";

interface EventDetailContentProps {
    eventId: string;
}

/** 신한장학재단 이벤트 상세 콘텐츠 */
export default function EventDetailContent({ eventId }: EventDetailContentProps) {
    const router = useRouter();
    const { data: event, isLoading, isError, error } = useEventPost(eventId);
    const applyMutation = useApplyEventPost();
    const cancelApplyMutation = useCancelApplyEventPost();
    const toast = useToast();

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
        application_status,
    } = event;

    const deadlineDate = application_end ?? event_end;
    const isApplying: boolean =
        applyMutation.isPending || cancelApplyMutation.isPending;
    const { topContentText, buttonLabel, isButtonDisabled } =
        getEventDetailBottomContent({
            application_status,
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
        if (is_applied === true) {
            cancelApplyMutation.mutate(eventId, {
                onSuccess: () => toast.show(TOAST_MESSAGES.EVENT.CANCEL_SUCCESS),
                onError: () => toast.error(TOAST_MESSAGES.EVENT.CANCEL_ERROR),
            });
        } else {
            applyMutation.mutate(eventId, {
                onSuccess: () => toast.show(TOAST_MESSAGES.EVENT.APPLY_SUCCESS),
                onError: () => toast.error(TOAST_MESSAGES.EVENT.APPLY_ERROR),
            });
        }
    };

    return (
        <article className={styles.container}>
            {/* 사진 */}
            <Thumbnail
                src={event.image_urls?.[0] ?? null}
                alt={event.title}
            />

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
    container: cn(
        'flex flex-col gap-3',
        'px-4 py-3',
        'pb-40', // 하단 고정 버튼에 가리지 않도록 스크롤 여유 공간
    ),
    contentTitle: cn('body-5 text-grey-11 pt-3'),
    content: cn('body-8 text-grey-11', 'whitespace-pre-wrap'),
    infoContainer: cn('flex flex-col gap-1.5'),
    infoItem: cn('flex gap-2', 'text-grey-9 body-8'),
};
