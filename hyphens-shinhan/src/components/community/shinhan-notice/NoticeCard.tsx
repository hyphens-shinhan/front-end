import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";

/** 신한 장학재단 공지 카드 컴포넌트
 * TODO: api 호출해서 데이터를 카드에 뿌려줘야 함
 * @returns {React.ReactNode} 신한 장학재단 공지 카드 컴포넌트
 * @example
 * <NoticeCard />
 */
export default function NoticeCard() {
    return (
        <article className={styles.container}>
            {/** 제목과 핀 아이콘, N 아이콘 */}
            <header className={styles.titleContainer}>
                <h3 className={styles.title}>2025년 상반기 장학금 신청 안내</h3>
                <Icon name='IconLBoldPin' size={20} className={styles.pinIcon} />
            </header>

            {/** 본문 내용 */}
            <p className={styles.content}>2025년 상반기 장학금 신청 시작! 신청 기간은 2025년 1월 1일부터 1월 31일까지입니다. 자세한 내용은 첨부된 파일을 확인해주세요.</p>

            {/** 첨부 파일 */}
            <div className={styles.attachmentContainer}>
                <Icon name='IconMBoldDocumentText' />
                2025_상반기_장학금_신청안내.pdf
            </div>

            {/** 조회수와 작성일 */}
            <div className={styles.infoContainer}>
                <time>2024.12.15</time>
                <p>조회수 391</p>
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-3.5',
        'px-4 pt-6 pb-3',
    ),
    titleContainer: cn(
        'flex items-center gap-1',
    ),
    title: cn(
        'title-18',
    ),
    pinIcon: cn(
        'text-grey-9',
    ),
    content: cn(
        'body-8 text-grey-11',
        'line-clamp-2',
    ),
    attachmentContainer: cn(
        'flex items-center gap-2.5',
        'bg-grey-2 rounded-[6px] border border-grey-3',
        'body-8 text-grey-9',
        'px-3 py-2',
    ),
    infoContainer: cn(
        'flex items-center gap-4',
        'font-caption-caption4 text-grey-8',
    ),
};