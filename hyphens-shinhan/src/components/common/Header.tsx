'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    rightElement?: ReactNode;
    className?: string;
}

export default function Header({
    title,
    showBackButton = false,
    rightElement,
    className,
}: HeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <header className={cn(styles.container, className)}>
            <div className={styles.wrapper}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    {showBackButton && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className={styles.backButton}
                            aria-label="뒤로 가기"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 18L9 12L15 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Center Section - Title */}
                {title && <h1 className={styles.title}>{title}</h1>}

                {/* Right Section */}
                <div className={styles.rightSection}>{rightElement}</div>
            </div>
        </header>
    );
}

const styles = {
    container: cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white border-b border-gray-100',
        // safe-area-inset-top 적용
        'pt-[var(--sat)]'
    ),
    wrapper: cn(
        'flex items-center justify-between',
        'h-[var(--header-height)] px-4',
        'max-w-md mx-auto'
    ),
    leftSection: 'flex items-center min-w-[40px]',
    rightSection: 'flex items-center min-w-[40px] justify-end',
    backButton: cn(
        'p-2 -ml-2 rounded-full',
        'text-gray-700 hover:bg-gray-100',
        'transition-colors duration-200'
    ),
    title: 'text-lg font-semibold text-gray-900 truncate',
};
