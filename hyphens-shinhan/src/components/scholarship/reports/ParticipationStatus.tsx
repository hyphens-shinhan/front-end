'use client'

import Button from "@/components/common/Button"
import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

/** 활동 보고서 상세 - 참여 현황 섹션 (출석률, 참석 멤버 미리보기, 불참/출석 버튼) */
export default function ParticipationStatus() {
    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>참여 현황</h2>
            {/* 출석 진행률 */}
            <div className={styles.progressWrap}>
                <p className={styles.progressLabel}>참석 확인 9 / 10</p>
                <div className={styles.progressTrack} role="progressbar" aria-valuenow={9} aria-valuemin={0} aria-valuemax={10}>
                    <div className={styles.progressFill} style={{ width: '90%' }} />
                </div>
            </div>
            {/* 참석 멤버 프로필 미리보기 (겹쳐서 표시) */}
            <div className={styles.memberRow}>
                <div className={styles.memberPreviewContainer}>
                    <div className={styles.memberPreviewItem} />
                    <div className={styles.memberPreviewItem} />
                    <div className={styles.memberPreviewItem} />
                </div>
                <p className={styles.memberNames}>오시온, 김지우 외 7명</p>
                <div className={styles.arrowWrap}>
                    <Icon name='IconLLineArrowDown' size={24} />
                </div>
            </div>
            {/* 불참 / 출석 처리 버튼 */}
            <div className={styles.buttonRow}>
                <Button label='불참' size='L' type='warning' fullWidth />
                <Button label='출석' size='L' type='primary' fullWidth />
            </div>
        </div>
    )
}

const styles = {
    section: cn('pb-6'),
    sectionTitle: cn('title-16 text-grey-11 py-4.5'),
    progressWrap: cn('py-2'),
    progressLabel: cn('body-8 pb-2 text-grey-10'),
    /** 진행 바 배경(트랙) */
    progressTrack: cn('w-full h-2 rounded-[16px] bg-grey-2 overflow-hidden'),
    /** 진행 바 채워진 부분 - primary 색상 */
    progressFill: cn('h-full rounded-[16px] bg-primary-secondaryroyal'),
    memberRow: cn('flex items-center gap-3 py-2'),
    memberPreviewContainer: cn('flex -space-x-5'),
    memberPreviewItem: cn('w-10 h-10 rounded-full bg-grey-3 border'),
    memberNames: cn('body-6 text-grey-10'),
    arrowWrap: cn('ml-auto text-grey-9'),
    buttonRow: cn('flex gap-2 pt-2'),
}
