import { cn } from "@/utils/cn";
import PostCard from "./PostCard";
import ShinhanNoticeCard from "./ShinhanNoticeCard";
import Separator from "../common/Separator";
import PostFAB from "../common/PostFAB";
import { POST_FAB_ITEM_KEY } from "@/constants";

/** 커뮤니티 게시판 리스트 컴포넌트
 * TODO: api 호출해서 데이터를 리스트에 뿌려줘야 함
 * @returns {React.ReactNode} 커뮤니티 게시판 리스트 컴포넌트
 * @example
 * <PostList />
 */
export default function PostList() {

    return (
        <div className={styles.container}>
            {/** 신한 공지사항 카드 */}
            <div className={styles.noticeCardWrapper}>
                <ShinhanNoticeCard />
            </div>
            {/** 게시글 카드 리스트 */}
            {/** TODO: 게시글 데이터 추가 시 컴포넌트 수정 필요 */}
            <div className={styles.postCardWrapper}>
                <PostCard />
                <Separator />
                <PostCard />
            </div>
            <PostFAB type={POST_FAB_ITEM_KEY.WRITE} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex-1 flex flex-col',
    ),
    noticeCardWrapper: cn(
        'flex-1 m-4 mb-3',
    ),
    postCardSeparator: cn(
        'h-[1px] bg-grey-3 mx-4',
    ),
    postCardWrapper: cn(
        'flex flex-col',
    ),
};