import { useEffect } from "react";
import InfoTag from "../common/InfoTag";
import { cn } from "@/utils/cn";
import type { UserMyProfile, UserPublicProfile } from "@/types/user";
import { AppRole, ScholarshipType } from "@/types/user";
import Avatar from "../common/Avatar";
import { Icon } from "../common/Icon";

const DEFAULT_AVATAR_SIZE = 80;

interface ProfileCardProps {
    profile: UserMyProfile | UserPublicProfile;
    /** 내 프로필인지 여부 (내 프로필이면 모든 정보 표시) */
    isMyProfile?: boolean;
    /** 편집 아이콘 표시 여부 */
    showEditIcon?: boolean;
    /** 편집 아이콘 클릭 핸들러 */
    onEditClick?: () => void;
    /** 프로필 이미지 URL 오버라이드 (미리보기용) */
    avatarUrl?: string | null;
    /** 프로필 이미지 크기(px). 기본 80 */
    avatarSize?: number;
    /** 이미지와 정보 영역 사이 갭(px). 기본 24 */
    gap?: number;
}

/** 역할 표시 라벨 매핑 */
const ROLE_LABELS: Record<AppRole, string> = {
    YB: 'YB',
    YB_LEADER: 'YB 리더',
    OB: 'OB',
    MENTOR: '멘토',
    ADMIN: '관리자',
};

/** 장학 유형 표시 라벨 매핑 */
const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
    GENERAL: '일반장학',
    VETERAN_CHILD: '국가유공자자녀',
    SELF_RELIANCE: '자립',
    LAW_SCHOOL: '로스쿨',
    EXCHANGE_STUDENT: '교환학생',
    LEADER_DEVELOPMENT: '리더십',
};

/** 마이페이지 프로필 카드 컴포넌트
 * 마이프로필, 퍼블릭 프로필에서 사용
 * - 내 프로필: 모든 정보 표시
 * - 다른 사용자 프로필: 공개 설정에 따라 필터링된 정보만 표시 (API에서 이미 필터링됨)
 */
export default function ProfileCard({
    profile,
    isMyProfile = false,
    showEditIcon = false,
    onEditClick,
    avatarUrl,
    avatarSize = DEFAULT_AVATAR_SIZE,
    gap,
}: ProfileCardProps) {
    const roleLabel = ROLE_LABELS[profile.role] || profile.role;
    const scholarshipLabel = profile.scholarship_type
        ? SCHOLARSHIP_TYPE_LABELS[profile.scholarship_type]
        : null;

    // avatarUrl이 제공되면 그것을 사용, 없으면 profile.avatar_url 사용
    const displayAvatarUrl = avatarUrl !== undefined ? avatarUrl : profile.avatar_url;

    // 디버깅용
    useEffect(() => {
        console.log('ProfileCard - avatarUrl prop:', avatarUrl);
        console.log('ProfileCard - profile.avatar_url:', profile.avatar_url);
        console.log('ProfileCard - displayAvatarUrl:', displayAvatarUrl);
    }, [avatarUrl, profile.avatar_url, displayAvatarUrl]);

    return (
        <div
            className={styles.container}
            style={gap !== undefined ? { gap: `${gap}px` } : undefined}
        >
            {/** 프로필 이미지 */}
            <div
                className={styles.imageWrapper}
                style={{ width: avatarSize, height: avatarSize }}
            >
                <Avatar
                    src={displayAvatarUrl}
                    alt={profile.name}
                    width={avatarSize}
                    height={avatarSize}
                    containerClassName={cn(styles.imageContainer, '!w-full !h-full')}
                    className={styles.image}
                />
                {showEditIcon && (
                    <button
                        type="button"
                        onClick={onEditClick}
                        className={styles.editButton}
                        aria-label="프로필 이미지 수정"
                    >
                        <Icon name="IconMBoldEdit2" className={styles.editIcon} />
                    </button>
                )}
            </div>
            {/** 이름과 역할, 장학 유형, 기수 정보 표시 */}
            <div className={styles.infoContainer}>
                <h2 className={styles.name}>{profile.name}</h2>
                <div className={styles.infoTags}>
                    <InfoTag label={roleLabel} color="middleBlue" />
                    {/** 장학 정보: 공개 설정에 따라 표시 (API에서 이미 필터링됨) */}
                    {profile.scholarship_batch && (
                        <InfoTag label={`${profile.scholarship_batch}기`} color="yellow" />
                    )}
                    {scholarshipLabel && (
                        <InfoTag label={scholarshipLabel} color="green" />
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: cn("flex gap-6 items-center"),
    imageWrapper: cn("relative"),
    imageContainer: cn("w-20 h-20 rounded-full bg-grey-8 overflow-hidden relative"),
    image: cn("w-full h-full object-cover"),
    editButton: cn(
        "absolute bottom-0 right-0",
        "w-7 h-7 rounded-[14px] bg-grey-9",
        "flex items-center justify-center",
        "hover:bg-grey-8 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary-shinhanroyal focus:ring-offset-2"
    ),
    editIcon: cn("w-5 h-5 text-white"),
    name: cn("body-1 font-bold text-grey-11"),
    infoContainer: cn("flex flex-col gap-3"),
    infoTags: cn("flex gap-1.5"),
}