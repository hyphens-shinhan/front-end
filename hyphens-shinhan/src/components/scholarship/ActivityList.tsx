'use client';

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import ActivityCard from './ActivityCard'
import YearSelector from '../common/YearSelector'
import ActivityForm from './ActivityForm'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import { ROUTES } from '@/constants'

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

    const handleYearChange = (nextYear: number) => {
        setYear(nextYear)
        router.replace(`${ROUTES.SCHOLARSHIP.MAIN}?year=${nextYear}`, { scroll: false })
    }

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-grey-9">로딩 중...</p>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-grey-9">활동 정보를 불러오지 못했습니다.</p>
            </div>
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
                {MONTHS.map((monthNum) => {
                    const monthData = yearlySummary?.months.find((m) => m.month === monthNum);
                    const isCurrentMonth = now.year === resolvedYear && now.month === monthNum;
                    const isMonitoring = (yearlySummary?.academic_is_monitored ?? false) && isCurrentMonth;
                    const title = monthData?.council_report?.title ?? null;
                    const status = monthData?.council_report?.is_completed ? 'completed' : 'beforeStart';
                    return (
                        <ActivityCard
                            key={monthNum}
                            year={resolvedYear}
                            month={monthNum}
                            title={title ?? undefined}
                            status={status}
                            isCurrentMonth={isCurrentMonth}
                            isMonitoring={isMonitoring}
                        />
                    );
                })}
            </div>

            <div className={styles.space} />
            <ActivityForm
                title="연간 필수 활동"
                items={yearlySummary?.mandatory_report?.activities?.map((a) => ({
                    id: a.id,
                    title: a.title,
                    dateLabel: a.due_date,
                    status: a.is_submitted ? 'completed' : 'beforeStart',
                }))}
                emptyMessageKey="MANDATORY_ACTIVITY"
            />

            <div className={styles.space2} />
            <ActivityForm
                title="내가 신청한 프로그램"
                items={yearlySummary?.applied_events?.events?.map((e) => ({
                    id: e.id,
                    title: e.title,
                    dateLabel: e.event_date,
                    status: e.status === 'CLOSED' ? 'completed' : e.status === 'OPEN' ? 'inProgress' : 'scheduled',
                }))}
                emptyMessageKey="APPLIED_PROGRAMS"
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
        'h-20',
    ),
    space2: cn(
        'h-13',
    ),
};