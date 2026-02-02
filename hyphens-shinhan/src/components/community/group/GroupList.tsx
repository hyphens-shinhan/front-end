import { cn } from "@/utils/cn";
import PillTabs from "@/components/common/PillTabs";
import Separator from "@/components/common/Separator";
import GroupCard from "./GroupCard";
import { POST_FAB_ITEM_KEY } from "@/constants";
import PostFAB from "@/components/common/PostFAB";

const GROUP_TABS = ['전체', '내가 참여 중인', '스터디', '봉사', '취미'];

export default function GroupList() {
    return (
        <div className={styles.container}>
            <PillTabs tabs={GROUP_TABS} activeIndex={0} />

            <GroupCard />
            <Separator className="mx-4" />
            <GroupCard />
            <Separator className="mx-4" />
            <PostFAB type={POST_FAB_ITEM_KEY.ADD} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-col'),
};