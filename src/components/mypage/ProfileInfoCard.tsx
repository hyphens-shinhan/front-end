import { cn } from "@/utils/cn";
import { Icon, IconName } from "../common/Icon";

/** 마이프로필 사용자 정보 아이콘 */
export const PROFILE_INFO_ICON: Record<string, IconName> = {
    SCHOOL: 'IconLBoldTeacher',
    LOCATION: 'IconLBoldLocation',
    EMAIL: 'IconLBoldRsms',
    NOTE: 'IconLBoldNote',
}

interface PropsType {
    icon: keyof typeof PROFILE_INFO_ICON;
    label: string;
}
/**
 * 학교(소속), 위치(설정주소), 이메일, 한줄 소개
 * 개인 설정 가능: 장학 유형, 메일주소, 위치
 */
export default function ProfileInfoCard({ icon, label }: PropsType) {
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <Icon name={PROFILE_INFO_ICON[icon]} />
            </div>
            <p className={styles.label}>{label}</p>
        </div>
    );
}

const styles = {
    container: cn('flex items-start gap-3'),
    iconContainer: cn('w-6 h-6 flex items-center text-grey-9'),
    label: cn('body-6 text-grey-10'),
}
