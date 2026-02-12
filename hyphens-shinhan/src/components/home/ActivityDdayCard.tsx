'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants';
import { getDaysUntil } from '@/utils/date';

/**
 * 홈 상단 YB/YB 팀장 전용 배너: 활동제출 D-day만 표시 (날씨 없음).
 * "활동제출까지 D-X" + MY활동 보기 버튼.
 */
function getSubmissionDeadlineThisMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0); // 마지막 날
}

export default function ActivityDdayCard() {
  const router = useRouter();
  const deadline = useMemo(() => getSubmissionDeadlineThisMonth(), []);
  const daysUntil = getDaysUntil(deadline);
  const dDayLabel =
    daysUntil < 0 ? null : daysUntil === 0 ? 'D-Day' : `D-${daysUntil}`;

  const handleCta = () => {
    router.push(ROUTES.SCHOLARSHIP.MAIN);
  };

  return (
    <article className={styles.card}>
      <div className={styles.rightImage}>
        <div className={styles.ellipseWrapper}>
          <img
            src="/assets/images/ellipse.png"
            alt=""
            width={200}
            height={200}
            className={styles.ellipse}
          />
        </div>
        <img
          src="/assets/images/bg.png"
          alt=""
          width={160}
          height={230}
          style={{ width: 85, height: 170, objectFit: 'contain' }}
          className={styles.bgImage}
        />
        <img
          src="/assets/images/fox_run.gif"
          alt=""
          style={{ width: 160, height: 230, objectFit: 'contain' }}
          className={styles.foxImage}
        />
      </div>

      <div className={styles.contentRow}>
        <div className={styles.leftContent}>
          <h2 className={styles.title}>이번 달 활동 제출</h2>
          {dDayLabel != null ? (
            <p className={styles.dDay}>활동제출까지 {dDayLabel}</p>
          ) : (
            <p className={styles.dDay}>이번 달 활동 확인하기</p>
          )}
          <div className={styles.ctaWrap}>
            <div className={styles.ctaRow}>
              <span className={styles.ctaLabel}>이번 달 활동 확인하기</span>
            </div>
            <Button
              label="MY활동 보기"
              size="M"
              type="primary"
              onClick={handleCta}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: cn(
    'mx-5 mb-3.5 flex flex-col gap-2 px-2 pb-5 relative overflow-hidden',
  ),
  contentRow: 'relative z-10',
  leftContent: 'flex flex-col gap-2 h-[290px]',
  rightImage:
    'absolute -bottom-[10px] -right-[10px] w-[160px] h-[230px] pointer-events-none',
  bgImage: 'absolute top-13 left-9.5 z-0',
  foxImage: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
  ellipseWrapper:
    'absolute inset-0 flex items-end justify-center pointer-events-none z-0',
  ellipse: 'w-[250px] h-[250px] object-contain',
  title: 'title-18 text-white',
  dDay: 'font-text48 leading-tight text-white',
  ctaWrap: 'flex flex-col items-start gap-3.5 mt-20',
  ctaRow: 'flex items-center gap-2',
  ctaLabel: 'body-5 text-white shrink-0',
} as const;
