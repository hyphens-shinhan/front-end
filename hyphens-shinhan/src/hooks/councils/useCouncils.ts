import { useQuery } from '@tanstack/react-query'
import { CouncilsService } from '@/services/councils'
import type { CouncilListParams, CouncilMeParams } from '@/services/councils'

/** Councils 쿼리 키 */
export const councilKeys = {
  all: ['councils'] as const,
  lists: () => [...councilKeys.all, 'list'] as const,
  list: (params?: CouncilListParams) =>
    [...councilKeys.lists(), params] as const,
  details: () => [...councilKeys.all, 'detail'] as const,
  detail: (councilId: string) => [...councilKeys.details(), councilId] as const,
  /** GET /councils/{council_id}/members */
  members: (councilId: string) =>
    [...councilKeys.detail(councilId), 'members'] as const,
  /** GET /councils/me/{year} */
  me: (year: number, params?: CouncilMeParams) =>
    [...councilKeys.all, 'me', year, params] as const,
}

/**
 * 회의 목록 조회 (GET /councils, query: year?, region?)
 */
export const useCouncils = (params?: CouncilListParams) => {
  return useQuery({
    queryKey: councilKeys.list(params),
    queryFn: () => CouncilsService.getList(params),
  })
}

/**
 * 회의 단건 조회 (GET /councils/{council_id})
 */
export const useCouncil = (councilId: string) => {
  return useQuery({
    queryKey: councilKeys.detail(councilId),
    queryFn: () => CouncilsService.getById(councilId),
    enabled: !!councilId,
  })
}

/**
 * 회의 멤버 목록 조회 (GET /councils/{council_id}/members)
 */
export const useCouncilMembers = (councilId: string) => {
  return useQuery({
    queryKey: councilKeys.members(councilId),
    queryFn: () => CouncilsService.getMembers(councilId),
    enabled: !!councilId,
  })
}

/**
 * 내 회의 + 활동 상태 조회 (GET /councils/me/{year}, admin: user_id?)
 */
export const useMyCouncils = (year: number, params?: CouncilMeParams) => {
  return useQuery({
    queryKey: councilKeys.me(year, params),
    queryFn: () => CouncilsService.getMyCouncils(year, params),
    enabled: !!year,
  })
}
