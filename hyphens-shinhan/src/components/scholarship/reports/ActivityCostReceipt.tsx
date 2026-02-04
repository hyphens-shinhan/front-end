'use client'

import Button from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import type { ReceiptResponse } from '@/types/reports'

interface ActivityCostReceiptProps {
  receipts: ReceiptResponse[]
}

/** 활동 보고서 상세 - 활동 비용·영수증 섹션 (총 비용, 세부 내역, 영수증) */
export default function ActivityCostReceipt({ receipts }: ActivityCostReceiptProps) {
  const totalAmount = receipts.reduce((sum, r) => {
    return sum + r.items.reduce((s, i) => s + i.price, 0)
  }, 0)

  const detailLines = receipts.flatMap((r) =>
    r.items.map((i) => ({ label: i.item_name, price: i.price }))
  )

  return (
    <>
      <h2 className={styles.sectionTitle}>활동 비용과 영수증</h2>
      <div className={styles.card}>
        <div>
          <div className={styles.totalRow}>
            <p className={styles.totalLabel}>총 비용</p>
            <span className={styles.totalAmount}>
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          {detailLines.map((line, idx) => (
            <p key={idx} className={styles.detailLine}>
              {line.label} {line.price.toLocaleString()}
            </p>
          ))}
        </div>
        <div className={styles.receiptIcon}>
          <Icon name="IconLBoldReceipt" size={24} />
        </div>
      </div>
      <div className={styles.submitWrap}>
        <Button label="확인 완료" size="L" type="primary" fullWidth />
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
