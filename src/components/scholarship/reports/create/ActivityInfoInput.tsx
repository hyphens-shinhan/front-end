'use client'

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useAutoResize } from "@/hooks/useAutoResize";
import { formatDateYMD } from "@/utils/date";
import ReportTitle from "../ReportTitle";
import Accordion from "@/components/common/Accordion";
import DatePicker from "@/components/common/DatePicker";
import Separator from "@/components/common/Separator";

const TEAM_DESCRIPTION_MAX_LENGTH = 150

/** YYYY-MM-DD 형식인지 여부 */
function isIsoDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

interface ActivityInfoInputProps {
    title: string
    date: string
    location: string
    description: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    setDate: React.Dispatch<React.SetStateAction<string>>
    setLocation: React.Dispatch<React.SetStateAction<string>>
    setDescription: React.Dispatch<React.SetStateAction<string>>
    /** 제목 섹션 체크 상태. 제목·활동 내역(설명) 둘 다 입력 시 true 권장 */
    isTitleChecked?: boolean
}

/** 활동 정보 입력 컴포넌트
 * @param title - 활동 제목
 * @param date - 활동 날짜 (YYYY-MM-DD 또는 빈 문자열)
 * @param location - 활동 장소
 * @param description - 활동 설명
 * @param setTitle - 활동 제목 설정
 * @param setDate - 활동 날짜 설정 (DatePicker에서 선택 시 호출)
 * @param setLocation - 활동 장소 설정 (장소 입력 시 호출)
 * @param setDescription - 활동 설명 설정
 * @param isTitleChecked - 섹션 체크 표시 (글자 입력 시 true 등)
 * @returns 활동 정보 입력 컴포넌트
 */
export default function ActivityInfoInput({ title, date, location, description, setDescription, setTitle, setDate, setLocation, isTitleChecked = false }: ActivityInfoInputProps) {
    const { textareaRef, handleResize } = useAutoResize()
    const [isDateOpen, setIsDateOpen] = useState(false)
    const [isLocationOpen, setIsLocationOpen] = useState(false)

    // GET으로 불러온 내용 등 description이 바뀔 때 textarea 높이 맞춤
    useEffect(() => {
        handleResize()
    }, [description, handleResize])

    const datePickerValue = isIsoDate(date) ? date : ''
    const displayDate = isIsoDate(date) ? formatDateYMD(date) : null

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
        handleResize()
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    return (
        <div className={styles.container}>
            {/** 활동 정보 제목 */}
            <ReportTitle title="활동에 대한 정보를 적어주세요" checkIcon={true} isChecked={isTitleChecked} />
            {/** 활동 제목 입력  */}
            <input type="text" placeholder="활동 제목" className={styles.input} value={title} onChange={handleTitleChange} />
            <Separator />

            {/** 날짜 선택: 아코디언 열면 DatePicker 표시 */}
            <div className="flex flex-col gap-2">
                <Accordion
                    title={displayDate ?? '날짜 선택'}
                    iconName="IconMBoldCalendar"
                    isOpen={isDateOpen}
                    onClick={() => setIsDateOpen((prev) => !prev)}
                />
                {isDateOpen && (
                    <DatePicker
                        value={datePickerValue}
                        onChange={(next) => setDate(next)}
                    />
                )}
            </div>
            <Separator />

            {/** 장소 선택: 아코디언 열면 입력란 표시, 닫히면 저장된 장소 표시 */}
            <div className="flex flex-col gap-2">
                <Accordion
                    title={location.trim() ? location : '장소 선택'}
                    iconName="IconMBoldLocation"
                    isOpen={isLocationOpen}
                    onClick={() => setIsLocationOpen((prev) => !prev)}
                />
                {isLocationOpen && (
                    <input
                        type="text"
                        placeholder="장소를 입력하세요"
                        className={cn(
                            'px-4 py-3 rounded-[16px] border border-grey-2',
                            'placeholder:body-5 placeholder:text-grey-8',
                            'body-6 text-grey-10 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky',
                            'min-h-[46px]',
                        )}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        autoFocus
                    />
                )}
            </div>

            {/** 팀 활동 설명칸 */}
            <div className={styles.textareaWrapper}>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="팀 활동에 대한 간단한 설명을 작성해주세요"
                    className={styles.textarea}
                    value={description}
                    onChange={handleDescriptionChange}
                    maxLength={TEAM_DESCRIPTION_MAX_LENGTH}
                />
                <span className={styles.charCount}>
                    {description.length}/{TEAM_DESCRIPTION_MAX_LENGTH}
                </span>
            </div>
        </div>
    )
}

const styles = {
    container: cn('flex flex-col px-4'),
    input: cn(
        'py-4.5 placeholder:text-grey-8 body-1',
        'text-grey-11 focus:outline-none'
    ),
    textareaWrapper: cn('flex flex-col gap-2 pt-3 pb-5.5'),
    textarea: cn(
        'px-4 py-3 rounded-[16px] border border-grey-2',
        'placeholder:body-5 placeholder:text-grey-8',
        'body-6 text-grey-10 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky',
        'min-h-[46px] resize-none scrollbar-hide',
    ),
    charCount: cn('font-caption-caption4 text-grey-8 text-right'),
}