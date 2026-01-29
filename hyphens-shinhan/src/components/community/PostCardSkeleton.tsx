import { cn } from "@/utils/cn";

/** 커뮤니티 게시글 카드 스켈레톤
 * @returns {React.ReactNode} 게시글 카드 로딩 스켈레톤
 * @example
 * <PostCardSkeleton />
 */
export default function PostCardSkeleton() {
    return (
        <article className={styles.container}>
            {/** 유저 프로필 사진 스켈레톤 */}
            <div className={styles.userProfileWrapper} />

            {/** 유저 정보, 본문 영역 스켈레톤 */}
            <div className={styles.postContent}>
                {/** 유저 이름, 시간 스켈레톤 */}
                <div className={styles.infoWrapper}>
                    <div className={styles.userName} />
                    <div className={styles.time} />
                </div>

                {/** 본문 영역 스켈레톤 */}
                <div className={styles.contentWrapper}>
                    <div className={styles.contentLine1} />
                    <div className={styles.contentLine2} />
                </div>

                {/** 좋아요, 댓글 버튼 스켈레톤 */}
                <footer className={styles.footerWrapper}>
                    <div className={styles.footerButton} />
                    <div className={styles.footerButton} />
                </footer>
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'w-full flex flex-row',
        'bg-white gap-3',
        'px-4 py-2.5',
        'animate-pulse',
    ),
    postContent: cn(
        'flex-1 flex-col',
    ),
    userProfileWrapper: cn(
        'w-10 h-10 rounded-full',
        'bg-grey-3',
    ),
    infoWrapper: cn(
        'flex flex-row items-center gap-2',
    ),
    userName: cn(
        'w-16 h-4 rounded',
        'bg-grey-3',
    ),
    time: cn(
        'w-24 h-3 rounded',
        'bg-grey-3',
    ),
    contentWrapper: cn(
        'flex flex-col gap-2 mt-2',
    ),
    contentLine1: cn(
        'w-full h-4 rounded',
        'bg-grey-3',
    ),
    contentLine2: cn(
        'w-3/4 h-4 rounded',
        'bg-grey-3',
    ),
    footerWrapper: cn(
        'flex flex-row items-center gap-2.5 justify-end',
        'mt-2',
    ),
    footerButton: cn(
        'w-10 h-4 rounded',
        'bg-grey-3',
    ),
};
