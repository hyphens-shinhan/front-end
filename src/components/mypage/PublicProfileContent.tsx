'use client';

import { useEffect } from "react";
import { cn } from "@/utils/cn";
import Button from "../common/Button";
import Profile from "./Profile";
import FeedList from "./FeedList";
import { usePublicProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { useUserStore, useHeaderStore } from "@/stores";

interface PublicProfileContentProps {
    userId: string;
}

/** 다른 유저의 퍼블릭 프로필 컨텐츠 */
export default function PublicProfileContent({ userId }: PublicProfileContentProps) {
    const { data: profile, isLoading, error } = usePublicProfile(userId);
    const currentUser = useUserStore((s) => s.user);
    const isMyProfile = currentUser?.id === userId;
    const { setCustomTitle, resetHandlers } = useHeaderStore();

    // 헤더 제목을 "프로필"로 설정
    useEffect(() => {
        setCustomTitle('프로필');
        return () => {
            setCustomTitle(null);
            resetHandlers();
        };
    }, [setCustomTitle, resetHandlers]);

    if (isLoading) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
    }

    return (
        <div className={styles.container}>
            {/** 프로필 (공개 설정에 따라 필터링된 정보만 표시) */}
            <Profile profile={profile} isMyProfile={isMyProfile} />

            {/** 퍼블릭 페이지 : 팔로우 요청 */}
            {!isMyProfile && (
                <div className={styles.button}>
                    <Button label="팔로우 요청" size="L" type="secondary" fullWidth className='bg-grey-1-1' />
                </div>
            )}

            {/** OOO님의 글 */}
            <FeedList 
                isMyPage={false} 
                userName={profile.name} 
                userId={userId}
                userAvatarUrl={profile.avatar_url}
            />
        </div>
    );
}

const styles = {
    container: cn('flex flex-1 flex-col overflow-x-hidden'),
    button: cn('px-4 pb-4'),
}
