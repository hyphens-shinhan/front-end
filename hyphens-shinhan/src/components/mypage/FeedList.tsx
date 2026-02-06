import { cn } from "@/utils/cn";
import PostCard from "../community/feed/PostCard";
import { FeedPostResponse, PostType, MyPostItem, MyPostItemType } from "@/types/posts";
import InfoTag from "../common/InfoTag";
import Separator from "../common/Separator";
import { useInfiniteMyPosts } from "@/hooks/posts/usePosts";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";

interface FeedListProps {
    isMyPage?: boolean;
    userName?: string;
    userId?: string; // 퍼블릭 페이지일 경우 사용자 ID
}

export default function FeedList({ isMyPage = true, userName, userId }: FeedListProps) {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMyPosts(20);

    if (isLoading) {
        return (
            <div className={styles.articleContainer}>
                <h2 className={styles.articleTitle}>
                    {isMyPage ? '내가 쓴 글' : `${userName || '사용자'}님의 글`}
                </h2>
                <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.articleContainer}>
                <h2 className={styles.articleTitle}>
                    {isMyPage ? '내가 쓴 글' : `${userName || '사용자'}님의 글`}
                </h2>
                <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.FEED} />
            </div>
        );
    }

    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    if (allPosts.length === 0) {
        return (
            <div className={styles.articleContainer}>
                <h2 className={styles.articleTitle}>
                    {isMyPage ? '내가 쓴 글' : `${userName || '사용자'}님의 글`}
                </h2>
                <EmptyContent
                    variant="empty"
                    message={isMyPage ? '작성한 글이 없어요.' : `${userName || '사용자'}님이 작성한 글이 없어요.`}
                />
            </div>
        );
    }

    return (
        <div className={styles.articleContainer}>
            <h2 className={styles.articleTitle}>
                {isMyPage ? '내가 쓴 글' : `${userName || '사용자'}님의 글`}
            </h2>
            {allPosts.map((post, index) => (
                <div key={post.id}>
                    <div className={styles.article}>
                        <div className={styles.articleType}>
                            <InfoTag
                                label={post.type === MyPostItemType.FEED ? '게시판' : '자치회'}
                                color="grey"
                            />
                        </div>
                        <FeedPostItem post={post} />
                    </div>
                    {index < allPosts.length - 1 && <Separator className="mx-4" />}
                </div>
            ))}
            {hasNextPage && (
                <div className={styles.loadMore}>
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className={styles.loadMoreButton}
                    >
                        {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                    </button>
                </div>
            )}
        </div>
    );
}

/** Feed 타입 포스트 아이템 (게시판 + 자치회 리포트 모두 동일 컴포넌트 사용) */
function FeedPostItem({ post }: { post: MyPostItem }) {
    // MyPostItem을 FeedPostResponse로 변환
    // 자치회 리포트의 경우 title이 있을 수 있으므로, content가 없으면 title 사용
    const content = post.content || post.title || '';

    const feedPost: FeedPostResponse = {
        id: post.id,
        created_at: post.created_at,
        like_count: post.like_count,
        is_liked: false,
        image_urls: post.image_urls || [],
        type: PostType.FEED,
        content: content,
        is_anonymous: false,
        scrap_count: 0,
        comment_count: post.comment_count,
        is_scrapped: false,
        author: null, // 마이페이지에서는 작성자 정보가 없음
    };

    return <PostCard post={feedPost} />;
}

const styles = {
    articleContainer: cn('pt-4 pb-40'),
    articleTitle: cn('title-16 text-grey-11 px-4'),
    article: cn('flex flex-col py-2.5'),
    articleType: cn('flex items-center px-4'),
    loadMore: cn('px-4 py-4 flex justify-center'),
    loadMoreButton: cn('px-4 py-2 text-grey-9 bg-grey-1-1 rounded-lg'),
}