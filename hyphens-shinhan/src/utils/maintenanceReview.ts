import type { ScholarshipEligibilityResponse } from '@/types'

/** 유지심사 진행률 계산용 목표값 (각 25% 비중) */
const TARGETS = {
  /** GPA 만점 (4.5만점 기준) */
  GPA_MAX: 4.5,
  /** 이수 학점 목표 */
  CREDITS: 15,
  /** 봉사 시간 목표 (시간) */
  VOLUNTEER_HOURS: 21,
} as const

const WEIGHT_EACH = 25 // 4개 영역 각 25%

/**
 * 유지심사 전체 진행률 계산 (0~100)
 * - GPA: 4.5 만점 기준, 25%
 * - 이수학점: 15학점 기준, 25%
 * - 봉사시간: 21시간 기준, 25%
 * - 행사: API mandatory_completed / mandatory_total, 25% (mandatory_total 0이면 해당 영역 100% 인정)
 */
export function getMaintenanceReviewProgress(
  data: ScholarshipEligibilityResponse | null | undefined,
): number {
  if (!data) return 0

  const gpaRatio = Math.min(1, data.gpa / TARGETS.GPA_MAX)
  const creditsRatio = Math.min(1, data.total_credits / TARGETS.CREDITS)
  const volunteerRatio = Math.min(
    1,
    data.volunteer_hours / TARGETS.VOLUNTEER_HOURS,
  )
  const eventsRatio =
    data.mandatory_total === 0
      ? 1
      : Math.min(1, data.mandatory_completed / data.mandatory_total)

  const progress =
    gpaRatio * WEIGHT_EACH +
    creditsRatio * WEIGHT_EACH +
    volunteerRatio * WEIGHT_EACH +
    eventsRatio * WEIGHT_EACH

  return Math.round(progress)
}

/**
 * 유지심사 태그 라벨 (모두 충족 시 없음, 미충족 시 '유의 필요')
 */
export function getMaintenanceReviewTagLabel(
  data: ScholarshipEligibilityResponse | null | undefined,
): string | undefined {
  if (!data) return undefined
  const gpaOk = data.gpa >= TARGETS.GPA_MAX * 0.5
  const creditsOk = data.total_credits >= TARGETS.CREDITS
  const volunteerOk = data.volunteer_hours >= TARGETS.VOLUNTEER_HOURS
  const mandatoryOk =
    data.mandatory_total === 0 ||
    data.mandatory_completed >= data.mandatory_total
  const allOk = mandatoryOk && gpaOk && creditsOk && volunteerOk
  return allOk ? undefined : '유의 필요'
}
