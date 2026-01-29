import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { NoticePostResponse } from "@/types/posts";

interface NoticeCardProps {
    notice: NoticePostResponse;
}

/** 신한 장학재단 공지 카드 컴포넌트
 * @param {NoticeCardProps} props - 공지사항 데이터
 * @returns {React.ReactNode} 신한 장학재단 공지 카드 컴포넌트
 * @example
 * <NoticeCard notice={noticeData} />
 */
export default function NoticeCard({ notice }: NoticeCardProps) {
    const {
        title,
        content,
        is_pinned,
        view_count,
        file_urls,
        created_at,
    } = notice;

    // 날짜 포맷팅 (예: 2024.12.15)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 파일명 추출 (URL에서 마지막 부분)
    const getFileName = (url: string) => {
        return url.split('/').pop() || url;
    };

    return (
        <article className={styles.container}>
            {/** 제목과 핀 아이콘 */}
            <header className={styles.titleContainer}>
                <h3 className={styles.title}>{title}</h3>
                {is_pinned && <Icon name='IconLBoldPin' size={20} className={styles.pinIcon} />}
            </header>

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
                <time>{formatDate(created_at)}</time>
                <p>조회수 {view_count}</p>
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-3.5',
        'px-4 pt-6 pb-3',
    ),
    titleContainer: cn(
        'flex items-center gap-1',
    ),
    title: cn(
        'title-18',
    ),
    pinIcon: cn(
        'text-grey-9',
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