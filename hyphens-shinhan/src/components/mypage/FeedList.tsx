'use client';

import { cn } from "@/utils/cn";
import { useMemo } from "react";
import React from "react";
import PostCard from "../community/feed/PostCard";
import PostCardSkeleton from "../community/feed/PostCardSkeleton";
import { FeedPostResponse, PostType, MyPostItem, MyPostItemType, PostAuthor } from "@/types/posts";
import InfoTag from "../common/InfoTag";
import Separator from "../common/Separator";
import { useInfiniteMyPosts } from "@/hooks/posts/usePosts";
import { useImageLoadTracking } from "@/hooks/useImageLoadTracking";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { useMyProfile } from "@/hooks/user/useUser";
import type { UserMyProfile } from "@/types/user";

interface FeedListProps {
    isMyPage?: boolean;
    userName?: string;
    userId?: string; // 퍼블릭 페이지일 경우 사용자 ID
    userAvatarUrl?: string | null; // 퍼블릭 페이지일 경우 사용자 프로필 이미지 URL
    hideTitle?: boolean; // 제목 숨김 여부
}

export default function FeedList({ isMyPage = true, userName, userId, userAvatarUrl, hideTitle = false }: FeedListProps) {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMyPosts(20);
    const { data: myProfile } = useMyProfile(); // 현재 사용자 프로필 정보

    const titleText = hideTitle ? null : (isMyPage ? '내가 쓴 글' : `${userName || '사용자'}님의 글`);

    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    // 모든 포스트의 이미지 URL 수집
    const allImageUrls = useMemo(() => {
        return allPosts.flatMap(post => post.image_urls || [])
    }, [allPosts])

    // 이미지 로드 상태 추적
    const { allImagesLoaded } = useImageLoadTracking(allImageUrls)

    // 데이터 로딩 중이거나 이미지가 아직 로드되지 않았으면 로딩 표시
    const isContentLoading = isLoading || (allPosts.length > 0 && !allImagesLoaded)

    if (isContentLoading) {
        return (
            <div className={styles.articleContainer}>
                {titleText && <h2 className={styles.articleTitle}>{titleText}</h2>}
                {Array.from({ length: 5 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.article}>
                            <div className={styles.articleType}>
                            </div>
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
                    message={isMyPage ? '작성한 글이 없어요.' : `${userName || '사용자'}님이 작성한 글이 없어요.`}
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

/** Feed 타입 포스트 아이템 (게시판 + 자치회 리포트 모두 동일 컴포넌트 사용) */
function FeedPostItem({ 
    post, 
    currentUser,
    userName,
    userId,
    userAvatarUrl
}: { 
    post: MyPostItem; 
    currentUser?: UserMyProfile | null;
    userName?: string;
    userId?: string;
    userAvatarUrl?: string | null;
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

    // 자치회 리포트인 경우 상세보기 링크를 자치회 리포트 상세로 설정
    const detailHref = post.type === MyPostItemType.COUNCIL_REPORT
        ? `${ROUTES.COMMUNITY.COUNCIL.DETAIL}/${post.id}`
        : undefined;

    return <PostCard post={feedPost} detailHref={detailHref} disableProfileInteraction={true} />;
}

const styles = {
    articleContainer: cn('pt-4 pb-40'),
    articleTitle: cn('title-16 text-grey-11 px-4'),
    article: cn('flex flex-col py-2.5'),
    articleType: cn('flex items-center px-4'),
    loadMore: cn('px-4 py-4 flex justify-center'),
    loadMoreButton: cn('px-4 py-2 text-grey-9 bg-grey-1-1 rounded-lg'),
}