'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HeaderContent } from '@/components/common/Header';
import { BottomNavContent } from '@/components/common/BottomNav';
import { cn } from '@/utils/cn';
import { useUserStore, toNavRole } from '@/stores';
import { ROUTES } from '@/constants';

/**
 * 멘토 전용 레이아웃. /mentor/* 경로에서만 사용됩니다.
 * 역할이 멘토가 아니면 / 로 리다이렉트합니다.
 */
export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const userRole = user ? toNavRole(user.role) : 'YB';

  useEffect(() => {
    if (userRole !== 'MENTOR') {
      router.replace(ROUTES.HOME.MAIN);
    }
  }, [userRole, router]);

  if (userRole !== 'MENTOR') {
    return null;
  }

  return (
    <div className={styles.container}>
      <HeaderContent pathname={pathname} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <BottomNavContent pathname={pathname} userRole="MENTOR" />
    </div>
  );
}

const styles = {
  container: cn(
    'relative mx-auto max-w-md',
    'h-[100dvh] overflow-hidden flex flex-col',
    'bg-white'
  ),
  main: cn('flex-1 overflow-hidden relative'),
  content: cn(
    'relative overflow-y-auto scrollbar-hide overscroll-y-none h-full'
  ),
};
