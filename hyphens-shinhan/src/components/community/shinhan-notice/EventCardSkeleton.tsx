import { cn } from "@/utils/cn";

/** 이벤트 카드 스켈레톤
 * @returns {React.ReactNode} 이벤트 카드 로딩 스켈레톤
 * @example
 * <EventCardSkeleton />
 */
export default function EventCardSkeleton() {
    return (
        <div className={styles.container}>
            {/** 태그들 스켈레톤 */}
            <div className={styles.tagContainer}>
                <div className={styles.tag} />
                <div className={styles.tag} />
            </div>

            {/** 제목, 본문 내용 스켈레톤 */}
            <div className={styles.contentContainer}>
                <div className={styles.title} />
                <div className={styles.contentWrapper}>
                    <div className={styles.contentLine1} />
                    <div className={styles.contentLine2} />
                </div>
            </div>

            {/** 시간, 진행방식, 인원수 스켈레톤 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem} />
                <div className={styles.infoItem} />
                <div className={styles.infoItem} />
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-4',
        'px-4 py-5',
        'animate-pulse',
    ),
    tagContainer: cn(
        'flex gap-1.5',
    ),
    tag: cn(
        'w-14 h-6 rounded-full',
        'bg-grey-3',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
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
        'w-full h-4 rounded',
        'bg-grey-3',
    ),
    infoContainer: cn(
        'flex flex-col gap-2.5',
    ),
    infoItem: cn(
        'w-48 h-4 rounded',
        'bg-grey-3',
    ),
};
