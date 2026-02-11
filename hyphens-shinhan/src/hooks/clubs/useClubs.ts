import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { ClubService } from '@/services/clubs'
import type { ClubListQuery } from '@/types/clubs'

/**
 * 소모임 쿼리 키 관리 객체
 */
export const clubKeys = {
  all: ['clubs'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (filters: ClubListQuery | undefined) =>
    [...clubKeys.lists(), filters] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: string) => [...clubKeys.details(), id] as const,
  /** 갤러리 목록 쿼리 키 */
  gallery: (clubId: string, filters?: { limit?: number; offset?: number }) =>
    [...clubKeys.detail(clubId), 'gallery', filters] as const,
  /** 멤버 목록 쿼리 키 */
  members: (clubId: string) =>
    [...clubKeys.detail(clubId), 'members'] as const,
  /** 랜덤 닉네임 생성 쿼리 키 */
  randomNickname: () => [...clubKeys.all, 'random-nickname'] as const,
}

/**
 * 소모임 목록 조회 (무한 스크롤)
 */
export const useInfiniteClubs = (query?: ClubListQuery, limit = 20) => {
  return useInfiniteQuery({
    queryKey: [...clubKeys.lists(), 'infinite', query, limit] as const,
    queryFn: ({ pageParam = 0 }) =>
      ClubService.getClubs({ ...query, limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.total ? nextOffset : undefined
    },
  })
}

/**
 * 소모임 목록 조회 (단일 페이지)
 */
export const useClubs = (query?: ClubListQuery) => {
  return useQuery({
    queryKey: clubKeys.list(query),
    queryFn: () => ClubService.getClubs(query),
  })
}

/**
 * 소모임 상세 조회
 */
export const useClub = (clubId: string) => {
  return useQuery({
    queryKey: clubKeys.detail(clubId),
    queryFn: () => ClubService.getClub(clubId),
    enabled: !!clubId,
  })
}

/**
 * 갤러리 이미지 목록 조회
 */
export const useGalleryImages = (
  clubId: string,
  query?: { limit?: number; offset?: number },
) => {
  return useQuery({
    queryKey: clubKeys.gallery(clubId, query),
    queryFn: () => ClubService.getGalleryImages(clubId, query),
    enabled: !!clubId,
  })
}

/**
 * 소모임 멤버 목록 조회
 */
export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: clubKeys.members(clubId),
    queryFn: () => ClubService.getClubMembers(clubId),
    enabled: !!clubId,
  })
}

/**
 * 랜덤 닉네임 생성 조회
 * enabled를 false로 설정하고 refetch를 사용하여 버튼 클릭 시 호출 가능
 * 또는 useMutation을 사용할 수도 있음
 */
export const useRandomNickname = (enabled = false) => {
  return useQuery({
    queryKey: clubKeys.randomNickname(),
    queryFn: () => ClubService.generateClubNickname(),
    enabled,
    staleTime: 0, // 항상 새로운 닉네임을 가져오도록
  })
}
