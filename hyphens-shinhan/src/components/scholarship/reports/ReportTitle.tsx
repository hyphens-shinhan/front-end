import CheckIcon from "@/components/common/Icon/Check";
import { cn } from "@/utils/cn";

interface ReportTitleProps {
    /** 제목 */
    title: string
    /** 체크 아이콘 표시 여부 */
    checkIcon?: boolean
    /** 체크 여부 */
    isChecked?: boolean
}
/** 활동 정보 제목 컴포넌트
 * @param title - 제목
 * @param checkIcon - 체크 아이콘 표시 여부 (기본값: false)
 * @param isChecked - 체크 여부 (기본값: false)
 * - ob 작성 페이지에서는 체크 표시 활성화
 * - yb, yb와 ob 완료 페이지에서는 체크 표시 비활성화
*/
export default function ReportTitle({ title, checkIcon = false, isChecked = false }: ReportTitleProps) {
    return (
        <div className={styles.container}>
            {/** 제목 */}
            <h2 className={styles.title}>{title}</h2>
            {/** 체크 표시 
             * 작성이 완료되면 isChecked를 true로 변경
             * 작성이 완료되지 않으면 isChecked를 false로 변경
            */}
            {checkIcon && (
                <CheckIcon isChecked={isChecked} />
            )}
        </div>
    )
}

const styles = {
    container: cn('flex gap-1.5 py-3'),
    title: cn('title-16 text-grey-11'),
}