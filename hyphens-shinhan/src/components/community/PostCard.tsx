import { Icon } from "../common/Icon";
import { cn } from "@/utils/cn";
import FollowButton from "./FollowButton";
import MoreButton from "./MoreButton";

/** 커뮤니티 게시글 카드
 * - 나와 친구인지에 따라 팔로우 버튼 노출 여부 결정
 * - 익명인지에 따라 유저 이름 노출 여부 결정
 * - 사진 첨부에 따라 이미지 영역 노출 여부 결정
 * - ㄴ 사진 개수에 따라 이미지 버튼 노출 여부 결정
 * @example
 * <PostCard />
 */
export default function PostCard() {
    return (
        <article className={styles.container}>
            {/** 유저 프로필 사진 */}
            <div className={styles.userProfileWrapper}>
                {/** TODO: 사진 추가 */}
                <div className={styles.followButton}>
                    <FollowButton type="addIcon" />
                </div>
            </div>

            {/** 유저 정보, 본문 영역 */}
            <div className={styles.postContent}>
                {/** 유저 이름, 시간, 팔로우 버튼, 더보기 버튼 */}
                <div className={styles.infoWrapper}>
                    {/** 유저 이름 */}
                    <h3 className={styles.userName}>오시온</h3>
                    {/** 시간 */}
                    <time className={styles.time}>12월 14일 12:20</time>
                    {/** 팔로우 버튼, 더보기 버튼 */}
                    <div className={styles.moreButtonWrapper}>
                        <MoreButton />
                    </div>
                </div>
                {/** 중앙: 이미지/본문 영역 */}
                <div className={styles.contentWrapper}>
                    <p className={styles.contentText}>2025년 상반기 장학금 신청 시작! 신청 기간은 2025년 1월 1일부터 1월 31일까지입니다. 자세한 내용은 첨부된 파일을 확인해주세요.</p>
                    {/** 이미지 영역 */}
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageItem} />
                        <div className={styles.imageItem} />
                        <div className={styles.imageMoreButton}>+2</div>
                    </div>
                </div>

                {/** 좋아요 버튼, 댓글 버튼 */}
                <footer className={styles.footerWrapper}>
                    {/** 좋아요 버튼 */}
                    <div className={styles.footerButton}>
                        <Icon name='IconMBoldHeart' />
                        <span className={styles.footerButtonText}>18</span>
                    </div>
                    {/** 댓글 버튼 */}
                    <div className={styles.footerButton}><Icon name='IconMBoldMessageText' />
                        <span className={styles.footerButtonText}>9</span>
                    </div>
                </footer>
            </div>
        </article>
    );
}

const styles = {
    container: cn(
        'w-full flex flex-row',
        'bg-white gap-3',
        'px-4 py-2.5',
    ),
    postContent: cn(
        'flex-1 flex-col',
    ),
    userProfileWrapper: cn(
        'relative w-10 h-10 rounded-full',
        'bg-grey-5',
    ),
    followButton: cn(
        'absolute -bottom-0.5 -right-1',
    ),
    infoWrapper: cn(
        'flex flex-row items-center gap-2',
    ),
    moreButtonWrapper: cn(
        'flex flex-row gap-4 ml-auto',
    ),
    userName: cn(
        'title-16',
        'text-grey-11',
    ),
    time: cn(
        'font-caption-caption4 text-gray-8',
    ),
    contentWrapper: cn(
        'flex flex-col gap-2.5 mt-1',
    ),
    contentText: cn(
        'pr-14',
        'body-8',
        'text-grey-11',
    ),
    imageWrapper: cn(
        'flex flex-row gap-2 items-center',
    ),
    imageItem: cn(
        'w-22 h-22 rounded-[12px]',
        'bg-grey-5',
    ),
    imageMoreButton: cn(
        'flex items-center justify-center',
        'w-fit h-fit',
        'px-[9px] py-[7px] rounded-[17px]',
        'font-caption-caption3 ',
        'text-grey-9',
        'bg-grey-2',
    ),
    footerWrapper: cn(
        'flex flex-row items-center gap-2.5 justify-end',
        '-mt-2.5',
    ),
    footerButton: cn(
        'flex flex-row items-center gap-1',
        'text-grey-5',
    ),
    footerButtonText: cn(
        'font-caption-caption3',
        'text-grey-9',
    ),
}