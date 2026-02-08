import { memo } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { formatDateYMD, startOfDay } from "@/utils/date";
import { NoticePostResponse } from "@/types/posts";
import NoticeTitleHeader from "./NoticeTitleHeader";

interface NoticeCardProps {
    notice: NoticePostResponse;
}

function areNoticePropsEqual(prev: NoticeCardProps, next: NoticeCardProps): boolean {
    const a = prev.notice;
    const b = next.notice;
    if (a.id !== b.id) return false;
    if (a.title !== b.title) return false;
    if (a.content !== b.content) return false;
    if (a.is_pinned !== b.is_pinned) return false;
    if (a.view_count !== b.view_count) return false;
    if (a.created_at !== b.created_at) return false;
    const aUrls = a.file_urls ?? [];
    const bUrls = b.file_urls ?? [];
    if (aUrls.length !== bUrls.length) return false;
    if (aUrls.some((url, i) => url !== bUrls[i])) return false;
    return true;
}

/** 신한 장학재단 공지 카드 컴포넌트
 * @param {NoticeCardProps} props - 공지사항 데이터
 * @returns {React.ReactNode} 신한 장학재단 공지 카드 컴포넌트
 * @example
 * <NoticeCard notice={noticeData} />
 */
function NoticeCard({ notice }: NoticeCardProps) {
    const {
        title,
        content,
        is_pinned,
        view_count,
        file_urls,
        created_at,
    } = notice;

    // 파일명 추출 (URL에서 마지막 부분)
    const getFileName = (url: string) => {
        return url.split('/').pop() || url;
    };

    // 오늘 포함 3일 이내 공지인지 (뱃지 노출 조건)
    const isWithin3Days = (() => {
        const todayStart = startOfDay(new Date());
        const createdStart = startOfDay(created_at);
        const diffDays = Math.floor((todayStart.getTime() - createdStart.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 2;
    })();

    return (
        <article className={styles.container}>
            <NoticeTitleHeader
                title={title}
                is_pinned={is_pinned}
                showNewBadge={isWithin3Days}
                variant="card"
            />

            {/** 본문 내용 */}
            <p className={styles.content}>{content}</p>

            {/** 첨부 파일 */}
            {file_urls && file_urls.length > 0 && (
                <div className={styles.attachmentContainer}>
                    <Icon name='IconMBoldDocumentText' />
                    {getFileName(file_urls[0])}
                </div>
            )}

            {/** 조회수와 작성일 */}
            <div className={styles.infoContainer}>
                <time>{formatDateYMD(created_at)}</time>
                <p>조회수 {view_count}</p>
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-3',
        'px-4 pt-6 pb-3',
    ),
    content: cn(
        'body-8 text-grey-11',
        'line-clamp-2',
    ),
    attachmentContainer: cn(
        'flex items-center gap-2.5',
        'bg-grey-2 rounded-[6px] border border-grey-3',
        'body-8 text-grey-9',
        'px-3 py-2',
    ),
    infoContainer: cn(
        'flex items-center gap-4',
        'font-caption-caption4 text-grey-8',
    ),
};

export default memo(NoticeCard, areNoticePropsEqual);