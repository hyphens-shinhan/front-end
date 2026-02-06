'use client';

import { cn } from "@/utils/cn";
import { useMyPrivacy } from "@/hooks/user/useUser";
import { useUpdateMyPrivacy } from "@/hooks/user/useUserMutations";
import Toggle from "@/components/common/Toggle";
import EmptyContent from "@/components/common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { useState, useCallback } from "react";
import type { UserPrivacySettings } from "@/types/user";

/** 개인정보 설정 컨텐츠 */
export default function MypageSettingPrivacyContent() {
    const { data: privacy, isLoading, error } = useMyPrivacy();
    const updatePrivacy = useUpdateMyPrivacy();

    const [localState, setLocalState] = useState<UserPrivacySettings | null>(null);

    // 로컬 상태가 있으면 사용, 없으면 서버 데이터 사용
    const currentState = localState || privacy;

    const handleToggle = useCallback((
        key: keyof UserPrivacySettings,
        value: boolean
    ) => {
        if (!privacy) return;

        // 로컬 상태 업데이트
        const newState: UserPrivacySettings = {
            ...(localState || privacy),
            [key]: value,
        };
        setLocalState(newState);

        // API 호출
        updatePrivacy.mutate({
            [key]: value,
        });
    }, [privacy, localState, updatePrivacy]);

    if (isLoading) {
        return (
            <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
        );
    }

    if (error || !privacy) {
        return (
            <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PRIVACY} />
        );
    }

    // privacy가 있으면 currentState도 항상 존재함 (타입 가드)
    const safeCurrentState = currentState || privacy;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>개인정보 공개 설정</h1>
                <p className={styles.description}>
                    다른 사용자에게 공개할 정보를 선택할 수 있어요.
                </p>
            </div>

            <div className={styles.settingsList}>
                <SettingItem
                    label="위치 정보"
                    description="내 위치 정보를 다른 사용자에게 공개합니다."
                    checked={safeCurrentState.is_location_public}
                    onChange={(checked) => handleToggle('is_location_public', checked)}
                    disabled={updatePrivacy.isPending}
                />
                <SettingItem
                    label="연락처 정보"
                    description="이메일 등 연락처 정보를 다른 사용자에게 공개합니다."
                    checked={safeCurrentState.is_contact_public}
                    onChange={(checked) => handleToggle('is_contact_public', checked)}
                    disabled={updatePrivacy.isPending}
                />
                <SettingItem
                    label="장학 정보"
                    description="장학금 수혜 내역 등 장학 정보를 다른 사용자에게 공개합니다."
                    checked={safeCurrentState.is_scholarship_public}
                    onChange={(checked) => handleToggle('is_scholarship_public', checked)}
                    disabled={updatePrivacy.isPending}
                />
                <SettingItem
                    label="팔로워 목록"
                    description="내 팔로워 목록을 다른 사용자에게 공개합니다."
                    checked={safeCurrentState.is_follower_public}
                    onChange={(checked) => handleToggle('is_follower_public', checked)}
                    disabled={updatePrivacy.isPending}
                />
            </div>
        </div>
    );
}

interface SettingItemProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

function SettingItem({ label, description, checked, onChange, disabled }: SettingItemProps) {
    return (
        <div className={styles.settingItem}>
            <div className={styles.settingContent}>
                <h3 className={styles.settingLabel}>{label}</h3>
                <p className={styles.settingDescription}>{description}</p>
            </div>
            <Toggle
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                aria-label={label}
            />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col',
        'px-4 py-6',
    ),
    header: cn(
        'flex flex-col gap-2',
        'mb-6',
    ),
    title: cn(
        'title-20 text-grey-11',
    ),
    description: cn(
        'body-8 text-grey-7',
    ),
    settingsList: cn(
        'flex flex-col gap-6',
    ),
    settingItem: cn(
        'flex items-start justify-between gap-4',
        'py-2',
    ),
    settingContent: cn(
        'flex flex-col gap-1',
        'flex-1 min-w-0',
    ),
    settingLabel: cn(
        'title-16 text-grey-11',
    ),
    settingDescription: cn(
        'body-8 text-grey-7',
    ),
};
