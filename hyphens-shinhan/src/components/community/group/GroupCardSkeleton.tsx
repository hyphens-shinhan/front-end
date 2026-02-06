import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 소모임 카드 스켈레톤
 * @returns {React.ReactNode} 소모임 카드 로딩 스켈레톤
 * @example
 * <GroupCardSkeleton />
 */
export default function GroupCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 태그들 스켈레톤 */}
            <div className={styles.tagContainer}>
                <Skeleton.Tag className="w-20 h-6" />
                <Skeleton.Tag className="w-16 h-6" />
            </div>

            <div className={styles.contentWrapper}>
                {/** 제목, 본문 내용 스켈레톤 */}
                <div className={styles.contentContainer}>
                    <div className={styles.titleContainer}>
                        <Skeleton.Box className="w-32 h-6" />
                        <Skeleton.Box className="w-5 h-5 rounded" />
                    </div>
                    <Skeleton.Text lines={2} lastLineWidth="w-3/4" />
                </div>

                {/** 멤버 미리보기 스켈레톤 */}
                <div className={styles.memberPreviewContainer}>
                    <Skeleton.Circle className="w-10 h-10" />
                    <Skeleton.Circle className="w-10 h-10" />
                    <Skeleton.Circle className="w-10 h-10" />
                </div>
            </div>
        </Skeleton.Container>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-4',
        'px-4 py-5'
    ),
    tagContainer: cn(
        'flex gap-1.5',
    ),
    contentWrapper: cn(
        'flex gap-8 justify-between',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
    ),
    titleContainer: cn(
        'flex items-center gap-1 pr-4',
    ),
    memberPreviewContainer: cn(
        'flex flex-col -space-y-6.5',
    ),
};
