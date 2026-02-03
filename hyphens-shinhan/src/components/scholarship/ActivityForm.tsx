import { cn } from "@/utils/cn";
import ActivityBanner from "./ActivityBanner";

export default function ActivityForm({ title }: { title: string }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <ActivityBanner />
            <ActivityBanner />
            <ActivityBanner />
            <ActivityBanner />
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