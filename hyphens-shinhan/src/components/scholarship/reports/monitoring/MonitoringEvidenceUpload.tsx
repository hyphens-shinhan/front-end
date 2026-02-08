import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import ReportTitle from '../ReportTitle'
import MonitoringEvidenceUploadItem from './MonitoringEvidenceUploadItem'

const CAPTION_TEXT =
  '오답노트, 스터디노트, 강의 수강내역, 과제물 등 목표 달성을 증명할 수 있는 자료를 자유롭게 올려주세요 (PDF, JPG, PNG 최대 10MB)'

export default function MonitoringEvidenceUpload() {
  return (
    <div className={styles.wrapper}>
      {/** 증빙자료 업로드 라벨 */}
      <div className={styles.labelWrapper}>
        <ReportTitle title='증빙자료를 업로드해주세요' checkIcon className='py-0' />
        <p className={styles.caption}>{CAPTION_TEXT}</p>
      </div>

      {/** 증빙자료 업로드, 삭제, 확인 영역 */}
      <div className={styles.contentWrapper}>
        {/** 증빙자료 업로드 완료 영역 */}
        <div className={styles.uploadedList}>
          <MonitoringEvidenceUploadItem fileName='4월_토익기출_오답노트' />
        </div>

        {/** 증빙자료 업로드 영역 */}
        <div className={styles.uploadZone}>
          <Icon name='IconLBoldFolderAdd' size={24} className={styles.uploadIcon} />
          <p className={styles.uploadLabel}>자료 업로드</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: cn('flex flex-col px-4 pt-6 gap-5.5'),
  labelWrapper: cn('flex flex-col gap-1.5'),
  caption: cn('font-caption-caption4 text-grey-8 break-keep'),
  contentWrapper: cn('flex flex-col gap-2'),
  uploadZone: cn(
    'flex items-center justify-center gap-2.5',
    'border border-dashed border-grey-6 rounded-[16px] px-4 py-3',
  ),
  uploadIcon: cn('text-grey-9'),
  uploadLabel: cn('font-caption-caption5 text-grey-9'),
  uploadedList: cn('flex flex-col gap-2.5'),
}