'use client';

import { cn } from "@/utils/cn";
import { useMemo } from "react";
import React from "react";
import PostCard from "../community/feed/PostCard";
import PostCardSkeleton from "../community/feed/PostCardSkeleton";
import { FeedPostResponse, PostType, MyPostItem, MyPostItemType, PostAuthor } from "@/types/posts";
import InfoTag from "../common/InfoTag";
import Separator from "../common/Separator";
import { useInfiniteMyPosts, useInfiniteUserPosts } from "@/hooks/posts/usePosts";
import { useImageLoadTracking } from "@/hooks/useImageLoadTracking";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { useMyProfile } from "@/hooks/user/useUser";
import { useUserStore } from "@/stores";
import type { UserMyProfile } from "@/types/user";

interface FeedListProps {
    isMyPage?: boolean;
    userName?: string;
    userId?: string;
    userAvatarUrl?: string | null;
    hideTitle?: boolean;
    postsUserId?: string | null;
}

export default function FeedList({
    isMyPage = true,
    userName,
    userId,
    userAvatarUrl,
    hideTitle = false,
    postsUserId
}: FeedListProps) {

    // 타인의 글을 조회해야 하는 명확한 상황인지 판단
    const isViewingOthers = Boolean(postsUserId);

    // 1. 내 글 쿼리: isMyPage가 true이면서 동시에 postsUserId가 없을 때만 활성화
    const myPostsQuery = useInfiniteMyPosts(20, {
        enabled: isMyPage && !isViewingOthers
    });

    // 2. 타인 글 쿼리: postsUserId가 있을 때만 활성화
    const userPostsQuery = useInfiniteUserPosts(postsUserId ?? null, 20, {
        enabled: isViewingOthers
    });

    // 현재 활성화된 쿼리 선택
    const activeQuery = isViewingOthers ? userPostsQuery : myPostsQuery;
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = activeQuery;

    const { data: myProfile } = useMyProfile();
    const currentUser = useUserStore((s) => s.user);

    const titleText = hideTitle ? null : (isMyPage && !isViewingOthers ? '내가 쓴 글' : `${userName || '사용자'}님의 글`);

    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    // 이미지 로드 상태 추적
    const allImageUrls = useMemo(() => allPosts.flatMap(post => post.image_urls || []), [allPosts]);
    const { allImagesLoaded } = useImageLoadTracking(allImageUrls);

    // 데이터 로딩 중이거나 이미지가 아직 로드되지 않았으면 로딩 표시
    // React Query의 isLoading은 enabled가 false일 때도 true가 될 수 있으므로 
    // 실제 쿼리가 시작되지 않았을 때의 처리는 내부적으로 관리됩니다.
    const isContentLoading = isLoading || (allPosts.length > 0 && !allImagesLoaded);

    if (isContentLoading) {
        return (
            <div className={styles.articleContainer}>
                {titleText && <h2 className={styles.articleTitle}>{titleText}</h2>}
                {Array.from({ length: 5 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.article}>
                            <div className={styles.articleType} />
                            <PostCardSkeleton />
                        </div>
                        {index < 4 && <Separator className="mx-4" />}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.articleContainer}>
                {titleText && <h2 className={styles.articleTitle}>{titleText}</h2>}
                <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.FEED} />
            </div>
        );
    }

    if (allPosts.length === 0) {
        return (
            <div className={styles.articleContainer}>
                {titleText && <h2 className={styles.articleTitle}>{titleText}</h2>}
                <EmptyContent
                    variant="empty"
                    message={isMyPage && !isViewingOthers ? '작성한 글이 없어요.' : `${userName || '사용자'}님이 작성한 글이 없어요.`}
                />
            </div>
        );
    }

    return (
        <div className={styles.articleContainer}>
            {titleText && <h2 className={styles.articleTitle}>{titleText}</h2>}
            {allPosts.map((post, index) => (
                <div key={post.id}>
                    <div className={styles.article}>
                        <div className={styles.articleType}>
                            <InfoTag
                                label={post.type === MyPostItemType.FEED ? '게시판' : '자치회'}
                                color="grey"
                            />
                        </div>
                        <FeedPostItem
                            post={post}
                            currentUser={isMyPage ? myProfile : null}
                            userName={userName}
                            userId={userId}
                            userAvatarUrl={userAvatarUrl}
                            currentUserId={currentUser?.id}
                            isMyPage={isMyPage}
                        />
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

/** Feed 타입 포스트 아이템 컴포넌트 */
function FeedPostItem({
    post,
    currentUser,
    userName,
    userId,
    userAvatarUrl,
    currentUserId,
    isMyPage,
}: {
    post: MyPostItem;
    currentUser?: UserMyProfile | null;
    userName?: string;
    userId?: string;
    userAvatarUrl?: string | null;
    currentUserId?: string;
    isMyPage: boolean;
}) {
    // MyPostItem을 FeedPostResponse로 변환
    // 자치회 리포트의 경우 title이 있을 수 있으므로, content가 없으면 title 사용
    const content = post.content || post.title || '';

    // 작성자 정보: API에서 받은 정보가 있으면 사용, 없으면 현재 사용자 정보 또는 전달된 사용자 정보 사용
    let author: PostAuthor | null = null;
    if (post.author) {
        author = post.author;
    } else if (currentUser) {
        author = {
            id: currentUser.id,
            name: currentUser.name,
            avatar_url: currentUser.avatar_url || null,
            is_following: false,
        };
    } else if (userName && userId) {
        // 퍼블릭 프로필의 경우 전달된 사용자 정보 사용
        author = {
            id: userId,
            name: userName,
            avatar_url: userAvatarUrl || null,
            is_following: false,
        };
    }

    // 내 게시글인지 확인 (퍼블릭 프로필 페이지에서 내 게시글인 경우 프로필 상호작용 비활성화)
    // author가 있고, 현재 사용자 ID와 작성자 ID가 일치하면 내 게시글
    const isMyPost = Boolean(
        currentUserId &&
        author?.id &&
        currentUserId === author.id
    );

    // 멘토/퍼블릭 페이지에서는 프로필 상호작용 및 팔로우 버튼 비활성화
    // 마이페이지에서는 내 게시글인 경우만 비활성화
    const disableProfileInteraction = !isMyPage || isMyPost;

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
        author: author,
    };

    // 자치회 리포트인 경우 상세보기 링크를 자치회 리포트 상세로 설정, 더보기 메뉴는 공유만 노출
    const detailHref = post.type === MyPostItemType.COUNCIL_REPORT
        ? `${ROUTES.COMMUNITY.COUNCIL.DETAIL}/${post.id}`
        : undefined;
    const postType = post.type === MyPostItemType.COUNCIL_REPORT ? 'council' : 'feed';

    // 내 게시글이거나 멘토/퍼블릭 페이지인 경우 프로필 상호작용 비활성화
    return (
        <PostCard
            post={feedPost}
            detailHref={detailHref}
            postType={postType}
            disableProfileInteraction={disableProfileInteraction}
        />
    );
}

const styles = {
    articleContainer: cn('pt-4 pb-40'),
    articleTitle: cn('title-16 text-grey-11 px-4'),
    article: cn('flex flex-col py-2.5'),
    articleType: cn('flex items-center px-4'),
    loadMore: cn('px-4 py-4 flex justify-center'),
    loadMoreButton: cn('px-4 py-2 text-grey-9 bg-grey-1-1 rounded-lg'),
};