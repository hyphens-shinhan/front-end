import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import InfoTag from "../common/InfoTag";

/** 소모임 모집글 카드 컴포넌트
 * TODO: api 호출해서 데이터를 카드에 뿌려줘야 함, 파이어 아이콘 디자인 수정 요청 필요
 * @returns {React.ReactNode} 소모임 모집글 카드 컴포넌트
 * @example
 * <GroupCard />
 */
export default function GroupCard() {
    return (
        <div className={styles.container}>
            {/** 태그들 */}
            <div className={styles.tagContainer}>
                <InfoTag label="현재 참여 중" color="blue" />
                <InfoTag label="스터디" color="grey" />
                <InfoTag label="글로벌" color="grey" />
            </div>
            <div className={styles.contentWrapper}>
                {/** 제목, 로고, 본문 내용 */}
                <div className={styles.contentContainer}>
                    {/** 제목과 인기 로고 */}
                    <div className={styles.titleContainer}>
                        <p className={styles.title}>글로벌 리더십 스터디 모임</p>
                        {/** TODO: 인기 소모임인지 여부에 따라 아이콘 표시 */}
                        <Icon name="IconMVectorFire" />
                    </div>
                    {/** 내용 */}
                    <p className={styles.content}>해외 유학이나 취업 관심 있으신 분이면 환영입니다!!! 같이 이야기 나눠요!</p>
                </div>
                {/** 소모임 멤버 미리보기 사진 및 인원수 */}
                <div className={styles.memberPreviewContainer}>
                    <div className={styles.memberPreviewItem}></div>
                    <div className={styles.memberPreviewItem}></div>
                    <div className={styles.memberCountItem}>+81</div>
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
    contentWrapper: cn(
        'flex gap-8',
    ),
    contentContainer: cn(
        'flex flex-col gap-3',
    ),
    titleContainer: cn(
        'flex items-center gap-1',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
    content: cn(
        'body-8 text-grey-11',
        'line-clamp-2',
    ),
    memberPreviewContainer: cn(
        'flex flex-col -space-y-8',
    ),
    memberPreviewItem: cn(
        'w-10 h-10 rounded-full bg-grey-3',
    ),
    memberCountItem: cn(
        'w-10 h-10 rounded-full bg-grey-4',
        'flex items-center justify-center',
        'body-10 font-caption-caption-1 text-grey-8',
    ),
};