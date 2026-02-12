'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import Button from "../common/Button";
import Profile from "./Profile";
import FeedList from "./FeedList";
import { usePublicProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { useUserStore, useHeaderStore } from "@/stores";
import { AppRole } from "@/types";
import { useFollow, useFollowStatus, useUnfollow, useFollowRequests, useAcceptFollowRequest } from "@/hooks/follows/useFollows";

interface PublicProfileContentProps {
    userId: string;
    /** 멘토뷰 모드: 팔로우 수락/채팅 버튼만 표시 */
    mentorView?: boolean;
}

/** 다른 유저의 퍼블릭 프로필 컨텐츠 */
export default function PublicProfileContent({ userId, mentorView = false }: PublicProfileContentProps) {
    const router = useRouter();
    const { data: profile, isLoading, error } = usePublicProfile(userId);
    const currentUser = useUserStore((s) => s.user);
    const isMyProfile = currentUser?.id === userId;
    const { setCustomTitle, resetHandlers } = useHeaderStore();
    const followMutation = useFollow();
    const unfollowMutation = useUnfollow();
    const { data: followStatus } = useFollowStatus(userId);
    const isFollowing = followStatus?.is_following ?? false;
    /** 요청만 보냄, 수락 대기 중 */
    const isRequestPending = followStatus?.status === 'PENDING';

    // 멘토뷰: 멘티가 보낸 팔로우 요청 확인
    const { data: followRequestsData } = useFollowRequests();
    const pendingRequest = mentorView
        ? followRequestsData?.requests?.find((r) => r.requesterId === userId)
        : null;
    const acceptFollowRequest = useAcceptFollowRequest();

    // 헤더 제목을 "프로필"로 설정
    useEffect(() => {
        setCustomTitle('프로필');
        return () => {
            setCustomTitle(null);
            resetHandlers();
        };
    }, [setCustomTitle, resetHandlers]);

    // MENTOR 인 경우 멘토 상세 페이지로 이동
    useEffect(() => {
        if (!profile) return;

        if (profile.role === AppRole.MENTOR) {
            router.replace(`${ROUTES.MENTORS.MAIN}/${profile.id}`);
        }
    }, [profile, router]);

    // 프로필 리다이렉트 중이거나 로딩 중일 때
    if (isLoading || (!error && profile && profile.role === AppRole.MENTOR)) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
    }

    return (
        <div className={styles.container}>
            {/** 프로필 (공개 설정에 따라 필터링된 정보만 표시) */}
            <Profile profile={profile} isMyProfile={isMyProfile} />

            {/** 멘토뷰: 팔로우 수락 / 채팅하기 */}
            {!isMyProfile && mentorView && (
                <div className={styles.button}>
                    {isFollowing ? (
                        <Button
                            label="채팅하기"
                            size="L"
                            type="primary"
                            fullWidth
                            onClick={() => router.push(`${ROUTES.CHAT}/${userId}`)}
                        />
                    ) : pendingRequest ? (
                        <Button
                            label="팔로우 수락"
                            size="L"
                            type="primary"
                            fullWidth
                            onClick={() => acceptFollowRequest.mutate(pendingRequest.id)}
                        />
                    ) : null}
                </div>
            )}

            {/** 퍼블릭 페이지 : 팔로우 요청 / 팔로우 요청됨(클릭 시 요청 취소) / 팔로우 취소 */}
            {!isMyProfile && !mentorView && (
                <div className={styles.button}>
                    {isFollowing ? (
                        <div className={styles.buttonRow}>
                            <Button
                                label="팔로우 취소"
                                size="L"
                                type="secondary"
                                fullWidth
                                className="bg-grey-1-1"
                                onClick={() => unfollowMutation.mutate(userId)}
                            />
                            <Button
                                label="채팅하기"
                                size="L"
                                type="primary"
                                fullWidth
                                onClick={() => router.push(`${ROUTES.CHAT}/${userId}`)}
                            />
                        </div>
                    ) : isRequestPending ? (
                        <Button
                            label="팔로우 요청됨"
                            size="L"
                            type="secondary"
                            fullWidth
                            className="bg-grey-1-1 opacity-90"
                            onClick={() => unfollowMutation.mutate(userId)}
                        />
                    ) : (
                        <Button
                            label="팔로우 요청"
                            size="L"
                            type="secondary"
                            fullWidth
                            className="bg-grey-1-1"
                            onClick={() => followMutation.mutate(userId)}
                        />
                    )}
                </div>
            )}

            {/** OOO님의 글 */}
            <FeedList
                isMyPage={false}
                userName={profile.name}
                userId={userId}
                userAvatarUrl={profile.avatar_url}
                postsUserId={userId}
            />
        </div>
    );
}

const styles = {
    container: cn('flex flex-1 flex-col overflow-x-hidden'),
    button: cn('px-4 pb-4'),
    buttonRow: cn('flex gap-2'),
}
