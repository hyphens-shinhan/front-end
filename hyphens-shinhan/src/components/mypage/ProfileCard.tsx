import InfoTag from "../common/InfoTag";
import { cn } from "@/utils/cn";
import type { UserMyProfile, UserPublicProfile } from "@/types/user";
import { AppRole, ScholarshipType } from "@/types/user";
import Avatar from "../common/Avatar";

interface ProfileCardProps {
    profile: UserMyProfile | UserPublicProfile;
    /** 내 프로필인지 여부 (내 프로필이면 모든 정보 표시) */
    isMyProfile?: boolean;
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
export default function ProfileCard({ profile, isMyProfile = false }: ProfileCardProps) {
    const roleLabel = ROLE_LABELS[profile.role] || profile.role;
    const scholarshipLabel = profile.scholarship_type
        ? SCHOLARSHIP_TYPE_LABELS[profile.scholarship_type]
        : null;

    return (
        <div className={styles.container}>
            {/** 프로필 이미지 */}
            <Avatar
                src={profile.avatar_url}
                alt={profile.name}
                width={80}
                height={80}
                containerClassName={styles.imageContainer}
                className={styles.image}
            />
            {/** 이름과 역할, 장학 유형, 기수 정보 표시 */}
            <div className={styles.infoContainer}>
                <h2 className={styles.name}>{profile.name}</h2>
                <div className={styles.infoTags}>
                    <InfoTag label={roleLabel} color="blue" />
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
    imageContainer: cn("w-20 h-20 rounded-full bg-grey-8 overflow-hidden relative"),
    image: cn("w-full h-full object-cover"),
    name: cn("body-1 font-bold text-grey-11"),
    infoContainer: cn("flex flex-col gap-3"),
    infoTags: cn("flex gap-1.5"),
}