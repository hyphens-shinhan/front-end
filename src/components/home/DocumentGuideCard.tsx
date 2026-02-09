'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants';
import { useRouter } from 'next/navigation';
import { useMandatoryStatus } from '@/hooks/user/useUser';

/** 하트 + 좌우 물결 한 줄 경로 (선으로 그리기용, 좌물결 → 하트 → 우물결) */
const HEART_LINE_PATH =
  "M -10 35 Q 15 50 32 45 C 5 25 10 0 32 15 C 54 0 59 25 32 45 Q 70 55 120 1";

const DEFAULT_TITLE = '자치회 활동 제출까지';

/**
 * 홈 상단 제출 D-day 카드 (nearest incomplete mandatory activity from API)
 */
export default function DocumentGuideCard() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { data: mandatoryStatus } = useMandatoryStatus(currentYear);

  const { title, dDay, showBanner } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activities = mandatoryStatus?.activities ?? [];
    const incomplete = activities.filter((a) => !a.is_completed);
    const futureDues = incomplete
      .map((a) => ({
        ...a,
        dueTime: new Date(a.due_date).setHours(0, 0, 0, 0),
      }))
      .filter((a) => a.dueTime >= today.getTime())
      .sort((a, b) => a.dueTime - b.dueTime);
    const nearest = futureDues[0];
    if (!nearest) {
      return {
        title: DEFAULT_TITLE,
        dDay: 0,
        showBanner: incomplete.length > 0,
      };
    }
    const diffMs = nearest.dueTime - today.getTime();
    const dDay = Math.ceil(diffMs / 86400000);
    const dueDate = new Date(nearest.due_date);
    const title = `${dueDate.getMonth() + 1}월 ${nearest.title} 제출까지`;
    return { title, dDay: Math.max(0, dDay), showBanner: true };
  }, [mandatoryStatus]);

  const handleSubmit = () => {
    router.push(ROUTES.SCHOLARSHIP.MAIN);
  };

  if (!showBanner) return null;

  return (
    <article className={styles.card}>
      <div className={styles.contentRow}>
        <div className={styles.leftContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.dDay}>D-{dDay}</p>

          <div className={styles.ctaWrap}>
            <div className={styles.ctaRow}>
              <p className={styles.ctaLabel}>서두르자구!</p>
              <svg
                className={styles.heartLine}
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <motion.path
                  d={HEART_LINE_PATH}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0.001 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 5, ease: 'easeInOut' }}
                />
              </svg>
            </div>
            <Button
              label="지금 제출하러 가기"
              size="L"
              type="primary"
              onClick={handleSubmit}
            />
          </div>
        </div>
        <div className={styles.rightImage}>
          <img
            src="/assets/images/fe.png"
            alt=""
            width={160}
            height={230}
            style={{ width: 160, height: 230, objectFit: 'contain' }}
            className={styles.image}
          />
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: cn(
    'mx-5 mb-3.5 flex flex-col gap-2 px-5 pb-5',
  ),
  contentRow: 'flex items-stretch justify-between gap-4',
  leftContent: 'flex flex-col gap-2 min-w-0 flex-1',
  rightImage: 'shrink-0 flex items-center',
  image: '',
  title: 'title-18 text-white',
  dDay: 'font-text48 leading-tight text-white',
  ctaWrap: 'flex flex-col items-start gap-3.5 mt-20',
  ctaRow: 'flex items-center gap-2',
  ctaLabel: 'body-5 text-white shrink-0',
  heartLine: 'w-[100px] h-[30px] shrink-0 translate-y-[-7px]',
  button: 'w-auto self-start !border-white !bg-white !text-primary-shinhanblue',
} as const;