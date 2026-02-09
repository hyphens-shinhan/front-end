'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@/components/common/Icon'
import { ROUTES } from '@/constants'

export default function MentoringApplicationCard() {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl border border-grey-2 shadow-none p-4 sm:p-5">
      <div className="flex items-center justify-between gap-9 mb-2.5">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-base text-grey-10 leading-[22px]">
            멘토링 신청하기
          </h3>
          <p className="text-sm text-grey-7 leading-5">
            전장학생 및 전문 멘토 연결
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
          className="px-5 py-2.5 bg-primary-shinhanblue text-white font-semibold text-sm leading-5 rounded-lg hover:opacity-90 transition-colors shrink-0"
        >
          신청하기
        </button>
      </div>
      <button
        type="button"
        onClick={() => router.push(ROUTES.MENTORS.HISTORY)}
        className="w-full flex items-center justify-between bg-grey-2 rounded-xl px-4 py-3 hover:bg-grey-3 transition-colors"
      >
        <span className="font-medium text-base text-grey-10 leading-[22px]">
          나의 멘토링 내역
        </span>
        <Icon name="IconLLineArrowRight" size={20} className="text-grey-5" />
      </button>
    </div>
  )
}
