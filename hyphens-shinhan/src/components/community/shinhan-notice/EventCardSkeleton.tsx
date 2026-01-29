import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 이벤트 카드 스켈레톤
 * @returns {React.ReactNode} 이벤트 카드 로딩 스켈레톤
 * @example
 * <EventCardSkeleton />
 */
export default function EventCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 태그들 스켈레톤 */}
            <div className={styles.tagContainer}>
                <Skeleton.Tag className="w-14 h-6" />
                <Skeleton.Tag className="w-14 h-6" />
            </div>

            {/** 제목, 본문 내용 스켈레톤 */}
            <div className={styles.contentContainer}>
                <Skeleton.Box className="w-3/4 h-5" />
                <Skeleton.Text lines={2} lastLineWidth="w-full" />
            </div>

            {/** 시간, 진행방식, 인원수 스켈레톤 */}
            <div className={styles.infoContainer}>
                <Skeleton.Box className="w-48 h-4" />
                <Skeleton.Box className="w-48 h-4" />
                <Skeleton.Box className="w-48 h-4" />
            </div>
        </Skeleton.Container>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-4',
        'px-4 py-5',
    ),
    tagContainer: cn(
        'flex gap-1.5',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
    ),
    infoContainer: cn(
        'flex flex-col gap-2.5',
    ),
};
