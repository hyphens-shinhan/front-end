import dynamic from "next/dynamic";
import ActivityListSkeleton from '@/components/scholarship/ActivityListSkeleton'

const ActivityList = dynamic(
    () => import("@/components/scholarship/ActivityList"),
    {
        loading: () => <ActivityListSkeleton />,
        ssr: true,
    }
);

/** MY활동 페이지 */
export default function ScholarshipPage() {
    return (
        <div>
            <ActivityList />
        </div>
    );
}
