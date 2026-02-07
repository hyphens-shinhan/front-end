import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";

export default function InfoRow() {
    return (
        <div className={styles.container}>
            <Icon name='IconLBoldTeacher' />
            <p>홍익대학교</p>
        </div>
    );
}

const styles = {
    container: cn('flex items-center gap-3'),
}
