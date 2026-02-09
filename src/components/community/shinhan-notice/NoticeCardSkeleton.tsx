import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 신한 장학재단 공지 카드 스켈레톤
 * @returns {React.ReactNode} 공지 카드 로딩 스켈레톤
 * @example
 * <NoticeCardSkeleton />
 */
export default function NoticeCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 제목 스켈레톤 */}
            <header className={styles.titleContainer}>
                <Skeleton.Box className="w-3/4 h-5" />
            </header>

            {/** 본문 내용 스켈레톤 */}
            <Skeleton.Text lines={2} lastLineWidth="w-2/3" />

            {/** 첨부 파일 스켈레톤 */}
            <Skeleton.Box className="w-full h-10 rounded-[6px]" />

            {/** 조회수와 작성일 스켈레톤 */}
            <div className={styles.infoContainer}>
                <Skeleton.Box className="w-16 h-3" />
                <Skeleton.Box className="w-16 h-3" />
            </div>
        </Skeleton.Container>
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
    infoContainer: cn(
        'flex items-center gap-4',
    ),
};
