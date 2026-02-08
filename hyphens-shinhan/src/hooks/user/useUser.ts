import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/user'

/**
 * 유저(프로필·프라이버시) 쿼리 키 관리 객체
 */
export const userKeys = {
  all: ['user'] as const,
  /** 홈용 내 프로필 (GET /users/me) */
  me: () => [...userKeys.all, 'me'] as const,
  /** 내 프로필 상세 (GET /users/me/profile) */
  myProfile: () => [...userKeys.all, 'me', 'profile'] as const,
  /** 내 프라이버시 설정 (GET /users/me/privacy) */
  myPrivacy: () => [...userKeys.all, 'me', 'privacy'] as const,
  /** 다른 유저 공개 프로필 (GET /users/{user_id}) */
  publicProfile: (userId: string) =>
    [...userKeys.all, 'public', userId] as const,
  /** 장학 유지 요건 요약 (GET /users/me/scholarship-eligibility) */
  scholarshipEligibility: (year?: number) =>
    [...userKeys.all, 'me', 'scholarship-eligibility', year] as const,
}

/**
 * 홈용 내 프로필 조회 (GET /users/me)
 */
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => UserService.getMe(),
  })
}

/**
 * 내 프로필 상세 조회 (GET /users/me/profile)
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: () => UserService.getMyProfile(),
  })
}

/**
 * 내 프라이버시 설정 조회 (GET /users/me/privacy)
 */
export const useMyPrivacy = () => {
  return useQuery({
    queryKey: userKeys.myPrivacy(),
    queryFn: () => UserService.getMyPrivacy(),
  })
}

/**
 * 다른 유저 공개 프로필 조회 (GET /users/{user_id})
 */
export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: userKeys.publicProfile(userId),
    queryFn: () => UserService.getPublicProfile(userId),
    enabled: !!userId,
  })
}

/**
 * 장학 유지 요건 요약 조회 (GET /users/me/scholarship-eligibility)
 * @param year - 조회 연도 (2000~2100, 미입력 시 현재 연도)
 */
export const useScholarshipEligibility = (year?: number) => {
  return useQuery({
    queryKey: userKeys.scholarshipEligibility(year),
    queryFn: () => UserService.getScholarshipEligibility(year),
  })
}
