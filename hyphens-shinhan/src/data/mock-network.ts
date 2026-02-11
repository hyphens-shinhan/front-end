import type { Person, Location } from '@/types/network'

/** 프로필 이미지 경로 (없으면 아바타 미표시) */
const PROFILE_IMAGES = [
  '/assets/images/woman1.png',
  '/assets/images/male1.png',
]

function getAvatarForPerson(id: string): string {
  const index = id.charCodeAt(id.length - 1) % PROFILE_IMAGES.length
  return PROFILE_IMAGES[index]
}

const DEFAULT_LOCATION: Location = {
  latitude: 37.5665,
  longitude: 126.978,
  address: '서울특별시',
}

export const MOCK_RECOMMENDED_PEOPLE: Person[] = [
  {
    id: 'rec1',
    name: '김민수',
    avatar: getAvatarForPerson('rec1'),
    generation: '1기',
    scholarshipType: '글로벌',
    university: '서울대학교',
    currentRole: '소프트웨어 엔지니어',
    company: '네이버',
    mutualConnections: 5,
    tags: ['기술', '스타트업'],
  },
  {
    id: 'rec2',
    name: '이지은',
    avatar: getAvatarForPerson('rec2'),
    generation: '2기',
    scholarshipType: '리더십',
    university: '연세대학교',
    currentRole: '프로덕트 매니저',
    company: '카카오',
    mutualConnections: 3,
    tags: ['프로덕트', '디자인'],
  },
  {
    id: 'rec3',
    name: '박준호',
    avatar: getAvatarForPerson('rec3'),
    generation: '3기',
    scholarshipType: '창의',
    university: '고려대학교',
    currentRole: '마케터',
    company: '삼성',
    mutualConnections: 8,
    tags: ['마케팅', '브랜딩'],
  },
]

export const MOCK_FOLLOWING: Person[] = [
  {
    id: 'fol1',
    name: '김철수',
    avatar: getAvatarForPerson('fol1'),
    generation: '1기',
    scholarshipType: '글로벌',
    university: '서울대학교',
    currentRole: 'CEO',
    company: '스타트업 A',
    isFollowing: true,
    mutualConnections: 12,
    tags: ['창업', '리더십'],
  },
  {
    id: 'fol2',
    name: '이영희',
    avatar: getAvatarForPerson('fol2'),
    generation: '2기',
    scholarshipType: '리더십',
    university: '연세대학교',
    currentRole: '디렉터',
    company: '스타트업 B',
    isFollowing: true,
    mutualConnections: 7,
    tags: ['디자인', 'UX'],
  },
  {
    id: 'fol3',
    name: '박민수',
    avatar: getAvatarForPerson('fol3'),
    generation: '3기',
    scholarshipType: '창의',
    university: '고려대학교',
    currentRole: '개발자',
    company: '스타트업 C',
    isFollowing: true,
    mutualConnections: 9,
    tags: ['개발', '기술'],
  },
]

export const MOCK_NEARBY_PEOPLE: Person[] = [
  {
    id: 'near1',
    name: '김민수',
    avatar: getAvatarForPerson('near1'),
    generation: '1기',
    scholarshipType: '글로벌',
    university: '서울대학교',
    location: { latitude: 37.5665, longitude: 126.978 },
    distance: 0.5,
    mutualConnections: 5,
    tags: ['기술', '스타트업'],
  },
  {
    id: 'near2',
    name: '이지은',
    avatar: getAvatarForPerson('near2'),
    generation: '2기',
    scholarshipType: '리더십',
    university: '연세대학교',
    location: { latitude: 37.5651, longitude: 126.9895 },
    distance: 1.2,
    mutualConnections: 3,
    tags: ['프로덕트', '디자인'],
  },
  {
    id: 'near3',
    name: '박준호',
    avatar: getAvatarForPerson('near3'),
    generation: '3기',
    scholarshipType: '창의',
    university: '고려대학교',
    location: { latitude: 37.5668, longitude: 126.9784 },
    distance: 0.3,
    mutualConnections: 8,
    tags: ['마케팅', '브랜딩'],
  },
]

/** 멘토 탭용 목데이터 (YB · n기 / 멘토 · n기, 팔로우 요청) */
export const MOCK_MENTORS: Person[] = [
  {
    id: 'ment1',
    name: '이지우',
    avatar: getAvatarForPerson('ment1'),
    generation: '1기',
    scholarshipType: '글로벌',
    mentorListRole: 'YB',
    tags: ['디자인'],
  },
  {
    id: 'ment2',
    name: '이지우',
    avatar: getAvatarForPerson('ment2'),
    generation: '1기',
    scholarshipType: '리더십',
    mentorListRole: 'YB',
    tags: ['서울'],
  },
  {
    id: 'ment3',
    name: '최지우',
    avatar: getAvatarForPerson('ment3'),
    generation: '1기',
    scholarshipType: '창의',
    mentorListRole: 'MENTOR',
    tags: ['OB'],
  },
  {
    id: 'ment4',
    name: '이지우',
    avatar: getAvatarForPerson('ment4'),
    generation: '1기',
    scholarshipType: '글로벌',
    mentorListRole: 'YB',
    tags: ['디자인'],
  },
  {
    id: 'ment5',
    name: '이지우',
    avatar: getAvatarForPerson('ment5'),
    generation: '1기',
    scholarshipType: '리더십',
    mentorListRole: 'YB',
    tags: ['서울'],
  },
  {
    id: 'ment6',
    name: '최지우',
    avatar: getAvatarForPerson('ment6'),
    generation: '1기',
    scholarshipType: '창의',
    mentorListRole: 'MENTOR',
    tags: ['OB'],
  },
  {
    id: 'ment7',
    name: '이지우',
    avatar: getAvatarForPerson('ment7'),
    generation: '1기',
    scholarshipType: '글로벌',
    mentorListRole: 'YB',
    tags: ['디자인'],
  },
]

export const CURRENT_LOCATION: Location = DEFAULT_LOCATION
