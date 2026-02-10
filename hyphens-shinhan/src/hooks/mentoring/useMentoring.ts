import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query'
import { MentoringService } from '@/services/mentoring'
import type { MentorMatch, MatchScore } from '@/types/mentor'

export const mentoringKeys = {
  all: ['mentoring'] as const,
  mentors: (params?: {
    field?: string
    method?: string
    search?: string
    limit?: number
    offset?: number
  }) => [...mentoringKeys.all, 'mentors', params ?? {}] as const,
  mentor: (mentorId: string) =>
    [...mentoringKeys.all, 'mentor', mentorId] as const,
  recommendations: (params?: { limit?: number; offset?: number }) =>
    [...mentoringKeys.all, 'recommendations', params ?? {}] as const,
  recommendationCards: (params?: { limit?: number; offset?: number }) =>
    [...mentoringKeys.all, 'recommendationCards', params ?? {}] as const,
  sentRequests: (params?: { limit?: number; offset?: number }) =>
    [...mentoringKeys.all, 'requests', 'sent', params ?? {}] as const,
}

export const useMentors = (params?: {
  field?: string
  method?: string
  search?: string
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: mentoringKeys.mentors(params),
    queryFn: () => MentoringService.getMentors(params),
  })
}

export const useMentorById = (mentorId: string | null) => {
  return useQuery({
    queryKey: mentoringKeys.mentor(mentorId ?? ''),
    queryFn: () =>
      mentorId
        ? MentoringService.getMentorById(mentorId)
        : Promise.resolve(null),
    enabled: !!mentorId,
  })
}

export const useMentorRecommendations = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: mentoringKeys.recommendations(params),
    queryFn: () => MentoringService.getRecommendations(params),
  })
}

export const useMentorRecommendationCards = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: mentoringKeys.recommendationCards(params),
    queryFn: () => MentoringService.getRecommendationCards(params),
  })
}

/**
 * 추천 API(/mentoring/recommendations) 기반으로 MentorMatch[] 구성 훅
 * - 추천 카드(match_score) + 멘토 상세(/mentoring/mentors/{id})를 합쳐 기존 UI(MentorMatchCard)를 그대로 사용
 */
export const useMentorRecommendationMatches = (params?: {
  limit?: number
  offset?: number
}) => {
  const recQuery = useMentorRecommendationCards(params)
  const cards = recQuery.data?.recommendations ?? []

  const mentorQueries = useQueries({
    queries: cards.map((card) => ({
      queryKey: mentoringKeys.mentor(card.mentor_id),
      queryFn: () => MentoringService.getMentorById(card.mentor_id),
      enabled: recQuery.isSuccess,
    })),
  })

  const isLoadingMentors =
    recQuery.isLoading || mentorQueries.some((q) => q.isLoading)
  const mentorError = mentorQueries.find((q) => q.isError)?.error

  const matches: MentorMatch[] = recQuery.isSuccess
    ? (cards
        .map((card, idx) => {
          const mentor = mentorQueries[idx]?.data
          if (!mentor) return null
          const total = Math.round(card.match_score ?? 0)
          const score: MatchScore = {
            total,
            category: 0,
            goalAlignment: 0,
            availability: 0,
            personality: 0,
            bonus: 0,
            reasons: [],
          }
          return { mentor, score }
        })
        .filter(Boolean) as MentorMatch[])
    : []

  return {
    recommendationsQuery: recQuery,
    mentorQueries,
    matches,
    isLoading: isLoadingMentors,
    error: recQuery.error ?? mentorError,
    refetch: async () => {
      await recQuery.refetch()
      await Promise.all(mentorQueries.map((q) => q.refetch?.()))
    },
  }
}

export const useSentMentoringRequests = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: mentoringKeys.sentRequests(params),
    queryFn: () => MentoringService.getSentRequests(params),
  })
}

export const useCreateMentoringRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { mentor_id: string; message?: string | null }) =>
      MentoringService.createRequest(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentoringKeys.all })
    },
  })
}
