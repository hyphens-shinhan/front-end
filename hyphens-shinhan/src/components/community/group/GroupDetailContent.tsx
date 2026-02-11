'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import GroupCard from "./GroupCard";
import Thumbnail from "@/components/common/Thumbnail";
import Tab from "@/components/common/Tab";
import JoinProfileOptions from "@/components/common/JoinProfileOptions";
import type { JoinProfileType } from "@/components/common/JoinProfileOptions";
import { useClub, useGalleryImages } from "@/hooks/clubs/useClubs";
import { useJoinClub } from "@/hooks/clubs/useClubMutations";
import { useJoinClubChat } from "@/hooks/chat/useChatMutations";
import { useConfirmModalStore } from "@/stores";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import { TOAST_MESSAGES } from "@/constants/toast";
import { useToast } from "@/hooks/useToast";
import MemberContent from "./MemberContent";
import GalleryContent from "./GalleryContent";
import BottomFixedButton from "@/components/common/BottomFixedButton";

type DetailTab = '멤버' | '앨범';

const DETAIL_TABS: DetailTab[] = ['멤버', '앨범'];

const BOTTOM_BUTTON_HINT = <p className="font-caption-caption3 text-grey-9">소모임 채팅방에서 멤버와 대화할 수 있어요.</p>;

/** API가 상대 경로만 줄 때 Supabase 풀 URL로 보정. 빈 문자열은 null */
function normalizeClubImageUrl(url: string | null | undefined): string | null {
    if (url == null || typeof url !== 'string' || url.trim() === '') return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return trimmed;
    return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/storage/v1/object/${trimmed}`;
}

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
    const thumbnailSrc = useMemo(() => normalizeClubImageUrl(club?.image_url), [club?.image_url]);
    const joinClub = useJoinClub();
    const joinClubChat = useJoinClubChat();
    const toast = useToast();
    const { onOpen: openConfirmModal, updateOptions } = useConfirmModalStore();
    const [joinProfileType, setJoinProfileType] = useState<JoinProfileType>('realname');
    const [anonymousNickname, setAnonymousNickname] = useState('');
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const joinProfileTypeRef = useRef(joinProfileType);
    const anonymousNicknameRef = useRef(anonymousNickname);
    joinProfileTypeRef.current = joinProfileType;
    anonymousNicknameRef.current = anonymousNickname;

    useEffect(() => {
        if (joinModalOpen && club) {
            updateOptions({
                content: (
                    <JoinProfileOptions
                        value={joinProfileType}
                        onChange={setJoinProfileType}
                        anonymousNickname={anonymousNickname}
                        onAnonymousNicknameChange={setAnonymousNickname}
                        anonymity={club.anonymity}
                    />
                ),
            });
        }
    }, [joinModalOpen, joinProfileType, anonymousNickname, club, updateOptions]);

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
                onSuccess: () => {
                    // 클럽 가입 성공 후 채팅방 join API 호출
                    joinClubChat.mutate(clubId, {
                        onSuccess: () => {
                            toast.show(TOAST_MESSAGES.GROUP.JOIN_SUCCESS);
                        },
                        onError: (error) => {
                            // 채팅방 join 실패 시 에러 표시
                            toast.error('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
                        },
                    });
                },
                onError: (error) => {
                    toast.error(TOAST_MESSAGES.GROUP.JOIN_ERROR);
                },
            }
        );
    };

    const handleJoin = () => {
        if (!club || club.is_member) return;
        // anonymity 설정에 따라 초기값 설정
        const initialProfileType: JoinProfileType =
            club.anonymity === 'PRIVATE' ? 'anonymous' : 'realname';
        setJoinProfileType(initialProfileType);
        // PRIVATE일 때는 익명이므로 닉네임은 JoinProfileOptions에서 자동 생성됨
        // PUBLIC이나 BOTH일 때는 실명이므로 닉네임 불필요
        setAnonymousNickname('');
        setJoinModalOpen(true);
        openConfirmModal({
            title: '그룹에 참여할\n프로필을 선택해주세요',
            confirmText: '참여하기',
            cancelText: '취소',
            content: (
                <JoinProfileOptions
                    value={joinProfileType}
                    onChange={setJoinProfileType}
                    anonymousNickname={anonymousNickname}
                    onAnonymousNicknameChange={setAnonymousNickname}
                    anonymity={club.anonymity}
                />
            ),
            onConfirm: () => {
                setJoinModalOpen(false);
                doJoin();
            },
            onCancel: () => setJoinModalOpen(false),
        });
    };

    const handleGoToChat = () => {
        if (!club || !club.is_member) return;
        router.push(`${ROUTES.COMMUNITY.GROUP.DETAIL}/${clubId}/chat`);
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
            {/** 대표 이미지 영역 (에러 시 프론트 이미지로 폴백) */}
            <Thumbnail
                src={thumbnailSrc}
                alt={club.name}
            />

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

            {/** 하단 버튼 */}
            <BottomFixedButton
                label={club.is_member ? '채팅방 가기' : '참여하기'}
                size="M"
                type="primary"
                disabled={joinClub.isPending || joinClubChat.isPending}
                onClick={club.is_member ? handleGoToChat : handleJoin}
                bottomContent={BOTTOM_BUTTON_HINT}
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
};
