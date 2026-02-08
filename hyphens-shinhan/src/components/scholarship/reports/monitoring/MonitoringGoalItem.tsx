import Accordion from '@/components/common/Accordion'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface MonitoringGoalItemProps {
  /** 목표 순번 (예: 1, 2, 3) */
  goalIndex: number
  /** 삭제 버튼 클릭 핸들러 */
  onRemove?: () => void
}

export default function MonitoringGoalItem({
  goalIndex,
  onRemove,
}: MonitoringGoalItemProps) {
  return (
    <div className={styles.container}>
      {/** 학습 목표 라벨 */}
      <div className={styles.labelRow}>
        <p className={styles.title}>목표 {goalIndex}</p>
        <button type='button' onClick={onRemove} aria-label='목표 삭제'>
          <Icon name='IconLLineClose' size={20} className={styles.removeIcon} />
        </button>
      </div>
      {/** 학습 목표 상세 카테고리 선택 */}
      <div className={styles.detailWrapper}>
        <Accordion
          title='카테고리 선택'
          className={styles.accordion}
          titleColor={styles.accordionTitleColor}
        />
        {/** 학습 내용 입력칸 */}
        <textarea
          placeholder='학습 내용을 입력해주세요'
          className={styles.textarea}
          rows={1}
        />

        {/** 달성도를 %로 나타내주세요 */}
        <textarea
          placeholder='달성도를 %로 나타내주세요'
          className={styles.textarea}
          rows={1}
        />
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col'),
  labelRow: cn('flex justify-between py-2 px-4'),
  title: cn('title-16 text-grey-10'),
  removeIcon: cn('text-grey-9'),
  detailWrapper: cn('flex flex-col px-4 pt-2 pb-7.5 gap-2.5'),
  accordion: cn('px-4 py-3 border border-grey-3 rounded-[16px]'),
  accordionTitleColor: cn('text-grey-9'),
  textarea: cn(
    'px-4 py-2 border-b border-grey-2',
    'focus:outline-none focus:ring-0 focus:border-primary-secondaryroyal',
    'placeholder:body-5 placeholder:text-grey-8 text-grey-11 body-6',
  ),
}
