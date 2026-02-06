'use client';

import { useMemo } from 'react';
import { Icon } from "@/components/common/Icon";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useLogout } from "@/hooks/useAuth";

/** 설정 페이지 아이템 타입 */
interface MypageSettingItem {
    title: string;
    href?: string;
    onClick?: () => void;
}

/** 설정 페이지 컨텐츠 컴포넌트 */
export default function MypageSettingContent() {
    const logoutMutation = useLogout();

    const MypageSettingItems: MypageSettingItem[] = useMemo(() => [
        {
            title: '내가 스크랩한 글',
            href: ROUTES.MYPAGE.SETTING.SCRAP,
        },
        {
            title: '개인정보 공개 설정',
            href: ROUTES.MYPAGE.SETTING.PRIVACY,
        },
        {
            title: '로그아웃',
            onClick: () => {
                logoutMutation.mutate();
            },
        },
    ], [logoutMutation]);

    return (
        <div className={styles.container}>
            {MypageSettingItems.map((item) => (
                item.href ? (
                    <Link href={item.href} className={styles.item} key={item.title}>
                        <p className={styles.itemTitle}>{item.title}</p>
                        <div>
                            <Icon name='IconLLineArrowRight' />
                        </div>
                    </Link>
                ) : (
                    <button
                        type="button"
                        className={styles.item}
                        onClick={item.onClick}
                        disabled={logoutMutation.isPending}
                        key={item.title}
                    >
                        <p className={styles.itemTitle}>
                            {logoutMutation.isPending ? '로그아웃 중...' : item.title}
                        </p>
                        <div>
                            <Icon name='IconLLineArrowRight' />
                        </div>
                    </button>
                )
            ))}
        </div>
    );
}

const styles = {
    container: cn('flex flex-col px-4'),
    item: cn('flex justify-between py-3'),
    itemTitle: cn('body-5 text-grey-10'),
}
