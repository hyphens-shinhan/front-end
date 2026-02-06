import { cn } from "@/utils/cn";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileCard from "./ProfileCard";
import type { UserMyProfile, UserPublicProfile } from "@/types/user";

interface ProfileProps {
    profile: UserMyProfile | UserPublicProfile;
}

/** 마이프로필 사용자 정보 카드 컴포넌트 
 * 프로필 카드, 사용자 정보
*/
export default function Profile({ profile }: ProfileProps) {
    return (
        <div className={styles.container}>
            {/** 프로필 카드 */}
            <ProfileCard profile={profile} />

            {/** 사용자 정보 카드 */}
            <div className={styles.InfoCardContainer}>
                {profile.affiliation && (
                    <ProfileInfoCard icon="SCHOOL" label={profile.affiliation} />
                )}
                {profile.location && (
                    <ProfileInfoCard icon="LOCATION" label={profile.location} />
                )}
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
