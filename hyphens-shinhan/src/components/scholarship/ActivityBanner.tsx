import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import InfoTag from "../common/InfoTag";

/** MY활동 연간 필수 활동, 내가 신청한 프로그램 배너 컴포넌트 */
export default function ActivityBanner() {
    return (
        <div className={styles.container}>
            {/** 제목과 상태 태그, 날짜*/}
            <div className={styles.infoContainer}>
                <div className={styles.titleContainer}>
                    <p className={styles.title}>학업계획서 제출</p>
                    <InfoTag label="참여 예정" color="blue" />
                </div>

                {/** 날짜 */}
                <time className={styles.date}>2025.01.01 ~ 2025.12.31</time>
            </div>

            {/** 자세히 보기 버튼 */}
            <button className={styles.button}>
                <Icon name="IconLLineArrowRight" size={24} />
            </button>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-colitems-center',
        'px-5 py-4',
        'border border-grey-2 rounded-[16px]',
    ),
    infoContainer: cn(
        'flex flex-col gap-1',
    ),
    titleContainer: cn(
        'flex gap-[9px]',
    ),
    title: cn(
        'body-5 text-grey-11 line-clamp-1',
    ),
    statusContainer: cn(
        'mb-auto',
    ),
    button: cn(
        'flex ml-auto items-center justify-center text-grey-9',
    ),
    date: cn(
        'font-caption-caption4 text-grey-9',
    ),
};