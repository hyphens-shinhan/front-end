import { cn } from "@/utils/cn";
import Button from "../common/Button";
import Profile from "./Profile";
import FeedList from "./FeedList";
import { useMyProfile } from "@/hooks/user/useUser";
import EmptyContent from "../common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";

export default function MypageContent() {
    const { data: profile, isLoading, error } = useMyProfile();

    if (isLoading) {
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (error || !profile) {
        return <EmptyContent variant="error" message="프로필을 불러올 수 없어요." />;
    }

    return (
        <div className={styles.container}>
            {/** 프로필 */}
            <Profile profile={profile} />

            {/** 마이페이지 : 프로필 편집 */}
            <div className={styles.button} >
                <Button label="프로필 편집" size="L" type="secondary" fullWidth className='bg-grey-1-1' />
            </div>

            {/** OOO님의 글 / 내가 쓴 글 */}
            <FeedList isMyPage={true} userName={profile.name} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-1 flex-col overflow-x-hidden'),
    button: cn('px-4 pb-4'),
}
