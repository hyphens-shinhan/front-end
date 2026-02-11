'use client';

import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import ActivityCard from './ActivityCard'
import YearSelector from '../common/YearSelector'
import ActivityForm from './ActivityForm'
import EmptyContent from '@/components/common/EmptyContent'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import { EMPTY_CONTENT_MESSAGES, ROUTES } from '@/constants'
import type { ActivityStatusType } from '@/types'

/** 연간 필수 활동 항목 → activity_type별 상세 경로 */
function mandatoryItemHref(item: { id: string; activity_type?: string }) {
    const type = item.activity_type
    if (type === 'GOAL') return `${ROUTES.SCHOLARSHIP.MANDATORY.GOAL}/${item.id}`
    if (type === 'SIMPLE_REPORT') return `${ROUTES.SCHOLARSHIP.MANDATORY.CAMP}/${item.id}`
    if (type === 'URL_REDIRECT') return `${ROUTES.SCHOLARSHIP.MANDATORY.SURVEY}/${item.id}`
    return `${ROUTES.SCHOLARSHIP.MANDATORY.DETAIL}/${item.id}`
}

/** 내가 신청한 프로그램 항목 → 신한장학재단 공지 이벤트 상세 경로 */
function appliedProgramItemHref(item: { id: string }) {
    return `${ROUTES.COMMUNITY.EVENT.DETAIL}/${item.id}`
}

/** 활동 보고서 월: 4월~12월 (9개) */
const MONTHS = Array.from({ length: 9 }, (_, i) => i + 4);

export default function ActivityList() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data, isLoading, isError } = useActivitiesSummary();
    const yearFromUrl = searchParams.get('year')
    const parsedYear = yearFromUrl ? parseInt(yearFromUrl, 10) : null
    const [year, setYear] = useState<number | null>(null);
    const resolvedYear = year ?? parsedYear ?? data?.max_year ?? new Date().getFullYear();

    const handleYearChange = useCallback(
        (nextYear: number) => {
            setYear(nextYear)
            router.replace(`${ROUTES.SCHOLARSHIP.MAIN}?year=${nextYear}`, { scroll: false })
        },
        [router]
    )

    const { minYear, maxYear, yearlySummary } = useMemo(() => {
        if (!data) return { minYear: undefined, maxYear: undefined, yearlySummary: undefined };
        const summary = data.years.find((y) => y.year === resolvedYear);
        return {
            minYear: data.min_year,
            maxYear: data.max_year,
            yearlySummary: summary,
        };
    }, [data, resolvedYear]);

    const now = useMemo(() => ({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }), []);

    const mandatoryItems = useMemo(
        () =>
            yearlySummary?.mandatory_activities?.map((a) => ({
                id: a.id,
                title: a.title,
                dateLabel: a.due_date,
                status: (a.status === 'SUBMITTED' ? 'completed' : a.status === 'DRAFT' ? 'inProgress' : 'beforeStart') as ActivityStatusType,
                activity_type: a.activity_type,
            })) ?? [],
        [yearlySummary?.mandatory_activities]
    );

    const appliedProgramItems = useMemo(
        () =>
            yearlySummary?.applied_events?.map((e) => ({
                id: e.id,
                title: e.title,
                dateLabel: e.event_date,
                status: (e.status === 'CLOSED' ? 'completed' : e.status === 'OPEN' ? 'inProgress' : 'scheduled') as ActivityStatusType,
            })) ?? [],
        [yearlySummary?.applied_events]
    );

    const cardList = useMemo(() => {
        return MONTHS.map((monthNum) => {
            const monthData = yearlySummary?.months.find((m) => m.month === monthNum);
            const isCurrentMonth = now.year === resolvedYear && now.month === monthNum;
            const isMonitoring = (yearlySummary?.academic_is_monitored ?? false) && isCurrentMonth;
            const cr = monthData?.council_report;
            const title = cr?.title ?? null;

            // council_report가 없으면 beforeStart
            if (!cr) {
                return {
                    key: monthNum,
                    year: resolvedYear,
                    month: monthNum,
                    councilId: yearlySummary?.council_id ?? undefined,
                    title: undefined,
                    status: 'beforeStart' as ActivityStatusType,
                    isCurrentMonth,
                    isMonitoring,
                };
            }

            // 상태 결정: is_submitted가 true면 completed, exists가 true이고 is_submitted가 false면 inProgress, 그 외는 beforeStart
            const status: ActivityStatusType =
                cr.is_submitted
                    ? 'completed'
                    : cr.exists && !cr.is_submitted
                        ? 'inProgress'
                        : 'beforeStart';

            return {
                key: monthNum,
                year: resolvedYear,
                month: monthNum,
                councilId: yearlySummary?.council_id ?? undefined,
                title: title ?? undefined,
                status,
                isCurrentMonth,
                isMonitoring,
            };
        });
    }, [yearlySummary, resolvedYear, now.year, now.month]);

    if (isError) {
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.LIST}
                className="py-12"
            />
        );
    }

    return (
        <div className={styles.container}>
            <YearSelector
                year={resolvedYear}
                onYearChange={handleYearChange}
                minYear={minYear}
                maxYear={maxYear}
            />
            <div className={styles.cardContainer}>
                {cardList.map((card) => (
                    <ActivityCard
                        key={card.key}
                        year={card.year}
                        month={card.month}
                        councilId={card.councilId}
                        title={card.title}
                        status={card.status}
                        isCurrentMonth={card.isCurrentMonth}
                        isMonitoring={card.isMonitoring}
                    />
                ))}
            </div>

            <div className={styles.space} />
            <ActivityForm
                title="연간 필수 활동"
                items={mandatoryItems}
                emptyMessageKey="MANDATORY_ACTIVITY"
                getItemHref={mandatoryItemHref}
            />

            <div className={styles.space2} />
            <ActivityForm
                title="내가 신청한 프로그램"
                items={appliedProgramItems}
                emptyMessageKey="APPLIED_PROGRAMS"
                getItemHref={appliedProgramItemHref}
            />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col pb-40',
    ),
    cardContainer: cn(
        'grid grid-cols-3 gap-[10px] px-[21px] py-5',
    ),
    bannerContainer: cn(
        'px-4',
    ),
    space: cn(
        'h-13',
    ),
    space2: cn(
        'h-13',
    ),
};