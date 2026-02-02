'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import GroupCard from "./GroupCard";
import Tab from "@/components/common/Tab";
import { useClub, useGalleryImages } from "@/hooks/clubs/useClubs";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import MemberContent from "./MemberContent";
import GalleryContent from "./GalleryContent";

type DetailTab = '멤버' | '앨범';

const DETAIL_TABS: DetailTab[] = ['멤버', '앨범'];

interface GroupDetailContentProps {
    clubId: string;
}

/** 소모임 상세 콘텐츠 */
export default function GroupDetailContent({ clubId }: GroupDetailContentProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = (searchParams.get('tab') as DetailTab) || '멤버';

    const handleTabClick = (tab: DetailTab) => {
        router.replace(`${pathname}?tab=${tab}`, { scroll: false });
    };

    const { data: club, isLoading, isError } = useClub(clubId);
    const { data: galleryData } = useGalleryImages(clubId);

    if (isLoading) {
        return (
            <EmptyContent
                variant="loading"
                message={EMPTY_CONTENT_MESSAGES.LOADING.GROUP}
            />
        );
    }

    if (isError || !club) {
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.GROUP}
                action={
                    <Button
                        label="목록으로 돌아가기"
                        size="M"
                        type="primary"
                        onClick={() => router.push(ROUTES.COMMUNITY.GROUP.MAIN)}
                    />
                }
            />
        );
    }

    return (
        <div className={styles.container}>
            {/** 대표 이미지 영역 - TODO: 이미지 URL 연동 (클래스는 JSX에 직접 두어 purge 방지) */}
            <div className={styles.imageContainer} />

            {/** 소모임 정보 (멤버 미리보기 없음) */}
            <GroupCard club={club} variant="detail" />

            {/** 탭 - 멤버, 앨범 (URL ?tab= 으로 상태 유지, NoticeTabs와 동일 패턴) */}
            <div className={styles.tabContainer}>
                {DETAIL_TABS.map((tab) => (
                    <Tab
                        key={tab}
                        title={tab}
                        isActive={activeTab === tab}
                        onClick={() => handleTabClick(tab)}
                    />
                ))}
            </div>

            {/** 탭별 콘텐츠 */}
            <div className={styles.tabContent}>
                {activeTab === '멤버' && <MemberContent />}
                {activeTab === '앨범' && <GalleryContent />}
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex-1 px-4 pb-8 overflow-y-auto scrollbar-hide',
    ),
    tabContainer: cn('flex gap-2'),
    tabContent: cn('py-4'),
    imageContainer: cn('h-[158px] rounded-[16px] bg-grey-4 px-4 py-3'),
};
