import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface MonitoringEvidenceUploadItemProps {
  /** 파일명 */
  fileName: string
  /** 삭제 버튼 클릭 핸들러 */
  onRemove?: () => void
}

export default function MonitoringEvidenceUploadItem({
  fileName,
  onRemove,
}: MonitoringEvidenceUploadItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Icon name='IconMBoldDocumentText' size={20} className={styles.icon} />
        <span className={styles.fileName}>{fileName}</span>
      </div>
      <button
        type='button'
        aria-label='첨부 삭제'
        className={styles.removeButton}
        onClick={onRemove}
      >
        <Icon name='IconLLineClose' size={24} className={styles.removeIcon} />
      </button>
    </div>
  )
}

const styles = {
  container: cn(
    'flex flex-row items-center justify-between gap-2.5',
    'px-3 py-2 min-h-[46px]',
    'bg-grey-2 border border-grey-3 rounded-[16px]',
  ),
  left: cn('flex flex-row items-center gap-2.5 min-w-0'),
  icon: cn('text-grey-9 shrink-0'),
  fileName: cn('body-8 text-grey-9 truncate'),
  removeButton: cn('shrink-0 p-0 border-0 bg-transparent cursor-pointer'),
  removeIcon: cn('text-grey-9'),
}
