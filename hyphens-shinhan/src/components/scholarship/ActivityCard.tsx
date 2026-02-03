import { cn } from "@/utils/cn";
import StatusTag from "../common/StatusTag";
import { Icon } from "../common/Icon";
import Link from "next/link";
import { ROUTES } from "@/constants";

/** MY활동 월별 활동 카드 컴포넌트 
 * 월, 학업 모니터링 태그, 월별 title, 상태 태그
*/
export default function ActivityCard({ isCurrentMonth, isMonitoring }: { isCurrentMonth: boolean, isMonitoring: boolean }) {
    return (
        <Link href={`${ROUTES.SCHOLARSHIP.REPORT.ACTIVITY}/1`} className={cn(styles.container, isCurrentMonth && styles.currentMonth)}>
            <div className={styles.infoContainer}>
                <p className={styles.month}>4월</p>
                {/** 학업 모니터링 태그 */}
                {isMonitoring && (
                    <div className={styles.monitoringTag}>
                        <Icon name='IconLLineInfoCircle' size={20} />
                    </div>
                )}
            </div>
            <p className={styles.title}>활동 계획과 규칙</p>
            <StatusTag status="completed" />
        </Link>
    );
}

const styles = {
    container: cn(
        'flex w-full aspect-square flex-col justify-between',
        'p-3',
        'bg-grey-1-1 rounded-[16px]',
        'border border-grey-2',
    ),
    infoContainer: cn(
        'flex items-center gap-1.5',
    ),
    currentMonth: cn(
        'bg-grey-1 border-primary-lighter',
    ),
    month: cn('body-1 text-grey-11'),
    title: cn('body-9 text-grey-9 line-clamp-1'),
    monitoringTag: cn(
        'flex items-center gap-1',
        'text-state-yellow',
    ),
};