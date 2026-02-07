'use client';

import { cn } from "@/utils/cn";
import FeedList from "./FeedList";
import { useMyProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";

/** 내가 스크랩한 글 컨텐츠 */
export default function MypageSettingScrapContent() {
    const { data: profile, isLoading, error } = useMyProfile();

    if (isLoading) {
        return (
            <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
        );
    }

    if (error || !profile) {
        return (
            <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />
        );
    }

    return (
        <div className={styles.container}>
            <FeedList isMyPage={false} userName={profile.name} userId={profile.id} hideTitle={true} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-col'),
};
