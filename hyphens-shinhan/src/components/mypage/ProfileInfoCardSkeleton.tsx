import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 마이페이지 프로필 정보 카드 스켈레톤
 * @returns {React.ReactNode} 프로필 정보 카드 로딩 스켈레톤
 * @example
 * <ProfileInfoCardSkeleton />
 */
export default function ProfileInfoCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 아이콘 스켈레톤 */}
            <Skeleton.Box className="w-6 h-6 rounded" />
            {/** 라벨 스켈레톤 */}
            <Skeleton.Box className="w-48 h-5 rounded" />
        </Skeleton.Container>
    );
}

const styles = {
    container: cn('flex items-start gap-3'),
};
