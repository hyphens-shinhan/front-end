import Button from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import ReportTitle from '../ReportTitle'

interface MonitoringGoalHeaderProps {
  /** 목표 추가 버튼 클릭 핸들러 */
  onAddGoal?: () => void
}

export default function MonitoringGoalHeader({ onAddGoal }: MonitoringGoalHeaderProps) {
  return (
    <div className={styles.container}>
      {/** 학습 목표 라벨 */}
      <div className={styles.labelWrapper}>
        <ReportTitle title='학습 목표를 설정해주세요' checkIcon={true} />
        <p className={styles.caption}>최소 2개의 목표가 필요해요</p>
      </div>

      {/** 학습 목표 추가/수정 버튼 */}
      <Button
        size='S'
        type='secondary'
        label='목표 추가'
        className={styles.button}
        onClick={onAddGoal}
      />
    </div>
  )
}

const styles = {
  container: cn('flex px-4 py-2 justify-between'),
  labelWrapper: cn('flex flex-col gap-1.5'),
  titleRow: cn('flex items-center gap-1.5'),
  title: cn('title-16 text-grey-11'),
  icon: cn('text-grey-4'),
  caption: cn('font-caption-caption4 text-grey-8'),
  button: cn('text-primary-shinhanblue'),
}