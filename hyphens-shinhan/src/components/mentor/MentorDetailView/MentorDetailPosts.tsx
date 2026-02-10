'use client'

import type { Mentor } from '@/types/mentor'
import type { MyPostItem } from '@/types/posts'
import { Icon } from '@/components/common/Icon'
import InfoTag from '@/components/common/InfoTag'
import Avatar from '@/components/common/Avatar'
import EmptyContent from '@/components/common/EmptyContent'
import { useUserPosts } from '@/hooks/posts/usePosts'
import { MyPostItemType } from '@/types/posts'

const AVATAR_FALLBACK = '/assets/images/male1.png'

function formatPostDate(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }
}

function categoryLabel(type: MyPostItemType): string {
  return type === MyPostItemType.FEED ? '게시판' : '자치회'
}

interface MentorDetailPostsProps {
  mentor: Mentor
}

export function MentorDetailPosts({ mentor }: MentorDetailPostsProps) {
  const { data, isLoading } = useUserPosts(mentor.id, 20, 0)
  const posts = data?.posts ?? []

  if (isLoading) {
    return (
      <section className="flex flex-col">
        <h2 className={styles.sectionTitle}>{mentor.name}님의 글</h2>
        <div className="py-6">
          <p className="body-8 text-grey-8">불러오는 중...</p>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="flex flex-col">
        <h2 className={styles.sectionTitle}>{mentor.name}님의 글</h2>
        <EmptyContent
          variant="empty"
          message="아직 작성한 글이 없어요."
          className="py-8"
        />
      </section>
    )
  }

  return (
    <section className="flex flex-col">
      <h2 className={styles.sectionTitle}>{mentor.name}님의 글</h2>
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} mentor={mentor} />
        ))}
      </div>
    </section>
  )
}

function PostCard({
  post,
  mentor,
}: {
  post: MyPostItem
  mentor: Mentor
}) {
  const { date, time } = formatPostDate(post.created_at)
  const authorName = post.author?.name ?? mentor.name
  const avatarSrc = post.author?.avatar_url ?? mentor.avatar ?? AVATAR_FALLBACK

  return (
    <>
      <article className={styles.article}>
        <InfoTag label={categoryLabel(post.type)} color="grey" />
        <div className="relative flex gap-3">
          <Avatar
            src={avatarSrc}
            alt=""
            size={41}
            containerClassName={styles.avatar}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={styles.authorName}>{authorName}</span>
              <span className={styles.meta}>{date}</span>
              <span className={styles.meta}>{time}</span>
            </div>
            <p className={styles.body}>
              {post.content ?? post.title ?? ''}
            </p>
          </div>
          <button
            type="button"
            className={styles.moreBtn}
            aria-label="더보기"
          >
            <Icon name="IconLLine3DotVertical" className="size-5" />
          </button>
        </div>
        <div className={styles.actions}>
          <span className={styles.actionItem}>
            <Icon name="IconLBoldHeart" className="size-5 text-grey-5" />
            {post.like_count}
          </span>
          <span className={styles.actionItem}>
            <Icon name="IconLBoldMessages3" className="size-5 text-grey-5" />
            {post.comment_count}
          </span>
        </div>
      </article>
      <div className="h-px w-full bg-grey-2" aria-hidden />
    </>
  )
}

const styles = {
  sectionTitle:
    'pb-2 pt-5 text-base font-bold leading-[22px] text-grey-11',
  article: 'flex flex-col gap-2.5 bg-white px-4 py-2.5',
  avatar: 'h-[41px] w-[41px] shrink-0 overflow-hidden rounded-full bg-grey-2',
  authorName: 'text-base font-bold leading-[22px] text-grey-11',
  meta: 'text-xs font-normal leading-[14px] text-grey-8',
  body: 'mt-1 line-clamp-2 text-sm font-normal leading-5 text-grey-11',
  moreBtn: 'shrink-0 p-1 text-grey-9 hover:opacity-80',
  actions: 'flex items-center justify-end gap-2.5 pl-[53px]',
  actionItem:
    'flex items-center gap-0.5 text-xs font-semibold leading-[14px] text-grey-9',
} as const
