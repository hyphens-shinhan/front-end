'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import GroupCard from "./GroupCard";
import Tab from "@/components/common/Tab";
import JoinProfileModal from "@/components/common/JoinProfileModal";
import { useClub, useGalleryImages } from "@/hooks/clubs/useClubs";
import { useJoinClub } from "@/hooks/clubs/useClubMutations";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { TOAST_MESSAGES } from "@/constants/toast";
import { useToast } from "@/hooks/useToast";
import MemberContent from "./MemberContent";
import GalleryContent from "./GalleryContent";
import BottomFixedButton from "@/components/common/BottomFixedButton";
import type { UserClubProfile } from "@/types/clubs";

type DetailTab = '멤버' | '앨범';

const DETAIL_TABS: DetailTab[] = ['멤버', '앨범'];

const BOTTOM_BUTTON_HINT = <p className="font-caption-caption3 text-grey-9">소모임 채팅방에서 멤버와 대화할 수 있어요.</p>;

interface GroupDetailContentProps {
    clubId: string;
}

/** 소모임 상세 콘텐츠 */
export default function GroupDetailContent({ clubId }: GroupDetailContentProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = (searchParams.get('tab') as DetailTab) || '멤버';

    const handleTabClick = useCallback(
        (tab: DetailTab) => {
            router.replace(`${pathname}?tab=${tab}`, { scroll: false });
        },
        [pathname, router]
    );

    const { data: club, isLoading, isError } = useClub(clubId);
    const { data: galleryData } = useGalleryImages(clubId);
    const galleryImages = useMemo(() => galleryData?.images ?? [], [galleryData?.images]);
    const joinClub = useJoinClub();
    const toast = useToast();
    const [joinModalOpen, setJoinModalOpen] = useState(false);

    const handleJoin = useCallback(() => {
        if (!club) return;
        setJoinModalOpen(true);
    }, [club]);

    const handleJoinConfirm = useCallback(
        (profile: UserClubProfile) => {
            setJoinModalOpen(false);
            toast.show(TOAST_MESSAGES.GROUP.JOIN_SUCCESS);
            router.replace(`${ROUTES.COMMUNITY.GROUP.DETAIL}/${clubId}/chat`);
            if (club && !club.is_member) {
                joinClub.mutate(
                    { clubId, profile },
                    {
                        onError: () => toast.error(TOAST_MESSAGES.GROUP.JOIN_ERROR),
                    }
                );
            }
        },
        [club, clubId, joinClub, router, toast]
    );

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
                {activeTab === '멤버' && <MemberContent clubId={clubId} />}
                {activeTab === '앨범' && <GalleryContent images={galleryImages} isMember={club.is_member} />}
            </div>

            {/** 하단 버튼: 비멤버일 때만 참여하기, 멤버일 때는 채팅 등 다른 액션 가능 */}
            <BottomFixedButton
                label="참여하기"
                size="M"
                type="primary"
                disabled={joinClub.isPending}
                onClick={handleJoin}
                bottomContent={BOTTOM_BUTTON_HINT}
            />

            <JoinProfileModal
                isOpen={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                onConfirm={handleJoinConfirm}
            />
        </div>
    );
}

const styles = {
    container: cn(
        'flex-1 px-4 pb-40 overflow-y-auto scrollbar-hide',
    ),
    tabContainer: cn('flex gap-2'),
    tabContent: cn('py-4'),
    imageContainer: cn('h-[158px] rounded-[16px] bg-grey-4 px-4 py-3'),
};
