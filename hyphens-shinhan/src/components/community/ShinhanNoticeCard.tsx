'use client'

import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import Image from "next/image";
import shinhanLogo from "@/assets/icons/Icon-L/Vector/shinhan-logo.png";
import Link from "next/link";
import { ROUTES } from "@/constants";

/** 신한장학 재단의 공지 소식
 * - 신한장학 재단의 공지 소식 카드
 */
export default function ShinhanNoticeCard() {
    return (
        <Link href={ROUTES.COMMUNITY.NOTICE.MAIN} className={styles.container}>
            <div className={styles.logoWrapper}>
                <Image src={shinhanLogo} alt="신한장학재단 로고" width={24} height={24} aria-label="신한장학재단 로고" />
            </div>
            <h1 className={styles.title}>신한장학재단의 새로운 소식</h1>

            <div className={styles.arrowRightWrapper} aria-label="더보기 버튼">
                <Icon name="IconMLineArrowRight" size={16} />
            </div>
        </Link>
    );
}

const styles = {
    container: cn(
        'flex items-center px-5 py-2.5 gap-2 transition-all duration-100 active:scale-99',
        'bg-primary-lighter rounded-[16px]',
    ),
    logoWrapper: cn(
        '',
    ),
    title: cn(
        'body-6 text-grey-11',
    ),
    arrowRightWrapper: cn(
        'w-4 h-4 flex items-center justify-center ml-auto',
        'text-grey-9',
    ),
};