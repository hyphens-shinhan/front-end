import Button from '@/components/common/Button'
import { cn } from '@/utils/cn'
import ReportTitle from '../ReportTitle'

interface MonitoringGoalHeaderProps {
  /** 목표 추가 버튼 클릭 핸들러 */
  onAddGoal?: () => void
  /** 학습 목표 2개 이상 + 각 목표 내용 작성 완료 여부 (체크 표시) */
  isChecked?: boolean
}

export default function MonitoringGoalHeader({ onAddGoal, isChecked = false }: MonitoringGoalHeaderProps) {
  return (
    <div className={styles.container}>
      {/** 학습 목표 라벨 */}
      <div className={styles.labelWrapper}>
        <ReportTitle title='학습 목표를 설정해주세요' checkIcon isChecked={isChecked} className='py-0' />
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
  caption: cn('font-caption-caption4 text-grey-8'),
  button: cn('text-primary-shinhanblue'),
}