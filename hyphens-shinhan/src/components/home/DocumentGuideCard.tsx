'use client';

import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';

/** 하트 + 좌우 물결 한 줄 경로 (선으로 그리기용, 좌물결 → 하트 → 우물결) */
const HEART_LINE_PATH =
  "M -10 35 Q 15 50 32 45 C 5 25 10 0 32 15 C 54 0 59 25 32 45 Q 70 55 120 1";

/**
 * 홈 상단 제출 D-day 카드
 */
export default function DocumentGuideCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>4월 자치회 활동 제출까지</h2>
      <p className={styles.dDay}>D-3</p>

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
        />
      </div>
    </article>
  );
}

const styles = {
  card: cn(
    'mx-5 mb-3.5 flex flex-col gap-2 px-5 pb-5',
  ),
  title: 'title-18 text-white',
  dDay: 'font-text48 leading-tight text-white',
  ctaWrap: 'flex flex-col items-start gap-3.5 mt-20',
  ctaRow: 'flex items-center gap-2',
  ctaLabel: 'body-5 text-white shrink-0',
  heartLine: 'w-[100px] h-[30px] shrink-0 translate-y-[-7px]',
  button: 'w-auto self-start !border-white !bg-white !text-primary-shinhanblue',
} as const;