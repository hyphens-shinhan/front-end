'use client';

import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { formatDateYMD, startOfDay } from "@/utils/date";
import { useNoticePost } from "@/hooks/posts/usePosts";
import NoticeTitleHeader from "./NoticeTitleHeader";
import Separator from "@/components/common/Separator";

interface NoticeDetailContentProps {
    noticeId: string;
}

/** 공지 상세에서 오늘 포함 3일 이내인지 */
function isWithin3Days(created_at: string): boolean {
    const todayStart = startOfDay(new Date());
    const createdStart = startOfDay(created_at);
    const diffDays = Math.floor((todayStart.getTime() - createdStart.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
}

/** 신한장학재단 공지사항 상세 콘텐츠 */
export default function NoticeDetailContent({ noticeId }: NoticeDetailContentProps) {
    const { data: notice, isLoading, isError } = useNoticePost(noticeId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-grey-7">로딩 중...</p>
            </div>
        );
    }

    if (isError || !notice) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-state-red">공지사항을 불러오는 중 오류가 발생했습니다.</p>
            </div>
        );
    }

    const { title, content, is_pinned, view_count, file_urls, created_at } = notice;
    const getFileName = (url: string) => url.split('/').pop() || url;

    return (
        <article className={styles.container}>
            <div className={styles.titleContainer}>
                <NoticeTitleHeader
                    title={title}
                    is_pinned={is_pinned}
                    showNewBadge={isWithin3Days(created_at)}
                    titleAs="h1"
                />
                {/** 조회수와 작성일 */}
                <div className={styles.infoContainer}>
                    <time>{formatDateYMD(created_at)}</time>
                    <p>조회수 {view_count}</p>
                </div>
            </div>

            <Separator />

            {/** 본문 내용 */}
            <div className={styles.content}>{content}</div>

            {/** 첨부 파일 */}
            {file_urls && file_urls.length > 0 && (
                <div className={styles.attachmentContainer}>
                    <Icon name="IconMBoldDocumentText" />
                    {getFileName(file_urls[0])}
                </div>
            )}
        </article>
    );
}

const styles = {
    container: cn('flex flex-col', 'px-4 pb-5'),
    titleContainer: cn('flex flex-col gap-2 py-4'),
    content: cn('body-6 text-grey-11', 'whitespace-pre-wrap', 'py-4'),
    attachmentContainer: cn(
        'flex items-center gap-2.5',
        'bg-grey-2 rounded-[6px] border border-grey-3',
        'body-8 text-grey-9 underline',
        'px-3 py-2'
    ),
    infoContainer: cn('flex items-center gap-4', 'font-caption-caption4 text-grey-8'),
};
