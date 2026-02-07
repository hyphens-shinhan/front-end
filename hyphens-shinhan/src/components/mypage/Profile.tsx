import { cn } from "@/utils/cn";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileCard from "./ProfileCard";
import type { UserMyProfile, UserPublicProfile } from "@/types/user";

interface ProfileProps {
    profile: UserMyProfile | UserPublicProfile;
    /** 내 프로필인지 여부 (내 프로필이면 모든 정보 표시) */
    isMyProfile?: boolean;
}

/** 마이프로필 사용자 정보 카드 컴포넌트 
 * 프로필 카드, 사용자 정보
 * - 내 프로필: 모든 정보 표시
 * - 다른 사용자 프로필: 공개 설정에 따라 필터링된 정보만 표시 (API에서 이미 필터링됨)
*/
export default function Profile({ profile, isMyProfile = false }: ProfileProps) {
    return (
        <div className={styles.container}>
            {/** 프로필 카드 */}
            <ProfileCard profile={profile} isMyProfile={isMyProfile} />

            {/** 사용자 정보 카드 */}
            <div className={styles.InfoCardContainer}>
                {profile.affiliation && (
                    <ProfileInfoCard icon="SCHOOL" label={profile.affiliation} />
                )}
                {/** 위치 정보: 공개 설정에 따라 표시 (API에서 이미 필터링됨) */}
                {profile.location && (
                    <ProfileInfoCard icon="LOCATION" label={profile.location} />
                )}
                {/** 연락처 정보: 공개 설정에 따라 표시 (API에서 이미 필터링됨) */}
                {profile.email && (
                    <ProfileInfoCard icon="EMAIL" label={profile.email} />
                )}
                {profile.bio && (
                    <ProfileInfoCard icon="NOTE" label={profile.bio} />
                )}
            </div>
        </div>
    );
}

const styles = {
    container: cn('flex flex-col gap-4.5 p-4'),
    InfoCardContainer: cn('flex flex-col gap-2 p-5 border border-grey-2 rounded-[16px]'),
}
