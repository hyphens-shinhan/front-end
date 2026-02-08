import { memo } from "react";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import { formatDateKrWithTime } from "@/utils/date";
import { ROUTES } from "@/constants";
import FollowButton from "@/components/community/FollowButton";
import MoreButton from "@/components/community/MoreButton";
import PostContent from "@/components/community/feed/PostContent";
import { FeedPostResponse } from "@/types/posts";

interface PostCardProps {
    post: FeedPostResponse;
}

/** 게시글 카드 컴포넌트 동일성 비교 함수 */
function arePostPropsEqual(prev: PostCardProps, next: PostCardProps): boolean {
    const a = prev.post;
    const b = next.post;
    if (a.id !== b.id) return false;
    if (a.content !== b.content) return false;
    if (a.created_at !== b.created_at) return false;
    if (a.like_count !== b.like_count) return false;
    if (a.comment_count !== b.comment_count) return false;
    if (a.is_anonymous !== b.is_anonymous) return false;
    const aUrls = a.image_urls ?? [];
    const bUrls = b.image_urls ?? [];
    if (aUrls.length !== bUrls.length) return false;
    if (aUrls.some((url, i) => url !== bUrls[i])) return false;
    const aAuthor = a.author;
    const bAuthor = b.author;
    if (aAuthor?.id !== bAuthor?.id) return false;
    if (aAuthor?.name !== bAuthor?.name) return false;
    if (aAuthor?.is_following !== bAuthor?.is_following) return false;
    return true;
}

/** 커뮤니티 게시글 카드
 * @param {PostCardProps} props - 게시글 데이터
 * @example
 * <PostCard post={postData} />
 */
function PostCard({ post }: PostCardProps) {
    const {
        id,
        author,
        content,
        created_at,
        like_count,
        comment_count,
        image_urls,
        is_anonymous,
    } = post;

    return (
        <Link href={`${ROUTES.COMMUNITY.FEED.DETAIL}/${id}`} className={styles.container}>
            {/** 유저 프로필 사진 */}
            <div className={styles.userProfileWrapper}>
                {/* {author?.avatar_url ? (
                    <Image
                        src={author.avatar_url}
                        alt={author.name}
                        fill
                        className="rounded-full object-cover"
                    />
                ) : null} */}
                {/** 익명이 아니고, 팔로우하지 않은 경우에만 팔로우 버튼 표시 */}
                {!is_anonymous && author && !author.is_following && (
                    <div className={styles.followButton}>
                        <FollowButton type="addIcon" />
                    </div>
                )}
            </div>

            {/** 유저 정보, 본문 영역 */}
            <div className={styles.postContent}>
                {/** 유저 이름, 시간, 팔로우 버튼, 더보기 버튼 */}
                <div className={styles.infoWrapper}>
                    {/** 유저 이름 */}
                    <p className={styles.userName}>
                        {is_anonymous ? '익명' : (author?.name || '알 수 없음')}
                    </p>
                    {/** 시간 */}
                    <time className={styles.time}>{formatDateKrWithTime(created_at)}</time>
                    {/** 팔로우 버튼, 더보기 버튼 */}
                    <div className={styles.moreButtonWrapper}>
                        <MoreButton />
                    </div>
                </div>
                {/** 중앙: 이미지/본문 영역 */}
                <PostContent
                    content={content}
                    imageUrls={image_urls}
                    lineClamp={2}
                    maxImages={2}
                    className={styles.contentWrapper}
                />

                {/** 좋아요 버튼, 댓글 버튼 */}
                <footer className={styles.footerWrapper}>
                    {/** 좋아요 버튼 */}
                    <div className={styles.footerButton}>
                        <Icon name='IconMBoldHeart' />
                        <span className={styles.footerButtonText}>{like_count}</span>
                    </div>
                    {/** 댓글 버튼 */}
                    <div className={styles.footerButton}>
                        <Icon name='IconMBoldMessageText' />
                        <span className={styles.footerButtonText}>{comment_count}</span>
                    </div>
                </footer>
            </div>
        </Link>
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
    userProfileWrapper: cn(
        'relative w-10 h-10 rounded-full',
        'bg-grey-5',
    ),
    followButton: cn(
        'absolute -bottom-0.5 -right-1',
    ),
    infoWrapper: cn(
        'flex flex-row items-center gap-2',
    ),
    moreButtonWrapper: cn(
        'flex flex-row gap-4 ml-auto',
    ),
    userName: cn(
        'title-16',
        'text-grey-11',
    ),
    time: cn(
        'font-caption-caption4 text-gray-8',
    ),
    contentWrapper: cn(
        'mt-1 gap-3',
    ),
    footerWrapper: cn(
        'flex flex-row items-center gap-2.5 justify-end',
        '-mt-2.5',
    ),
    footerButton: cn(
        'flex flex-row items-center gap-1',
        'text-grey-5',
    ),
    footerButtonText: cn(
        'font-caption-caption3',
        'text-grey-9',
    ),
};

export default memo(PostCard, arePostPropsEqual);