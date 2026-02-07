'use client';

import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';

/**
 * 홈 상단 제출 D-day 카드
 */
export default function DocumentGuideCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>4월 자치회 활동 제출까지</h2>
      <p className={styles.dDay}>D-3</p>

      <div className={styles.ctaWrap}>
        <p className={styles.ctaLabel}>서두르자구!</p>
        <Button
          label="지금 제출하러 가기"
          size="L"
          type="primary"
          className={styles.button}
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
  ctaLabel: 'body-5 text-white',
  button: 'w-auto self-start !border-white !bg-white !text-primary-shinhanblue',
} as const;