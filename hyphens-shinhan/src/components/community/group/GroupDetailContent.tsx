'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface GroupDetailContentProps {
    clubId: string;
}

/** 소모임 상세 콘텐츠 */
export default function GroupDetailContent({ clubId }: GroupDetailContentProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<DetailTab>('멤버');
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
            {/** 대표 이미지 영역 - TODO: 이미지 URL 연동 */}
            <div className={styles.imageContainer} />

            {/** 소모임 정보 (멤버 미리보기 없음) */}
            <GroupCard club={club} variant="detail" />

            {/** 탭 - 멤버, 앨범 */}
            <div className={styles.tabContainer}>
                <Tab
                    title="멤버"
                    isActive={activeTab === '멤버'}
                    onClick={() => setActiveTab('멤버')}
                />
                <Tab
                    title="앨범"
                    isActive={activeTab === '앨범'}
                    onClick={() => setActiveTab('앨범')}
                />
            </div>

            {/** 탭별 콘텐츠 */}
            {activeTab === '멤버' && (
                <MemberContent />
            )}
            {activeTab === '앨범' && (
                <GalleryContent />
            )}
        </div>
    );
}

const styles = {
    container: cn('flex flex-col gap-3', 'px-4'),
    imageContainer: cn('py-3 rounded-[16px] h-[158px] bg-grey-4'),
    tabContainer: cn('flex gap-2'),
    tabContent: cn('min-h-[120px] py-4'),
    galleryGrid: cn('grid grid-cols-3 gap-2'),
    galleryItem: cn('aspect-square rounded-[8px] bg-grey-3'),
};
