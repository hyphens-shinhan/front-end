/**
 * Mandatory / Academic 등 여러 모듈에서 공통으로 쓰는 타입
 */

/** 활동/보고서 진행 상태 (StatusTag, ActivityCard, ActivityForm 등에서 공통 사용) */
export type ActivityStatusType =
  | 'inProgress'
  | 'scheduled'
  | 'completed'
  | 'beforeStart'

/** 학업 목표 카테고리 (Mandatory GOAL, Academic 월별 보고서 등에서 공통 사용) */
export type AcademicGoalCategory =
  | 'MAJOR_REVIEW'
  | 'ENGLISH_STUDY'
  | 'CERTIFICATION_PREP'
  | 'STUDY_GROUP'
  | 'ASSIGNMENT_EXAM_PREP'
  | 'OTHER'
