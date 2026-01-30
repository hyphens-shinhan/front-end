import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 커뮤니티 게시글 카드 스켈레톤
 * @returns {React.ReactNode} 게시글 카드 로딩 스켈레톤
 * @example
 * <PostCardSkeleton />
 */
export default function PostCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 유저 프로필 사진 스켈레톤 */}
            <Skeleton.Circle className="w-10 h-10" />

            {/** 유저 정보, 본문 영역 스켈레톤 */}
            <div className={styles.postContent}>
                {/** 유저 이름, 시간 스켈레톤 */}
                <div className={styles.infoWrapper}>
                    <Skeleton.Box className="w-16 h-4" />
                    <Skeleton.Box className="w-24 h-3" />
                </div>

                {/** 본문 영역 스켈레톤 */}
                <Skeleton.Text lines={2} lastLineWidth="w-3/4" className="mt-2" />

                {/** 좋아요, 댓글 버튼 스켈레톤 */}
                <footer className={styles.footerWrapper}>
                    <Skeleton.Box className="w-10 h-4" />
                    <Skeleton.Box className="w-10 h-4" />
                </footer>
            </div>
        </Skeleton.Container>
    );
}

const styles = {
    container: cn(
        'w-full flex flex-row',
        'bg-white gap-3',
        'px-4 py-2.5',
    ),
    postContent: cn(
        'flex-1 flex-col',
    ),
    infoWrapper: cn(
        'flex flex-row items-center gap-2',
    ),
    footerWrapper: cn(
        'flex flex-row items-center gap-2.5 justify-end',
        'mt-2',
    ),
};
