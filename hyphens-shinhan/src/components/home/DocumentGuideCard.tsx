'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

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

const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL_LAT}&longitude=${SEOUL_LON}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;

/**
 * 홈 상단 OB 전용 서울 오늘 날씨 카드.
 * 날씨 + "오늘도 좋은 하루 되세요" 문구만 표시.
 */
export default function DocumentGuideCard() {
  const [weather, setWeather] = useState<{
    temp: number;
    code: number;
    month: number;
    day: number;
  } | null>(null);

  useEffect(() => {
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
  }, []);

  const title = weather
    ? `서울 ${weather.month}월 ${weather.day}일 날씨`
    : '서울 날씨';
  const subtitle = weather
    ? `${getWeatherLabel(weather.code)} ${weather.temp}°C`
    : '불러오는 중…';

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
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.dDay}>{subtitle}</p>
          <div className={styles.ctaWrap}>
            <p className={styles.obMessage}>오늘도 좋은 하루 되세요</p>
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
  obMessage: 'body-5 text-white/90',
} as const;