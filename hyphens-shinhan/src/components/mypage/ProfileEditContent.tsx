'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { cn } from "@/utils/cn";
import Button from "../common/Button";
import ProfileCard from "./ProfileCard";
import { Icon } from "../common/Icon";
import Toggle from "../common/Toggle";
import { useMyProfile } from "@/hooks/user/useUser";
import { useUpdateMyProfile } from "@/hooks/user/useUserMutations";
import { useMyPrivacy } from "@/hooks/user/useUser";
import { useUpdateMyPrivacy } from "@/hooks/user/useUserMutations";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES, TOAST_MESSAGES } from "@/constants";
import { useAutoResize } from "@/hooks/useAutoResize";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_UPLOAD } from "@/constants/imageUpload";
import { useToast } from "@/hooks/useToast";

/** 프로필 편집 컨텐츠 */
export default function ProfileEditContent({ onCancel }: { onCancel: () => void }) {
    const { data: profile, isLoading, error } = useMyProfile();
    const { data: privacy } = useMyPrivacy();
    const updateProfile = useUpdateMyProfile();
    const updatePrivacy = useUpdateMyPrivacy();
    const toast = useToast();

    // 프로필 이미지 업로드 훅 (단일 이미지)
    const {
        images: avatarImages,
        isUploading: isUploadingAvatar,
        fileInputRef: avatarInputRef,
        handleImageSelect: handleAvatarSelect,
        uploadImages: uploadAvatar,
        clearImages: clearAvatarImages,
    } = useImageUpload({
        maxImages: 1,
        bucket: IMAGE_UPLOAD.BUCKET.AVATARS,
        pathPrefix: '', // 프로필 이미지는 버킷 루트에 저장
    });

    // 프로필 이미지 미리보기 URL (로컬 state로 관리)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        affiliation: profile?.affiliation || '',
        location: profile?.location || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
    });

    // profile이 변경되면 formData 업데이트
    useEffect(() => {
        if (profile) {
            setFormData({
                affiliation: profile.affiliation || '',
                location: profile.location || '',
                email: profile.email || '',
                bio: profile.bio || '',
            });
        }
    }, [profile]);

    const [privacyData, setPrivacyData] = useState({
        is_location_public: privacy?.is_location_public ?? true,
        is_contact_public: privacy?.is_contact_public ?? true,
    });

    const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handlePrivacyToggle = useCallback((field: keyof typeof privacyData, value: boolean) => {
        setPrivacyData(prev => ({ ...prev, [field]: value }));
    }, []);

    // 프로필 이미지 선택 핸들러
    const handleAvatarSelectWrapper = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 즉시 미리보기 URL 생성
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreviewUrl(previewUrl);
            console.log('Preview URL created:', previewUrl);
        }
        // useImageUpload 훅의 핸들러도 호출 (업로드용)
        handleAvatarSelect(e);
    }, [handleAvatarSelect]);

    // 프로필 이미지 변경 핸들러
    const handleEditAvatarClick = useCallback(() => {
        avatarInputRef.current?.click();
    }, [avatarInputRef]);

    const handleSubmit = useCallback(async () => {
        if (!profile) return;

        try {
            let avatarUrl = profile.avatar_url;

            // 프로필 이미지가 선택된 경우 업로드
            if (avatarImages.length > 0) {
                const uploadedUrls = await uploadAvatar();
                if (uploadedUrls.length > 0) {
                    avatarUrl = uploadedUrls[0];
                }
            }

            // 프로필 업데이트 (affiliation은 수정 불가이므로 제외)
            await updateProfile.mutateAsync({
                avatar_url: avatarUrl,
                location: formData.location || null,
                email: formData.email || null,
                bio: formData.bio || null,
            });

            // 프라이버시 설정 업데이트
            await updatePrivacy.mutateAsync({
                is_location_public: privacyData.is_location_public,
                is_contact_public: privacyData.is_contact_public,
            });

            // 정리
            clearAvatarImages();
            if (avatarPreviewUrl) {
                URL.revokeObjectURL(avatarPreviewUrl);
                setAvatarPreviewUrl(null);
            }
            toast.show(TOAST_MESSAGES.PROFILE.SAVE_SUCCESS, { position: 'top-default-header' });
            onCancel();
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            toast.error(TOAST_MESSAGES.PROFILE.SAVE_ERROR);
        }
    }, [profile, formData, privacyData, avatarImages, uploadAvatar, updateProfile, updatePrivacy, onCancel, clearAvatarImages, avatarPreviewUrl, toast]);

    if (isLoading) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.PROFILE} />;
    }

    // 프로필 이미지 미리보기 (로컬 preview가 있으면 그것을, 없으면 기존 프로필 이미지 사용)
    const displayAvatarUrl = useMemo(() => {
        if (avatarPreviewUrl) {
            return avatarPreviewUrl;
        }
        return profile?.avatar_url || null;
    }, [avatarPreviewUrl, profile?.avatar_url]);

    // avatarImages가 업데이트되면 preview URL 동기화
    useEffect(() => {
        if (avatarImages.length > 0 && avatarImages[0].preview) {
            // useImageUpload가 생성한 preview URL 사용
            setAvatarPreviewUrl(avatarImages[0].preview);
        }
    }, [avatarImages]);

    return (
        <div className={styles.container}>
            {/** 숨겨진 파일 input */}
            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelectWrapper}
                className="hidden"
            />

            {/** 프로필 카드 */}
            <ProfileCard
                profile={profile}
                isMyProfile={true}
                showEditIcon={true}
                onEditClick={handleEditAvatarClick}
                avatarUrl={displayAvatarUrl}
            />

            {/** 편집 가능한 정보 카드 */}
            <div className={styles.infoCardContainer}>
                {/** 학교 */}
                <ProfileEditItem
                    icon="SCHOOL"
                    label="학교"
                    value={formData.affiliation}
                    onChange={(value) => handleInputChange('affiliation', value)}
                    placeholder="학교를 입력해주세요"
                    disabled={true}
                />

                {/** 위치 */}
                <ProfileEditItem
                    icon="LOCATION"
                    label="위치"
                    value={formData.location}
                    onChange={(value) => handleInputChange('location', value)}
                    placeholder="자주 활동하는 지역의 주소를 입력해주세요"
                    showToggle={true}
                    toggleChecked={privacyData.is_location_public}
                    onToggleChange={(checked) => handlePrivacyToggle('is_location_public', checked)}
                />

                {/** 이메일 (수정 불가) */}
                <ProfileEditItem
                    icon="EMAIL"
                    label="이메일"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="이메일 주소를 입력해주세요"
                    showToggle={true}
                    toggleChecked={privacyData.is_contact_public}
                    onToggleChange={(checked) => handlePrivacyToggle('is_contact_public', checked)}
                    disabled={true}
                />

                {/** 소개글 */}
                <ProfileEditTextarea
                    icon="NOTE"
                    label="소개글"
                    value={formData.bio}
                    onChange={(value) => handleInputChange('bio', value)}
                    placeholder="관심사, 취미 등 나를 소개하는 글을 작성해보세요"
                    maxLength={100}
                />
            </div>
            {/** 편집 완료 버튼 */}
            <div className={styles.button}>
                <Button
                    label="취소"
                    size="L"
                    type="secondary"
                    fullWidth
                    onClick={onCancel}
                />
                <Button
                    label="편집 완료"
                    size="L"
                    type="secondary"
                    fullWidth
                    className='bg-grey-1-1'
                    onClick={handleSubmit}
                    disabled={updateProfile.isPending || updatePrivacy.isPending}
                />
            </div>
        </div>
    );
}

interface ProfileEditItemProps {
    icon: 'SCHOOL' | 'LOCATION' | 'EMAIL';
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    showToggle?: boolean;
    toggleChecked?: boolean;
    onToggleChange?: (checked: boolean) => void;
    disabled?: boolean;
}

function ProfileEditItem({
    icon,
    label,
    value,
    onChange,
    placeholder,
    showToggle = false,
    toggleChecked = false,
    onToggleChange,
    disabled = false,
}: ProfileEditItemProps) {
    const iconMap = {
        SCHOOL: 'IconLBoldTeacher',
        LOCATION: 'IconLBoldLocation',
        EMAIL: 'IconLBoldRsms',
    } as const;

    return (
        <div className={styles.editItem}>
            <div className={styles.editItemHeader}>
                <div className={styles.labelContainer}>
                    <Icon name={iconMap[icon]} className={styles.icon} />
                    <span className={styles.label}>{label}</span>
                </div>
                {showToggle && (
                    <Toggle
                        checked={toggleChecked}
                        onChange={onToggleChange}
                        aria-label={`${label} 공개 설정`}
                    />
                )}
            </div>
            <div className={cn(
                styles.inputWrapperBase,
                icon === 'SCHOOL' ? 'bg-grey-1-1' : 'bg-grey-1'
            )}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={styles.input}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

interface ProfileEditTextareaProps {
    icon: 'NOTE';
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    maxLength: number;
}

function ProfileEditTextarea({
    icon,
    label,
    value,
    onChange,
    placeholder,
    maxLength,
}: ProfileEditTextareaProps) {
    const { textareaRef, handleResize } = useAutoResize();

    // 초기값이 있을 때 높이 조정
    useEffect(() => {
        handleResize();
    }, [value, handleResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        handleResize();
    };

    return (
        <div className={styles.editItem}>
            <div className={styles.labelContainer}>
                <Icon name="IconLBoldNote" className={styles.icon} />
                <span className={styles.label}>{label}</span>
            </div>
            <div className={styles.textareaWrapper}>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onInput={handleResize}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={styles.textarea}
                    rows={1}
                />
                <span className={styles.charCount}>
                    {value.length}/{maxLength}
                </span>
            </div>
        </div>
    );
}

const styles = {
    container: cn('flex flex-col gap-4.5 p-4'),
    button: cn('pt-10 pb-4 flex gap-3'),
    infoCardContainer: cn('flex flex-col gap-6 py-4'),
    editItem: cn('flex flex-col gap-3'),
    editItemHeader: cn('flex items-center justify-between'),
    labelContainer: cn('flex items-center gap-2'),
    icon: cn('w-6 h-6 text-grey-9'),
    label: cn('body-5 text-grey-11'),
    inputWrapperBase: cn(
        'px-4 py-3 rounded-[16px] border border-grey-3',
        'focus-within:border-primary-secondaryroyal',
    ),
    input: cn(
        'w-full bg-transparent outline-none',
        'body-6 text-grey-11',
        'placeholder:text-grey-7',
    ),
    textareaWrapper: cn('flex flex-col gap-1'),
    textarea: cn(
        'w-full px-4 py-3 rounded-[16px] border border-grey-3',
        'bg-transparent outline-none resize-none',
        'body-6 text-grey-11',
        'placeholder:text-grey-7',
        'focus-within:border-primary-secondaryroyal',
        'scrollbar-hide',
    ),
    charCount: cn('text-right caption-4 text-grey-7'),
};
