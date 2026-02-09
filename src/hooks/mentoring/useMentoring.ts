import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MentoringService } from '@/services/mentoring'

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
      mentorId ? MentoringService.getMentorById(mentorId) : Promise.resolve(null),
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
