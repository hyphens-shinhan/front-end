import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

/** 체크 아이콘 
 * @param isChecked - 체크 여부
*/
export default function CheckIcon({ isChecked = false }: { isChecked: boolean }) {
    return (
        <div className={styles.container}>
            <Icon name='IconMBoldTickCircle' className={cn(styles.icon, isChecked && styles.checked)} />
        </div>
    )
}

const styles = {
    container: cn('flex items-center justify-center'),
    checked: cn('text-primary-secondarysky'),
    icon: cn('text-grey-4'),
}