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
