'use client'

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useAutoResize } from "@/hooks/useAutoResize";
import ReportTitle from "../ReportTitle";
import Accordion from "@/components/common/Accordion";
import Separator from "@/components/common/Separator";
import CalendarModal from "@/components/common/CalendarModal";

const TEAM_DESCRIPTION_MAX_LENGTH = 150

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
 * @param date - 활동 날짜
 * @param location - 활동 장소
 * @param description - 활동 설명
 * @param setTitle - 활동 제목 설정
 * @param setDescription - 활동 설명 설정
 * @param isTitleChecked - 섹션 체크 표시 (글자 입력 시 true 등)
 * @returns 활동 정보 입력 컴포넌트
 */
export default function ActivityInfoInput({ title, date, location, description, setDescription, setTitle, setDate, setLocation, isTitleChecked = false }: ActivityInfoInputProps) {
    const { textareaRef, handleResize } = useAutoResize()
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [locationModalOpen, setLocationModalOpen] = useState(false)

    // GET으로 불러온 내용 등 description이 바뀔 때 textarea 높이 맞춤
    useEffect(() => {
        handleResize()
    }, [description, handleResize])

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

            {/** 날짜 선택: 클릭 시 인라인 캘린더 */}
            <div className="flex flex-col gap-2">
                <Accordion
                    title="날짜 선택"
                    iconName="IconMBoldCalendar"
                    isOpen={calendarOpen}
                    onClick={() => setCalendarOpen((v) => !v)}
                />
                {date && date !== 'YYYY.MM.DD' && !calendarOpen && (
                    <p className="body-6 text-grey-10 pl-8">{date}</p>
                )}
                {calendarOpen && (
                    <CalendarModal
                        isOpen
                        inline
                        onClose={() => setCalendarOpen(false)}
                        value={date}
                        onSelect={(dateString) => {
                            setDate(dateString)
                            setCalendarOpen(false)
                        }}
                    />
                )}
            </div>
            <Separator />

            {/** 장소 선택: 클릭 시 인라인 입력 */}
            <div className="flex flex-col gap-2">
                <Accordion
                    title="장소 선택"
                    iconName="IconMBoldLocation"
                    isOpen={locationModalOpen}
                    onClick={() => setLocationModalOpen((v) => !v)}
                />
                {location && !locationModalOpen && (
                    <p className="body-6 text-grey-10 pl-8">{location}</p>
                )}
                {locationModalOpen && (
                    <LocationInputInline
                        value={location}
                        onConfirm={(value) => {
                            setLocation(value)
                            setLocationModalOpen(false)
                        }}
                        onCancel={() => setLocationModalOpen(false)}
                        placeholder="장소를 입력하세요"
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

/** 인라인 장소 입력: input + 취소/확인 (팝업 없음) */
function LocationInputInline({
    value,
    onConfirm,
    onCancel,
    placeholder,
}: {
    value: string
    onConfirm: (value: string) => void
    onCancel: () => void
    placeholder: string
}) {
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    const handleConfirm = () => {
        onConfirm(inputValue.trim())
    }

    return (
        <div className="w-full bg-white rounded-xl border border-grey-2 p-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full px-4 py-3 rounded-xl border border-grey-2 body-8 text-grey-11 mb-3',
                    'placeholder:text-grey-6 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky focus:border-primary-secondarysky',
                )}
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl body-8 text-grey-9 bg-grey-2"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl body-8 font-medium text-white bg-primary-shinhanblue"
                >
                    확인
                </button>
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