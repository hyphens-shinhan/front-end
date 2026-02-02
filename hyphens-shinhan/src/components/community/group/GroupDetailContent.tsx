'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import GroupCard from "./GroupCard";
import Tab from "@/components/common/Tab";
import JoinProfileOptions from "@/components/common/JoinProfileOptions";
import type { JoinProfileType } from "@/components/common/JoinProfileOptions";
import { useClub, useGalleryImages } from "@/hooks/clubs/useClubs";
import { useJoinClub } from "@/hooks/clubs/useClubMutations";
import { useConfirmModalStore } from "@/stores";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import MemberContent from "./MemberContent";
import GalleryContent from "./GalleryContent";
import BottomFixedButton from "@/components/common/BottomFixedButton";

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
    const joinClub = useJoinClub();
    const { onOpen: openConfirmModal, updateOptions } = useConfirmModalStore();
    const [joinProfileType, setJoinProfileType] = useState<JoinProfileType>('realname');
    const [anonymousNickname, setAnonymousNickname] = useState('');
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const joinProfileTypeRef = useRef(joinProfileType);
    const anonymousNicknameRef = useRef(anonymousNickname);
    joinProfileTypeRef.current = joinProfileType;
    anonymousNicknameRef.current = anonymousNickname;

    useEffect(() => {
        if (joinModalOpen) {
            updateOptions({
                content: (
                    <JoinProfileOptions
                        value={joinProfileType}
                        onChange={setJoinProfileType}
                        anonymousNickname={anonymousNickname}
                        onAnonymousNicknameChange={setAnonymousNickname}
                    />
                ),
            });
        }
    }, [joinModalOpen, joinProfileType, anonymousNickname, updateOptions]);

    const doJoin = () => {
        if (!club || club.is_member) return;
        const isAnonymous = joinProfileTypeRef.current === 'anonymous';
        const profile = {
            is_anonymous: isAnonymous,
            nickname: isAnonymous ? anonymousNicknameRef.current : null,
            avatar_url: null,
        };
        joinClub.mutate(
            { clubId, profile },
            {
                onSuccess: () => { },
                onError: (error) => {
                    alert(error instanceof Error ? error.message : '참여에 실패했어요.');
                },
            }
        );
    };

    const handleJoin = () => {
        if (!club || club.is_member) return;
        setJoinProfileType('realname');
        setAnonymousNickname('');
        setJoinModalOpen(true);
        openConfirmModal({
            title: '그룹에 참여할\n프로필을 선택해주세요',
            message: '참여 후 소모임 채팅방에서 멤버와 대화할 수 있어요.',
            confirmText: '참여하기',
            cancelText: '취소',
            content: (
                <JoinProfileOptions
                    value={joinProfileType}
                    onChange={setJoinProfileType}
                    anonymousNickname={anonymousNickname}
                    onAnonymousNicknameChange={setAnonymousNickname}
                />
            ),
            onConfirm: () => {
                setJoinModalOpen(false);
                doJoin();
            },
            onCancel: () => setJoinModalOpen(false),
        });
    };

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

            {/** 하단 버튼 */}
            <BottomFixedButton
                label="참여하기"
                size="M"
                type="primary"
                disabled={joinClub.isPending}
                /** TODO: 멤버가 아니면 참여 모달, 멤버면 채팅방 이동 등 (TODO) */
                onClick={club.is_member ? undefined : handleJoin}
                bottomContent={<p className="font-caption-caption3 text-grey-9">소모임 채팅방에서 멤버와 대화할 수 있어요.</p>}
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
