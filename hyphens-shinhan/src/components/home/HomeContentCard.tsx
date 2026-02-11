'use client';

import MaintenanceReviewShortcut from '@/components/home/MaintenanceReviewShortcut';
import MaintenanceReviewSummary, {
  type MaintenanceReviewSummaryItem,
} from '@/components/home/MaintenanceReviewSummary';
import ShortcutMenuList from '@/components/home/ShortcutMenuList';
import { ROUTES } from '@/constants';
import { useScholarshipEligibility } from '@/hooks/user/useUser';
import { useUserStore, toNavRole } from '@/stores';
import type { ScholarshipEligibilityResponse } from '@/types';
import { cn } from '@/utils/cn';
import RecommendedContent from './RecommendedContent';

/** 유지 심사 표시용 목표값 (API에 없을 때 UI 기본값) */
const DISPLAY_TARGETS = {
  /** GPA 만점 (4.5만점 기준) */
  GPA_MAX: 4.5,
  /** 이수 학점 목표 (학기 기준 예시) */
  CREDITS_TARGET: 15,
  /** 봉사 시간 목표 (시간) */
  VOLUNTEER_TARGET: 21,
} as const;

/**
 * API 응답을 요약 카드용 items로 변환
 * - hint: 'tick' = 충족, 'info' = 미충족 또는 확인 필요
 */
function mapEligibilityToSummaryItems(
  data: ScholarshipEligibilityResponse,
): MaintenanceReviewSummaryItem[] {
  const gpaOk = data.gpa >= DISPLAY_TARGETS.GPA_MAX * 0.5; // 2.25 이상 등 기준은 운영 정책에 맞게 조정
  const creditsOk = data.total_credits >= DISPLAY_TARGETS.CREDITS_TARGET;
  const volunteerOk = data.volunteer_hours >= DISPLAY_TARGETS.VOLUNTEER_TARGET;
  const mandatoryOk =
    data.mandatory_total === 0 ||
    data.mandatory_completed >= data.mandatory_total;

  return [
    {
      label: 'GPA',
      value: `${data.gpa.toFixed(1)} / ${DISPLAY_TARGETS.GPA_MAX}`,
      icon: 'IconMBoldBookmark',
      hint: gpaOk ? 'tick' : 'info',
    },
    {
      label: '이수학점',
      value: `${data.total_credits} / ${DISPLAY_TARGETS.CREDITS_TARGET}학점`,
      icon: 'IconMBoldMedalStar',
      hint: creditsOk ? 'tick' : 'info',
    },
    {
      label: '봉사',
      value: `${data.volunteer_hours} / ${DISPLAY_TARGETS.VOLUNTEER_TARGET}시간`,
      icon: 'IconMBoldMenuBoard',
      hint: volunteerOk ? 'tick' : 'info',
    },
    {
      label: '행사',
      value: `${data.mandatory_completed} / ${data.mandatory_total}개`,
      icon: 'IconMBoldCalendar',
      hint: mandatoryOk ? 'tick' : 'info',
    },
  ];
}

/**
 * 요약 데이터 기준으로 바로가기 태그 라벨·색상 결정
 * - 하나라도 미충족이면 '유의 필요'(red), 모두 충족이면 태그 없음
 * - 유지심사 상세(MaintenanceReviewProgress) 구간과 문구·색 맞춤
 */
function getTagLabel(data: ScholarshipEligibilityResponse | undefined): string | undefined {
  if (!data) return undefined;
  const mandatoryOk =
    data.mandatory_total === 0 ||
    data.mandatory_completed >= data.mandatory_total;
  const gpaOk = data.gpa >= DISPLAY_TARGETS.GPA_MAX * 0.5;
  const creditsOk = data.total_credits >= DISPLAY_TARGETS.CREDITS_TARGET;
  const volunteerOk = data.volunteer_hours >= DISPLAY_TARGETS.VOLUNTEER_TARGET;
  const allOk = mandatoryOk && gpaOk && creditsOk && volunteerOk;
  return allOk ? undefined : '유의 필요';
}

function getTagColor(
  data: ScholarshipEligibilityResponse | undefined,
): 'red' | 'yellow' | 'green' | undefined {
  if (!data) return undefined;
  const mandatoryOk =
    data.mandatory_total === 0 ||
    data.mandatory_completed >= data.mandatory_total;
  const gpaOk = data.gpa >= DISPLAY_TARGETS.GPA_MAX * 0.5;
  const creditsOk = data.total_credits >= DISPLAY_TARGETS.CREDITS_TARGET;
  const volunteerOk = data.volunteer_hours >= DISPLAY_TARGETS.VOLUNTEER_TARGET;
  const allOk = mandatoryOk && gpaOk && creditsOk && volunteerOk;
  if (allOk) return undefined;
  return 'red';
}

const styles = {
  card: 'flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-white pt-9 pb-20',
  shortcut: 'mt-7',
  summaryWrap: 'px-4',
} as const;

interface HomeContentCardProps {
  /** 유지심사 바로가기 태그 문구 (데이터 없을 때만 사용, 있으면 API 기준으로 계산) */
  tagLabel?: string;
  /** 유지심사 바로가기 태그 색 (데이터 없을 때만 사용) */
  tagColor?: 'red' | 'yellow' | 'green';
  className?: string;
}

/** 홈 탭 메인 콘텐츠를 담는 흰색 카드 영역 (상단만 둥근 모서리) */
export default function HomeContentCard({
  tagLabel: tagLabelProp,
  tagColor: tagColorProp,
  className,
}: HomeContentCardProps) {
  const user = useUserStore((s) => s.user);
  const userRole = user ? toNavRole(user.role) : 'YB';
  const isOB = userRole === 'OB';

  const { data: eligibility } = useScholarshipEligibility();
  const tagLabel =
    eligibility != null ? getTagLabel(eligibility) : tagLabelProp;
  const tagColor =
    eligibility != null ? getTagColor(eligibility) : tagColorProp;
  const summaryItems =
    eligibility != null ? mapEligibilityToSummaryItems(eligibility) : undefined;

  return (
    <div className={cn(styles.card, className)}>
      <ShortcutMenuList />
      {!isOB && (
        <MaintenanceReviewShortcut
          tagLabel={tagLabel}
          tagColor={tagColor}
          href={ROUTES.SCHOLARSHIP.MAINTENANCE}
          className={styles.shortcut}
        />
      )}
      <div className={styles.summaryWrap}>
        {!isOB && <MaintenanceReviewSummary items={summaryItems} />}
        <RecommendedContent />
      </div>
    </div>
  );
}
