'use client'

import type { Mentor } from '@/types/mentor'
import { Icon } from '@/components/common/Icon'
import InfoTag from '@/components/common/InfoTag'
import { cn } from '@/utils/cn'

/** Placeholder post for "멘토의 글" section until API exists */
const PLACEHOLDER_POST = {
  id: 'placeholder_1',
  category: '게시판',
  authorName: '', // filled from mentor.name
  date: '12월 14일',
  time: '12:20',
  body: '소모임 활동으로 지역 봉사에 참여했어!! 응애응애응애응애응애응애응애응애응애응애응애응애',
  likeCount: 18,
  commentCount: 9,
}

interface MentorDetailPostsProps {
  mentor: Mentor
}

export function MentorDetailPosts({ mentor }: MentorDetailPostsProps) {
  const post = {
    ...PLACEHOLDER_POST,
    authorName: mentor.name,
  }
  const avatarSrc = mentor.avatar || '/assets/images/male1.png'

  return (
    <section className="flex flex-col">
      <h2 className="pb-2 pt-5 text-base font-bold leading-[22px] text-grey-11">
        {mentor.name}님의 글
      </h2>
      <div className="flex flex-col">
        <article className="flex flex-col gap-2.5 bg-white px-4 py-2.5">
          <InfoTag label={post.category} color="grey" />
          <div className="relative flex gap-3">
            <div className="h-[41px] w-[41px] shrink-0 overflow-hidden rounded-full bg-grey-2">
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold leading-[22px] text-grey-11">
                  {post.authorName}
                </span>
                <span className="text-xs font-normal leading-[14px] text-grey-8">
                  {post.date}
                </span>
                <span className="text-xs font-normal leading-[14px] text-grey-8">
                  {post.time}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm font-normal leading-5 text-grey-11">
                {post.body}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 p-1 text-grey-9 hover:opacity-80"
              aria-label="더보기"
            >
              <Icon name="IconLLine3DotVertical" className="size-5" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2.5 pl-[53px]">
            <span className="flex items-center gap-0.5 text-xs font-semibold leading-[14px] text-grey-9">
              <Icon name="IconLBoldHeart" className="size-5 text-grey-5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-semibold leading-[14px] text-grey-9">
              <Icon name="IconLBoldMessages3" className="size-5 text-grey-5" />
              {post.commentCount}
            </span>
          </div>
        </article>
        <div className="h-px w-full bg-grey-2" aria-hidden />
      </div>
    </section>
  )
}
