'use client';

import { cn } from "@/utils/cn";
import ActivityCard from "./ActivityCard";
import YearSelector from "../common/YearSelector";
import { useState } from "react";
import ActivityBanner from "./ActivityBanner";
import ActivityForm from "./ActivityForm";

export default function ActivityList() {
    const [year, setYear] = useState(2025);

    return (
        <div>
            {/** 년도 선택 컴포넌트 */}
            <YearSelector
                year={year}
                onYearChange={setYear}
                minYear={2020}
                maxYear={2026}
            />
            {/** 활동 카드 리스트 */}
            <div className={styles.container}>
                {Array.from({ length: 9 }).map((_, index) => (
                    <ActivityCard key={index} />
                ))}
            </div>

            <div className={styles.space} />
            {/** 연간 필수 활동 */}
            <ActivityForm title="연간 필수 활동" />

            <div className={styles.space2} />
            {/** 신청한 프로그램 */}
            <ActivityForm title="내가 신청한 프로그램" />
        </div>
    );
}

const styles = {
    container: cn(
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