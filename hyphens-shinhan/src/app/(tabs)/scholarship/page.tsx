import dynamic from "next/dynamic";

const ActivityList = dynamic(
    () => import("@/components/scholarship/ActivityList"),
    {
        loading: () => (
            <div className="flex justify-center items-center py-12">
                <p className="text-grey-9">로딩 중...</p>
            </div>
        ),
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
