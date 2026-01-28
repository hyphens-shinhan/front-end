import PostCard from "@/components/community/PostCard";
import FollowButton from "@/components/community/FollowButton";
import ShinhanNoticeCard from "@/components/community/ShinhanNoticeCard";
import { cn } from "@/utils/cn";

export default function CommunityPage() {
    return (
        <div>
            <div className={styles.noticeCardWrapper}>
                <ShinhanNoticeCard />
            </div>
            <PostCard />
        </div>
    );
}

const styles = {
    noticeCardWrapper: cn(
        'flex-1 m-4 mb-3',
    ),
};

