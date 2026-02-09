import type {
  MentorCategory,
  DayOfWeek,
  TimeOfDay,
  MeetingFormat,
  MentorshipStyle,
  CommunicationStyle,
  WorkPace,
} from '@/types/mentor'

/** 멘토 상세 페이지용 카테고리 라벨 (짧은 형태) */
export const MENTOR_CATEGORY_LABELS: Record<MentorCategory, string> = {
  career_job_search: '취업',
  academic_excellence: '학업',
  leadership_soft_skills: '리더십',
  entrepreneurship_innovation: '창업',
  mental_health_wellness: '정신건강',
  financial_management: '재무',
  personal_development: '자기계발',
  volunteer_community_service: '봉사',
  specific_major_field: '전공',
}

/** 요일 라벨 */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일',
}

/** 시간대 라벨 */
export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: '오전',
  afternoon: '오후',
  evening: '19시 이후',
  late_night: '밤',
  flexible: '유연',
}

/** 선호 방식(미팅 포맷) 라벨 */
export const MEETING_FORMAT_LABELS: Record<MeetingFormat, string> = {
  zoom: '비대면',
  google_meet: '비대면',
  in_person: '대면',
  phone_call: '전화',
  any: '무관',
}

/** 멘토링 스타일/커뮤니케이션/워크페이스 라벨 (멘토링 정보 스타일용) */
export const STYLE_LABELS: Record<
  MentorshipStyle | CommunicationStyle | WorkPace,
  string
> = {
  hands_on: '실습',
  advisory: '조언',
  inspirational: '영감',
  direct: '직설적',
  collaborative: '협업',
  supportive: '부드러운',
  fast_paced: '빠른',
  steady: '꾸준한',
  flexible: '유연한',
}

/** 선호 주기 옵션 (데이터에 없으면 기본 문구) */
export const PREFERRED_FREQUENCY_LABEL = '일회성, 주기적'
