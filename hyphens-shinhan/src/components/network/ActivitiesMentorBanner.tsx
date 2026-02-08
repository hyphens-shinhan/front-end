'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

export default function ActivitiesMentorBanner() {
  const router = useRouter()

  return (
    <div
      className={cn(
        'w-full max-w-[343px] px-4 py-4 bg-white rounded-2xl shadow-sm',
        'outline outline-[0.7px] outline-grey-2 outline-offset-[-0.7px]',
        'flex flex-col justify-start items-start gap-2.5'
      )}
    >
      <div className="w-full flex justify-start items-center gap-9">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <h2 className="text-base font-bold text-grey-10 leading-5">
            멘토링 신청하기
          </h2>
          <p className="text-sm font-medium text-grey-7 leading-5">
            관심 분야의 경험 많은 멘토에게 멘토링을 신청해 보세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(ROUTES.CHAT)}
          className="shrink-0 h-9 px-4 bg-primary-shinhanblue rounded-lg flex justify-center items-center text-white text-sm font-semibold leading-5 hover:opacity-90 transition-opacity"
        >
          신청하기
        </button>
      </div>
      <button
        type="button"
        onClick={() => router.push(ROUTES.CHAT)}
        className={cn(
          'w-full max-w-[310px] bg-grey-2 rounded-2xl mt-3 flex items-center justify-center gap-2.5',
          'text-sm font-medium text-grey-7 hover:bg-grey-3 transition-colors'
        )}
      >
        나의 멘토링 내역
      </button>
    </div>
  )
}
