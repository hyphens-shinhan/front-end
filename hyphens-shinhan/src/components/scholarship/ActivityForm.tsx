import { cn } from "@/utils/cn";
import ActivityBanner from "./ActivityBanner";

export type ActivityFormItem = {
    id: string;
    title: string;
    dateLabel: string;
    status: 'inProgress' | 'scheduled' | 'completed' | 'beforeStart';
};

interface ActivityFormProps {
    title: string;
    /** 연동 시 목록이 있으면 배너로 렌더링, 없으면 빈 영역 또는 기본 배너 */
    items?: ActivityFormItem[];
}

export default function ActivityForm({ title, items }: ActivityFormProps) {
    const list = items?.length ? items : [];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            {list.length > 0 ? (
                list.map((item) => (
                    <ActivityBanner
                        key={item.id}
                        title={item.title}
                        dateLabel={item.dateLabel}
                        status={item.status}
                    />
                ))
            ) : (
                <>
                    <ActivityBanner />
                    <ActivityBanner />
                    <ActivityBanner />
                    <ActivityBanner />
                </>
            )}
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-3 px-4',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
};