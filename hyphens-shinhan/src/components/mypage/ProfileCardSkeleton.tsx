import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/common/Skeleton";

/** 마이페이지 프로필 카드 스켈레톤
 * @returns {React.ReactNode} 프로필 카드 로딩 스켈레톤
 * @example
 * <ProfileCardSkeleton />
 */
export default function ProfileCardSkeleton() {
    return (
        <Skeleton.Container className={styles.container}>
            {/** 프로필 이미지 스켈레톤 */}
            <Skeleton.Circle className="w-20 h-20" />

            {/** 이름과 태그 영역 스켈레톤 */}
            <div className={styles.infoContainer}>
                {/** 이름 스켈레톤 */}
                <Skeleton.Box className="w-24 h-6" />
                {/** 태그들 스켈레톤 */}
                <div className={styles.infoTags}>
                    <Skeleton.Tag className="w-12 h-6" />
                    <Skeleton.Tag className="w-16 h-6" />
                    <Skeleton.Tag className="w-20 h-6" />
                </div>
            </div>
        </Skeleton.Container>
    );
}

const styles = {
    container: cn("flex gap-6 items-center"),
    infoContainer: cn("flex flex-col gap-3"),
    infoTags: cn("flex gap-1.5"),
};
