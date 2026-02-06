import { cn } from "@/utils/cn";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import ProfileInfoCardSkeleton from "./ProfileInfoCardSkeleton";

/** 마이페이지 프로필 스켈레톤
 * @returns {React.ReactNode} 프로필 로딩 스켈레톤
 * @example
 * <ProfileSkeleton />
 */
export default function ProfileSkeleton() {
    return (
        <div className={styles.container}>
            {/** 프로필 카드 스켈레톤 */}
            <ProfileCardSkeleton />

            {/** 사용자 정보 카드 스켈레톤 */}
            <div className={styles.InfoCardContainer}>
                <ProfileInfoCardSkeleton />
                <ProfileInfoCardSkeleton />
                <ProfileInfoCardSkeleton />
            </div>
        </div>
    );
}

const styles = {
    container: cn('flex flex-col gap-4.5 p-4'),
    InfoCardContainer: cn('flex flex-col gap-2 p-5 border border-grey-2 rounded-[16px]'),
};
