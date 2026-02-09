'use client'

import { useEffect, useRef } from 'react'
import { useAutoResize } from '@/hooks/useAutoResize'
import { useMandatoryGoalForm } from '@/hooks/mandatory/useMandatoryGoalForm'
import { cn } from '@/utils/cn'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import MandatoryGoalFormHeader from './MandatoryGoalFormHeader'
import MandatoryGoalTabsRow from './MandatoryGoalTabsRow'
import MandatoryGoalCategorySection from './MandatoryGoalCategorySection'
import MandatoryGoalTextareaField from './MandatoryGoalTextareaField'
import MandatoryGoalBottomButtons from './MandatoryGoalBottomButtons'
import type { AcademicGoalCategory } from '@/types/mandatory'

interface MandatoryGoalContentProps {
  activityId: string
}

/** 연간 필수 활동 – 학업 계획서(GOAL). API·폼 로직은 useMandatoryGoalForm 훅 사용 */
export default function MandatoryGoalContent({
  activityId,
}: MandatoryGoalContentProps) {
  const form = useMandatoryGoalForm(activityId)
  const contentResize = useAutoResize()
  const planResize = useAutoResize()
  const outcomeResize = useAutoResize()
  const categoriesRef = useRef<AcademicGoalCategory[]>(form.currentGoal.categories)
  categoriesRef.current = form.currentGoal.categories

  useEffect(() => {
    contentResize.handleResize()
  }, [form.currentGoal.content, contentResize.handleResize])
  useEffect(() => {
    planResize.handleResize()
  }, [form.currentGoal.plan, planResize.handleResize])
  useEffect(() => {
    outcomeResize.handleResize()
  }, [form.currentGoal.outcome, outcomeResize.handleResize])

  if (form.status === 'loading') {
    return (
      <div className={styles.loadingWrapper}>
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    )
  }

  if (form.status === 'error') {
    return (
      <div className={styles.errorEmptyWrapper}>
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  if (form.status === 'empty') {
    return (
      <div className={styles.errorEmptyWrapper}>
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  if (form.status === 'submitted') {
    return (
      <div className={styles.submittedWrapper}>
        <p className={styles.submittedTitle}>제출이 완료되었습니다.</p>
        <p className={styles.submittedDescription}>
          학업 계획서가 제출된 상태입니다. 수정이 필요하면 운영진에 문의해 주세요.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.formWrapper}>
      {/** 학습 목표 설정 헤더 */}
      <MandatoryGoalFormHeader />
      {/** 학습 목표 탭 */}
      <MandatoryGoalTabsRow
        tabLabels={form.pillLabels}
        activeIndex={form.activeGoalIndex}
        onTabChange={form.setActiveGoalIndex}
        onAddGoal={form.addGoal}
        canAddGoal={form.canAddGoal}
      />
      {/** 학습 목표 유형 – 클릭 시 바텀시트에서 선택(익명/실명과 동일 디자인, 다중 선택) */}
      <MandatoryGoalCategorySection
        categoryOptions={form.categoryLabels}
        selectedCategoriesForCurrentGoal={form.currentGoal.categories}
        selectedChips={form.selectedCategoriesForChips.filter(
          (c) => c.index === form.activeGoalIndex
        )}
        onToggleCategory={(cat) => {
          const cur = categoriesRef.current
          const next = cur.includes(cat)
            ? cur.filter((c) => c !== cat)
            : [...cur, cat]
          categoriesRef.current = next
          form.setCurrentGoal({ categories: next })
        }}
        onRemoveChip={form.removeGoalCategory}
      />

      {/** 학습 목표 주요 내용 텍스트필드 */}
      <MandatoryGoalTextareaField
        label="주요 내용"
        value={form.currentGoal.content}
        rows={2}
        onChange={(value: string) => form.setCurrentGoal({ content: value })}
        placeholder="2025년 동안 달성하고자 하는 구체적인 목표를 작성해주세요"
        caption="단순 운동/취미는 작성 불가합니다"
        textareaRef={contentResize.textareaRef}
        onResize={contentResize.handleResize}
      />

      {/** 학습 목표 실행 계획 텍스트필드 */}
      <MandatoryGoalTextareaField
        label="실행 계획"
        value={form.currentGoal.plan}
        rows={1}
        onChange={(value: string) => form.setCurrentGoal({ plan: value })}
        placeholder="목표 달성을 위한 노력에 대해 작성해주세요"
        caption="구체적인 행동 중심으로 작성해주세요"
        textareaRef={planResize.textareaRef}
        onResize={planResize.handleResize}
      />

      {/** 학습 목표 기대 성과 텍스트필드 */}
      <MandatoryGoalTextareaField
        label="기대 성과"
        value={form.currentGoal.outcome}
        rows={1}
        onChange={(value: string) => form.setCurrentGoal({ outcome: value })}
        placeholder="해당 목표를 통해 무엇을 얻고 싶나요?"
        caption="어떤 변화와 성과를 기대하나요?"
        textareaRef={outcomeResize.textareaRef}
        onResize={outcomeResize.handleResize}
      />

      {/** 학습 목표 하단 고정 버튼: 저장하기 / 제출하기 */}
      <MandatoryGoalBottomButtons
        onSave={form.saveDraft}
        onSubmit={form.handleSubmit}
        isSaving={form.isSaving}
        isSubmitDisabled={!form.isFormValid}
      />
    </div>
  )
}

const styles = {
  loadingWrapper: cn('flex flex-col py-20 pb-40'),
  errorEmptyWrapper: cn('flex flex-col px-4 py-8'),
  submittedWrapper: cn('px-4 py-6'),
  submittedTitle: cn('title-16 text-grey-11 mb-4'),
  submittedDescription: cn('body-6 text-grey-8'),
  formWrapper: cn('flex flex-col pb-40'),
}