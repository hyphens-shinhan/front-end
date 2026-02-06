import InfoTag from "../common/InfoTag";
import { cn } from "@/utils/cn";

/** 마이페이지 프로필 카드 컴포넌트
 * 마이프로필, 퍼블릭 프로필에서 사용
 */
export default function ProfileCard() {
    return (
        <div className={styles.container}>
            {/** 프로필 이미지 */}
            <div className={styles.imageContainer}>
                {/* <Image src={profileImage ?? ''} alt="profile" width={20} height={20} /> */}
            </div>
            {/** 이름과 역할, 장학 유형, 기수 정보 표시 */}
            <div className={styles.infoContainer}>
                <h2 className={styles.name}>오시온</h2>
                <div className={styles.infoTags}>
                    <InfoTag label="YB 리더" color="blue" />
                    <InfoTag label="1기" color="yellow" />
                    <InfoTag label="일반장학" color="green" />
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: cn("flex gap-6 items-center"),
    imageContainer: cn("w-20 h-20 rounded-full bg-grey-8"),
    name: cn("body-1 font-bold text-grey-11"),
    infoContainer: cn("flex flex-col gap-3"),
    infoTags: cn("flex gap-1.5"),
}