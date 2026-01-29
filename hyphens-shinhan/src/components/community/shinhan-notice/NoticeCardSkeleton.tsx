import { cn } from "@/utils/cn";

/** 신한 장학재단 공지 카드 스켈레톤
 * @returns {React.ReactNode} 공지 카드 로딩 스켈레톤
 * @example
 * <NoticeCardSkeleton />
 */
export default function NoticeCardSkeleton() {
    return (
        <article className={styles.container}>
            {/** 제목 스켈레톤 */}
            <header className={styles.titleContainer}>
                <div className={styles.title} />
            </header>

            {/** 본문 내용 스켈레톤 */}
            <div className={styles.contentWrapper}>
                <div className={styles.contentLine1} />
                <div className={styles.contentLine2} />
            </div>

            {/** 첨부 파일 스켈레톤 */}
            <div className={styles.attachment} />

            {/** 조회수와 작성일 스켈레톤 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem} />
                <div className={styles.infoItem} />
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-3.5',
        'px-4 pt-6 pb-3',
        'animate-pulse',
    ),
    titleContainer: cn(
        'flex items-center gap-1',
    ),
    title: cn(
        'w-3/4 h-5 rounded',
        'bg-grey-3',
    ),
    contentWrapper: cn(
        'flex flex-col gap-2',
    ),
    contentLine1: cn(
        'w-full h-4 rounded',
        'bg-grey-3',
    ),
    contentLine2: cn(
        'w-2/3 h-4 rounded',
        'bg-grey-3',
    ),
    attachment: cn(
        'w-full h-10 rounded-[6px]',
        'bg-grey-3',
    ),
    infoContainer: cn(
        'flex items-center gap-4',
    ),
    infoItem: cn(
        'w-16 h-3 rounded',
        'bg-grey-3',
    ),
};
