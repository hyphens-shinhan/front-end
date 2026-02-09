import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useMandatoryActivityLookup } from './useMandatory'
import {
  useCreateSubmissionGoal,
  useUpdateSubmissionGoal,
  useSubmitSubmission,
} from './useMandatoryMutations'
import { useConfirmModalStore } from '@/stores'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import type { MandatoryGoalCreate, AcademicGoalCategory } from '@/types/mandatory'
import type { MandatoryActivityResponse } from '@/types/mandatory'
import { AcademicGoalCategory as AcademicGoalCategoryEnum } from '@/types/academic'

const MIN_GOALS = 2
const MAX_GOALS = 5

export interface GoalFormItem {
  category: AcademicGoalCategory | null
  custom_category?: string | null
  content: string
  plan: string
  outcome: string
}

function createEmptyGoal(): GoalFormItem {
  return {
    category: null,
    content: '',
    plan: '',
    outcome: '',
  }
}

export type MandatoryGoalFormStatus =
  | 'loading'
  | 'error'
  | 'empty'
  | 'submitted'
  | 'form'

export interface UseMandatoryGoalFormResult {
  status: MandatoryGoalFormStatus
  activity: MandatoryActivityResponse | null
  goals: GoalFormItem[]
  currentGoal: GoalFormItem
  activeGoalIndex: number
  setActiveGoalIndex: (index: number) => void
  accordionOpen: boolean
  setAccordionOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setCurrentGoal: (patch: Partial<GoalFormItem>) => void
  addGoal: () => void
  removeGoalCategory: (goalIndex: number) => void
  categoryLabels: AcademicGoalCategory[]
  selectedCategoriesForChips: { index: number; category: AcademicGoalCategory }[]
  pillLabels: string[]
  canAddGoal: boolean
  isFormValid: boolean
  saveDraft: () => void
  handleSubmit: () => void
  isSaving: boolean
}

/**
 * 학업 계획서(GOAL) 폼: API 조회/생성/수정/제출 훅 + 폼 상태
 * useMandatoryActivityLookup, useCreateSubmissionGoal, useUpdateSubmissionGoal, useSubmitSubmission 사용
 */
export function useMandatoryGoalForm(activityId: string): UseMandatoryGoalFormResult {
  const { data, isLoading, isError } = useMandatoryActivityLookup(activityId)
  const createGoal = useCreateSubmissionGoal()
  const updateGoal = useUpdateSubmissionGoal()
  const submitSubmission = useSubmitSubmission()
  const openConfirmModal = useConfirmModalStore((s) => s.onOpen)
  const toast = useToast()

  const [goals, setGoals] = useState<GoalFormItem[]>(() => [
    createEmptyGoal(),
    createEmptyGoal(),
  ])
  const [activeGoalIndex, setActiveGoalIndex] = useState(0)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const activity = data?.activity ?? null
  const submission = data?.submission ?? null
  const isSubmitted = submission?.is_submitted ?? false

  useEffect(() => {
    if (!submission) return
    setSubmissionId(submission.id)
    const fromApi = submission.goals ?? []
    if (fromApi.length >= MIN_GOALS) {
      setGoals(
        fromApi.map((g) => ({
          category: g.category as AcademicGoalCategory | null,
          custom_category: g.custom_category ?? null,
          content: g.content ?? '',
          plan: g.plan ?? '',
          outcome: g.outcome ?? '',
        }))
      )
    }
  }, [submission?.id, submission?.goals])

  const currentGoal = goals[activeGoalIndex] ?? createEmptyGoal()
  const categoryLabels = useMemo(
    () => Object.keys(AcademicGoalCategoryEnum) as AcademicGoalCategory[],
    []
  )

  const setCurrentGoal = useCallback(
    (patch: Partial<GoalFormItem>) => {
      setGoals((prev) => {
        const next = [...prev]
        const cur = next[activeGoalIndex]
        if (cur) next[activeGoalIndex] = { ...cur, ...patch }
        return next
      })
    },
    [activeGoalIndex]
  )

  const addGoal = useCallback(() => {
    if (goals.length >= MAX_GOALS) return
    setGoals((prev) => [...prev, createEmptyGoal()])
    setActiveGoalIndex(goals.length)
  }, [goals.length])

  const removeGoalCategory = useCallback((goalIndex: number) => {
    setGoals((prev) => {
      const next = [...prev]
      const g = next[goalIndex]
      if (g) next[goalIndex] = { ...g, category: null }
      return next
    })
  }, [])

  const isFormValid = useMemo(() => {
    if (goals.length < MIN_GOALS) return false
    return goals.every(
      (g) =>
        g.category != null &&
        g.content.trim() !== '' &&
        g.plan.trim() !== '' &&
        g.outcome.trim() !== ''
    )
  }, [goals])

  const saveDraft = useCallback(() => {
    const body = {
      goals: goals.map((g) => ({
        category:
          g.category ??
          (AcademicGoalCategoryEnum.MAJOR_REVIEW as AcademicGoalCategory),
        custom_category: g.custom_category ?? null,
        content: g.content.trim(),
        plan: g.plan.trim(),
        outcome: g.outcome.trim(),
      })),
    }
    if (submissionId) {
      updateGoal.mutate(
        { submissionId, body },
        {
          onSuccess: () => toast.show(TOAST_MESSAGES.REPORT.DRAFT_SAVE_SUCCESS),
          onError: () => toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
        }
      )
    } else {
      createGoal.mutate(
        { activityId, body },
        {
          onSuccess: (res) => {
            setSubmissionId(res.id)
            toast.show(TOAST_MESSAGES.REPORT.DRAFT_SAVE_SUCCESS)
          },
          onError: () => toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
        }
      )
    }
  }, [
    activityId,
    submissionId,
    goals,
    updateGoal,
    createGoal,
    toast,
  ])

  const handleSubmit = useCallback(() => {
    openConfirmModal({
      title: '모두 잘 입력했나요?',
      content: (
        <div className="flex items-center justify-center body-7 text-grey-10">
          제출 후에는 임의로 수정할 수 없어요.
        </div>
      ),
      confirmText: '제출하기',
      onConfirm: () => {
        const body: { goals: MandatoryGoalCreate[] } = {
          goals: goals.map((g) => ({
            category: g.category!,
            custom_category: g.custom_category ?? null,
            content: g.content.trim(),
            plan: g.plan.trim(),
            outcome: g.outcome.trim(),
          })),
        }
        const doSubmit = (id: string) => {
          submitSubmission.mutate(id, {
            onSuccess: () => toast.show(TOAST_MESSAGES.REPORT.SUBMIT_SUCCESS),
            onError: () => toast.error(TOAST_MESSAGES.REPORT.SUBMIT_ERROR),
          })
        }
        if (submissionId) {
          updateGoal.mutate(
            { submissionId, body },
            {
              onSuccess: (res) => doSubmit(res.id),
              onError: () =>
                toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
            }
          )
        } else {
          createGoal.mutate(
            { activityId, body },
            {
              onSuccess: (res) => doSubmit(res.id),
              onError: () =>
                toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
            }
          )
        }
      },
    })
  }, [
    goals,
    submissionId,
    activityId,
    openConfirmModal,
    updateGoal,
    createGoal,
    submitSubmission,
    toast,
  ])

  const isSaving =
    createGoal.isPending || updateGoal.isPending || submitSubmission.isPending

  const pillLabels = useMemo(
    () => goals.map((_, i) => `목표 ${i + 1}`),
    [goals]
  )
  const selectedCategoriesForChips = useMemo(
    () =>
      goals
        .map((g, i) => (g.category ? { index: i, category: g.category } : null))
        .filter(Boolean) as {
          index: number
          category: AcademicGoalCategory
        }[],
    [goals]
  )

  const canAddGoal = goals.length < MAX_GOALS
  const status: MandatoryGoalFormStatus = isLoading
    ? 'loading'
    : isError || !data
      ? 'error'
      : !activity
        ? 'empty'
        : isSubmitted
          ? 'submitted'
          : 'form'

  return {
    status,
    activity,
    goals,
    currentGoal,
    activeGoalIndex,
    setActiveGoalIndex,
    accordionOpen,
    setAccordionOpen,
    setCurrentGoal,
    addGoal,
    removeGoalCategory,
    categoryLabels,
    selectedCategoriesForChips,
    pillLabels,
    canAddGoal,
    isFormValid,
    saveDraft,
    handleSubmit,
    isSaving,
  }
}
