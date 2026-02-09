import type {
  MaintenanceDashboard,
  GpaTracking,
  CreditTracking,
  VolunteerTracking,
  EventTracking,
  IncomeTracking,
  VolunteerActivity,
  MaintenanceEvent,
} from '@/types/maintenance';

const mockVolunteerActivities: VolunteerActivity[] = [
  { id: 'v1', date: '2025-01-15', activityName: '지역사회 정화 활동', hours: 3, status: 'approved', organization: '지역사회 센터' },
  { id: 'v2', date: '2025-01-22', activityName: '과외 활동', hours: 2, status: 'approved', organization: '청소년 센터' },
  { id: 'v3', date: '2025-02-05', activityName: '공원 관리', hours: 4, status: 'approved' },
  { id: 'v4', date: '2025-03-10', activityName: '도서관 보조', hours: 3, status: 'approved' },
  { id: 'v5', date: '2025-04-05', activityName: '환경 정화 활동', hours: 4, status: 'pending' },
];

const mockEvents: MaintenanceEvent[] = [
  { id: 'e1', title: '지역 모임', date: '2025-04-15', time: '14:00', location: '서울 지역사회 센터', type: '지역 모임', attendanceStatus: 'attended' },
  { id: 'e2', title: '지역 명소 탐방', date: '2025-05-20', time: '10:00', location: '경복궁', type: '문화 활동', attendanceStatus: 'attended' },
  { id: 'e3', title: '스터디 모임', date: '2025-06-10', time: '15:00', location: '대학교 도서관', type: '스터디 모임', attendanceStatus: 'attended' },
  { id: 'e4', title: '장학 캠프', date: '2025-08-01', time: '10:00', location: '캠프장', type: '캠프', attendanceStatus: 'attended' },
  { id: 'e5', title: '스터디 모임', date: '2025-11-15', time: '15:00', location: '대학교 도서관', type: '스터디 모임', attendanceStatus: 'missed' },
  { id: 'e6', title: '송년회', date: '2025-12-10', time: '18:00', location: '호텔 연회장', type: '행사', attendanceStatus: 'upcoming' },
];

const totalVolunteerHours = mockVolunteerActivities.filter((a) => a.status === 'approved').reduce((s, a) => s + a.hours, 0);
const volunteerPending = mockVolunteerActivities.filter((a) => a.status === 'pending').reduce((s, a) => s + a.hours, 0);

const attendedEvents = mockEvents.filter((e) => e.attendanceStatus === 'attended');
const nextEvent = mockEvents.find((e) => e.attendanceStatus === 'upcoming');

const mockGpa: GpaTracking = {
  current: 4.5,
  required: 3.28,
  maxGpa: 4.5,
  lastUpdated: '2025-01-15',
  nextUpdate: '2026-04-30',
  semesterBreakdown: [{ semester: '1', gpa: 4.5, credits: 3 }],
  status: '충족',
};

const mockCredits: CreditTracking = {
  current: 18,
  required: 15,
  status: '충족',
  semesterBreakdown: [
    {
      semester: '2026-1',
      credits: 18,
      courses: [
        { name: '컴퓨터공학개론', credits: 3, grade: 'A' },
        { name: '자료구조', credits: 3, grade: 'B+' },
        { name: '영어회화', credits: 3, grade: 'A-' },
      ],
    },
  ],
  deadline: '2025-12-31',
  progressPercentage: Math.min(100, (18 / 15) * 100),
};

const mockVolunteer: VolunteerTracking = {
  current: totalVolunteerHours,
  required: 21,
  pending: volunteerPending,
  status: totalVolunteerHours >= 21 ? '충족' : '주의',
  activities: mockVolunteerActivities,
  deadline: '2025-12-31',
  progressPercentage: Math.min(100, (totalVolunteerHours / 21) * 100),
};

const mockEventTracking: EventTracking = {
  attended: attendedEvents.length,
  required: 8,
  missed: mockEvents.filter((e) => e.attendanceStatus === 'missed').length,
  upcoming: mockEvents.filter((e) => e.attendanceStatus === 'upcoming').length,
  status: attendedEvents.length >= 8 ? '충족' : '주의',
  events: mockEvents,
  nextEvent,
};

const mockIncome: IncomeTracking = {
  status: '충족',
  isBasicLivelihoodRecipient: false,
  isLegalNextLevelClass: true,
  supportBracket: 2,
  supportBracketRequired: 3,
  lastUpdated: '2025-01-15',
  nextApplicationDeadline: '2026-04-30',
  documents: [
    { id: 'd1', name: '학자금 지원구간 통지서', type: 'support_bracket_notification', uploadedDate: '2025-01-10', status: 'approved' },
  ],
};

const progressPercentage =
  (mockGpa.status === '충족' ? 20 : 0) +
  (mockCredits.status === '충족' ? 20 : 0) +
  (mockVolunteer.status === '충족' ? 20 : 0) +
  (mockEventTracking.status === '충족' ? 20 : 0) +
  (mockIncome.status === '충족' ? 20 : 0);

export function getMaintenanceDashboard(): MaintenanceDashboard {
  return {
    year: new Date().getFullYear(),
    overallStatus: '양호',
    criteria: {
      gpa: mockGpa,
      credits: mockCredits,
      volunteer: mockVolunteer,
      events: mockEventTracking,
      income: mockIncome,
    },
    nextDeadline: nextEvent
      ? { date: nextEvent.date, description: nextEvent.title, title: nextEvent.title }
      : { date: '2025-12-31', description: '봉사 시간 마감' },
    progressPercentage,
  };
}
