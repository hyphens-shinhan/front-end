import type { GoalCreate } from '@/types/academic'
import { AcademicGoalCategory } from '@/types/academic'

/** 학업 목표 카테고리 → 표시 라벨 (학업 모니터링 등에서 공통 사용) */
export const ACADEMIC_GOAL_CATEGORY_LABELS: Record<
  GoalCreate['category'],
  string
> = {
  [AcademicGoalCategory.MAJOR_REVIEW]: '유지 심사',
  [AcademicGoalCategory.ENGLISH_STUDY]: '영어 학습',
  [AcademicGoalCategory.CERTIFICATION_PREP]: '자격증 준비',
  [AcademicGoalCategory.STUDY_GROUP]: '스터디 그룹',
  [AcademicGoalCategory.ASSIGNMENT_EXAM_PREP]: '과제/시험 준비',
  [AcademicGoalCategory.OTHER]: '기타',
}
