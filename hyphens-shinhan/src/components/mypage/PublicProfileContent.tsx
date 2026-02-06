'use client';

import { cn } from "@/utils/cn";
import Button from "../common/Button";
import Profile from "./Profile";
import FeedList from "./FeedList";
import { usePublicProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { useUserStore } from "@/stores";

interface PublicProfileContentProps {
    userId: string;
}

/** 다른 유저의 퍼블릭 프로필 컨텐츠 */
export default function PublicProfileContent({ userId }: PublicProfileContentProps) {
    const { data: profile, isLoading, error } = usePublicProfile(userId);
    const currentUser = useUserStore((s) => s.user);
    const isMyProfile = currentUser?.id === userId;

    if (isLoading) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message="프로필을 불러올 수 없어요." />;
    }

    return (
        <div className={styles.container}>
            {/** 프로필 */}
            <Profile profile={profile} />

            {/** 퍼블릭 페이지 : 팔로우 요청 */}
            {!isMyProfile && (
                <div className={styles.button}>
                    <Button label="팔로우 요청" size="L" type="secondary" fullWidth className='bg-grey-1-1' />
                </div>
            )}

            {/** OOO님의 글 */}
            <FeedList isMyPage={false} userName={profile.name} userId={userId} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-1 flex-col overflow-x-hidden'),
    button: cn('px-4 pb-4'),
}
