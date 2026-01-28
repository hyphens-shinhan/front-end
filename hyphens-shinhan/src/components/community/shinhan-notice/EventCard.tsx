import { cn } from "@/utils/cn";
import { Icon } from "@/components/common/Icon";
import InfoTag from "@/components/common/InfoTag";

/** 이벤트 카드 컴포넌트
 * TODO: api 호출해서 데이터를 카드에 뿌려줘야 함
 * @returns {React.ReactNode} 이벤트 카드 컴포넌트
 * @example
 * <EventCard />
 */
export default function EventCard() {
    return (
        <div className={styles.container}>
            {/** 태그들 */}
            <div className={styles.tagContainer}>
                <InfoTag label="멘토링" color="blue" />
                <InfoTag label="모집중" color="green" />
            </div>

            {/** 제목, 로고, 본문 내용 */}
            <div className={styles.contentContainer}>
                {/** 제목과 인기 로고 */}
                <p className={styles.title}>멘토링 세션 : 창업가와의 대화</p>
                {/** 내용 */}
                <p className={styles.content}>
                    성공한 창업가들과 대화할 수 있는 좋은 기회! '창업가와의 대화' 멘토링 세션에 참가해보세요.
                    창업 경험, 실패와 성공 사례에 대한 이야기와 질의응답, 조언을 들을 수 있는 특별한 기회입니다.
                </p>
            </div>

            {/** 시간, 진행방식, 인원수 */}
            <div className={styles.infoContainer}>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldCalendar' />
                    <p>2026.01.23 14:00~16:00</p>
                </div>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldLocation' />
                    <p>온라인 (Zoom)</p>
                </div>
                <div className={styles.infoItem}>
                    <Icon name='IconLBoldProfile2user' />
                    <p>42 / 50명 </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col gap-4',
        'px-4 py-5'
    ),
    tagContainer: cn(
        'flex gap-1.5',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
    content: cn(
        'body-8 text-grey-11',
    ),
    infoContainer: cn(
        'flex flex-col gap-2.5',
    ),
    infoItem: cn(
        'flex gap-2',
        'text-grey-9 body-8',
    ),
};