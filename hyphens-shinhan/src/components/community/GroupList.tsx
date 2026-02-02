import { cn } from "@/utils/cn";
import Separator from "../common/Separator";
import GroupCard from "./GroupCard";
import { POST_FAB_ITEM_KEY } from "@/constants";
import PostFAB from "../common/PostFAB";

export default function GroupList() {
    return (
        <div className={styles.container}>
            {/** TODO:카테고리 탭 - 중복 선택 가능한지 확인 필요, 컴포넌트로 뺄지는 고민 */}
            <div className={styles.tabContainer}>
                <p className={styles.tabItem(true)}>전체</p>
                <p className={styles.tabItem(false)}>내가 참여 중인</p>
                <p className={styles.tabItem(false)}>스터디</p>
                <p className={styles.tabItem(false)}>봉사</p>
                <p className={styles.tabItem(false)}>취미</p>
            </div>

            <GroupCard />
            <Separator className="mx-4" />
            <GroupCard />
            <Separator className="mx-4" />
            <PostFAB type={POST_FAB_ITEM_KEY.ADD} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col',
    ),
    tabContainer: cn(
        'flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide',
        'px-4 py-2 ', // 스크롤 시 여유 공간을 위해 패딩 추가
    ),
    tabItem: (isActive: boolean) => cn(
        'px-5 py-1.5',
        'body-7 text-grey-6 bg-white rounded-full border border-grey-2',
        isActive && 'body-7 text-grey-11 bg-grey-4',
    ),
};