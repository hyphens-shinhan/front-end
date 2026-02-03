import { cn } from "@/utils/cn";
import StatusTag from "../common/StatusTag";

/** MY활동 월별 활동 카드 컴포넌트 */
export default function ActivityCard() {
    return (
        <div className={styles.container}>
            <p className={styles.month}>4월</p>
            <p className={styles.title}>활동 계획과 규칙</p>
            <StatusTag status="completed" />
        </div>
    );
}

const styles = {
    container: cn(
        'flex w-fit flex-col gap-[7px]',
        'p-3',
        'bg-grey-1-1 rounded-[16px]',
        'border border-grey-2',
    ),
    month: cn('body-1 text-grey-11'),
    title: cn('body-8 text-grey-9 line-clamp-1'),
};