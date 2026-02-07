'use client';

import { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "../common/Button";
import Profile from "./Profile";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileEditContent from "./ProfileEditContent";
import FeedList from "./FeedList";
import { useMyProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";

export default function MypageContent() {
    const { data: profile, isLoading, error } = useMyProfile();
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return (
            <div className={styles.container}>
                {/** 프로필 스켈레톤 */}
                <ProfileSkeleton />
                
                {/** 피드 리스트 (자체적으로 스켈레톤 표시) */}
                <FeedList isMyPage={true} />
            </div>
        );
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
    }

    // 편집 모드
    if (isEditing) {
        return (
            <div className={styles.container}>
                <ProfileEditContent onCancel={() => setIsEditing(false)} />
            </div>
        );
    }

    // 일반 모드
    return (
        <div className={styles.container}>
            {/** 프로필 (내 프로필이므로 모든 정보 표시) */}
            <Profile profile={profile} isMyProfile={true} />

            {/** 마이페이지 : 프로필 편집 */}
            <div className={styles.button} >
                <Button
                    label="프로필 편집"
                    size="L"
                    type="secondary"
                    fullWidth
                    className='bg-grey-1-1'
                    onClick={() => setIsEditing(true)}
                />
            </div>

            {/** OOO님의 글 / 내가 쓴 글 */}
            <FeedList isMyPage={true} userName={profile.name} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-1 flex-col overflow-x-hidden'),
    button: cn('px-4 pb-4'),
}
