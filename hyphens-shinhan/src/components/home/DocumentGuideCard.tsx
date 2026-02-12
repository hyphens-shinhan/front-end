'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants';
import { useUserStore, toNavRole } from '@/stores';
import { useMandatoryStatus } from '@/hooks/user/useUser';

/** WMO 기상 코드 → 한글 설명 (간단 매핑) */
const WEATHER_LABELS: Record<number, string> = {
  0: '맑음',
  1: '대체로 맑음',
  2: '조금 흐림',
  3: '흐림',
  45: '안개',
  48: '서리 안개',
  51: '이슬비',
  53: '이슬비',
  55: '이슬비',
  61: '비',
  63: '비',
  65: '폭우',
  71: '눈',
  73: '눈',
  75: '폭설',
  77: '진눈깨비',
  80: '소나기',
  81: '소나기',
  82: '폭우',
  85: '눈 소나기',
  86: '폭설',
  95: '뇌우',
  96: '뇌우·우박',
  99: '뇌우·우박',
};

function getWeatherLabel(code: number): string {
  return WEATHER_LABELS[code] ?? '흐림';
}

const DEFAULT_TITLE = '자치회 활동 제출까지';
const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL_LAT}&longitude=${SEOUL_LON}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;

/**
 * 홈 상단 카드.
 * OB: 서울 오늘 날씨 + "오늘도 좋은 하루" 문구.
 * YB: D-day 제출 카드 + "지금 제출하러 가기" 버튼.
 */
export default function DocumentGuideCard() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const userRole = user ? toNavRole(user.role) : 'YB';
  const isOB = userRole === 'OB';

  // --- YB: D-day 계산 ---
  const currentYear = new Date().getFullYear();
  const { data: mandatoryStatus } = useMandatoryStatus(currentYear);

  const { ybTitle, dDay, showBanner } = useMemo(() => {
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
    const ybTitle = `${currentMonth}월 ${DEFAULT_TITLE}`;

    return {
      ybTitle,
      dDay: Math.max(0, dDay),
      showBanner: hasIncomplete,
    };
  }, [mandatoryStatus]);

  // --- OB: 날씨 ---
  const [weather, setWeather] = useState<{
    temp: number;
    code: number;
    month: number;
    day: number;
  } | null>(null);

  useEffect(() => {
    if (!isOB) return; // OB만 날씨 fetch
    let cancelled = false;
    fetch(OPEN_METEO_URL)
      .then((res) => res.json())
      .then((data: { current?: { temperature_2m?: number; weather_code?: number } }) => {
        if (cancelled) return;
        const now = new Date();
        const temp = data.current?.temperature_2m ?? 0;
        const code = data.current?.weather_code ?? 0;
        setWeather({
          temp: Math.round(temp),
          code,
          month: now.getMonth() + 1,
          day: now.getDate(),
        });
      })
      .catch(() => {
        if (!cancelled) {
          const now = new Date();
          setWeather({
            temp: 0,
            code: 0,
            month: now.getMonth() + 1,
            day: now.getDate(),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isOB]);

  // OB 표시용
  const obTitle = weather
    ? `서울 ${weather.month}월 ${weather.day}일 날씨`
    : '서울 날씨';
  const obSubtitle = weather
    ? `${getWeatherLabel(weather.code)} ${weather.temp}°C`
    : '불러오는 중…';

  const handleSubmit = () => {
    router.push(ROUTES.SCHOLARSHIP.MAIN);
  };

  // YB: 미완료 활동 없으면 카드 숨김
  if (!isOB && !showBanner) return null;

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
          style={{ width: 160, height: 230, objectFit: 'contain' }}
          className={styles.foxImage}
        />
      </div>

      <div className={styles.contentRow}>
        <div className={styles.leftContent}>
          {isOB ? (
            <>
              <h2 className={styles.title}>{obTitle}</h2>
              <p className={styles.dDay}>{obSubtitle}</p>
              <div className={styles.ctaWrap}>
                <p className={styles.obMessage}>오늘도 좋은 하루 되세요</p>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.title}>{ybTitle}</h2>
              <p className={styles.dDay}>D-{dDay}</p>
              <div className={styles.ctaWrap}>
                <div className={styles.ctaRow}>
                  <div className={styles.ctaLabel}>
                    <img
                      src="/assets/images/hurryup.png"
                      alt=""
                      className={styles.hurryupImage}
                    />
                  </div>
                </div>
                <Button
                  label="지금 제출하러 가기"
                  size="M"
                  type="primary"
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
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
  obMessage: 'body-5 text-white/90',
  hurryupImage: 'w-[80px] h-[30px] object-contain',
} as const;
