'use client'

import { cn } from "@/utils/cn"

/** 활동 보고서 상세 - 활동 정보 섹션 (제목, 기간, 설명) */
export default function ActivityInfo() {
    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>활동 정보</h2>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>활동 계획과 규칙 정하기</h3>
                <time className={styles.date}>2025.01.01 ~ 2025.12.31</time>
                <p className={styles.description}>이번 활동에서는 활동 계획 및 규칙을 정하고, 팀원들과 함께 의미 있는 시간을 보냈습니다. 모든 참가자들이 적극적으로 참여했습니다! 자치회 활동의 시작이 좋습니다!</p>
            </div>
        </div>
    )
}

const styles = {
    section: cn('pb-4'),
    sectionTitle: cn('title-16 text-grey-11 py-4.5'),
    card: cn('flex flex-col gap-2.5 p-5 border border-grey-2 rounded-[16px]'),
    cardTitle: cn('body-2 font-bold text-grey-10'),
    date: cn('font-caption-caption2 text-grey-8'),
    description: cn('body-8 text-grey-11'),
}
