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
 * 홈 상단 제출 D-day 카드 (현재 월의 마지막 날 기준 계산)
 */
export default function DocumentGuideCard() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { data: mandatoryStatus } = useMandatoryStatus(currentYear);

  const { title, dDay, showBanner } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 현재 월의 마지막 날 구하기 (다음 달의 0번째 날 = 이번 달 마지막 날)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 차이 계산 (밀리초 -> 일)
    const diffMs = lastDayOfMonth.getTime() - today.getTime();
    const dDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // API 데이터 기반으로 미완료 활동이 있는지 확인 (배너 노출 여부 결정)
    const activities = mandatoryStatus?.activities ?? [];
    const hasIncomplete = activities.some((a) => !a.is_completed);

    const currentMonth = now.getMonth() + 1;
    const title = `${currentMonth}월 ${DEFAULT_TITLE}`;

    return {
      title,
      dDay: Math.max(0, dDay),
      showBanner: hasIncomplete
    };
  }, [mandatoryStatus]);

  const handleSubmit = () => {
    router.push(ROUTES.SCHOLARSHIP.MAIN);
  };

  if (!showBanner) return null;

  return (
    <article className={styles.card}>
      {/* 이미지: 카드 기준 절대 위치 (레이아웃에 영향 없음) */}
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
          width={160}
          height={230}
          style={{ width: 160, height: 230, objectFit: 'contain' }}
          className={styles.foxImage}
        />
      </div>

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
              size="M"
              type="primary"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: cn(
    'mx-5 mb-3.5 flex flex-col gap-2 px-2 pb-5 relative overflow-hidden', // relative와 overflow-hidden 추가
  ),
  contentRow: 'relative z-10',
  leftContent: 'flex flex-col gap-2',
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
  heartLine: 'w-[100px] h-[30px] shrink-0 translate-y-[-7px]',
} as const;