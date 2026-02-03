'use client'

import Button from "@/components/common/Button"
import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

/** 활동 보고서 상세 - 활동 비용·영수증 섹션 (총 비용, 세부 내역, 영수증 버튼, 확인 완료) */
export default function ActivityCostReceipt() {
    return (
        <>
            <h2 className={styles.sectionTitle}>활동 비용과 영수증</h2>
            {/* 비용 요약 및 세부 내역 */}
            <div className={styles.card}>
                <div>
                    <div className={styles.totalRow}>
                        <p className={styles.totalLabel}>총 비용</p>
                        <span className={styles.totalAmount}>100,000원</span>
                    </div>
                    <p className={styles.detailLine}>대관료 50,000</p>
                    <p className={styles.detailLine}>점심식사 50,000</p>
                </div>
                {/* 영수증 아이콘 (OCR 등 연동 예정) */}
                <div className={styles.receiptIcon}>
                    <Icon name='IconLBoldReceipt' size={24} />
                </div>
            </div>
            {/** TODO: 제출 완료 화면에서는 버튼 비활성화 */}
            {/* 보고서 확인 완료 제출 버튼 */}
            <div className={styles.submitWrap}>
                <Button label='확인 완료' size='L' type='primary' fullWidth />
            </div>
        </>
    )
}

const styles = {
    sectionTitle: cn('title-16 text-grey-11 py-4.5'),
    card: cn('flex items-center justify-between px-4 py-3.5 bg-grey-1-1 rounded-[16px]'),
    totalRow: cn('flex items-center gap-[7px]'),
    totalLabel: cn('body-8 text-grey-10'),
    totalAmount: cn('body-5 font-bold text-grey-10'),
    detailLine: cn('body-8 text-grey-9'),
    receiptIcon: cn('flex items-center justify-center p-2.5 bg-grey-3 rounded-full text-grey-8'),
    submitWrap: cn('py-4'),
}
