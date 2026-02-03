import { cn } from "@/utils/cn";
import ActivityCard from "./ActivityCard";

export default function ActivityList() {
    return (
        <div className={styles.container}>
            {Array.from({ length: 9 }).map((_, index) => (
                <ActivityCard key={index} />
            ))}
        </div>
    );
}

const styles = {
    container: cn(
        'grid grid-cols-3 gap-[10px] px-[21px] py-5',
    ),
};