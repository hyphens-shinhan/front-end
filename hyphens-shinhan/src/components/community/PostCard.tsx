import { Icon } from "../common/Icon";
import { cn } from "@/utils/cn";
import FollowButton from "./FollowButton";
import MoreButton from "./MoreButton";
import { FeedPostResponse } from "@/types/posts";
import Image from "next/image";

interface PostCardProps {
    post: FeedPostResponse;
}

/** 커뮤니티 게시글 카드
 * @param {PostCardProps} props - 게시글 데이터
 * @example
 * <PostCard post={postData} />
 */
export default function PostCard({ post }: PostCardProps) {
    const {
        author,
        content,
        created_at,
        like_count,
        comment_count,
        image_urls,
        is_anonymous,
    } = post;

    // 날짜 포맷팅 (예: 12월 14일 12:20)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <article className={styles.container}>
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
                {!is_anonymous && (
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
                    <time className={styles.time}>{formatDate(created_at)}</time>
                    {/** 팔로우 버튼, 더보기 버튼 */}
                    <div className={styles.moreButtonWrapper}>
                        <MoreButton />
                    </div>
                </div>
                {/** 중앙: 이미지/본문 영역 */}
                <div className={styles.contentWrapper}>
                    <p className={styles.contentText}>{content}</p>
                    {/** 이미지 영역 */}
                    {image_urls && image_urls.length > 0 && (
                        <div className={styles.imageWrapper}>
                            {image_urls.slice(0, 2).map((url, index) => (
                                <div key={index} className={styles.imageItem}>
                                    {/* <Image
                                        src={url}
                                        alt={`post-image-${index}`}
                                        fill
                                        className="rounded-[12px] object-cover"
                                    /> */}
                                </div>
                            ))}
                            {image_urls.length > 2 && (
                                <div className={styles.imageMoreButton}>
                                    +{image_urls.length - 2}
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
        </article>
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
        'flex flex-col gap-2.5 mt-1',
    ),
    contentText: cn(
        'pr-14',
        'body-8',
        'text-grey-11',
        'line-clamp-2',
    ),
    imageWrapper: cn(
        'flex flex-row gap-2 items-center',
    ),
    imageItem: cn(
        'w-22 h-22 rounded-[12px]',
        'bg-grey-5',
    ),
    imageMoreButton: cn(
        'flex items-center justify-center',
        'w-fit h-fit',
        'px-[9px] py-[7px] rounded-[17px]',
        'font-caption-caption3 ',
        'text-grey-9',
        'bg-grey-2',
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
}