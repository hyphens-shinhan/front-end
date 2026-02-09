'use client'

import { useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { EMPTY_CONTENT_MESSAGES, ROUTES } from '@/constants'
import { MentorDetailView, MentorNotFoundView } from '@/components/mentor/MentorDetailView'
import { BottomNavContent } from '@/components/common/BottomNav'
import { useUserStore, toNavRole, useHeaderStore } from '@/stores'
import { MentorDetailPageProvider, useMentorDetailPage } from './MentorDetailPageContext'

/** Header title when mentor is not found (멘토 매칭 flow, not mentor detail). */
const MENTOR_NOT_FOUND_HEADER_TITLE = '나의 멘토링 내역'

function MentorDetailContent() {
  const router = useRouter()
  const { mentor, loading } = useMentorDetailPage()
  const setCustomTitle = useHeaderStore((s) => s.setCustomTitle)
  const setHandlers = useHeaderStore((s) => s.setHandlers)
  const resetHandlers = useHeaderStore((s) => s.resetHandlers)

  useEffect(() => {
    if (!loading && !mentor) {
      setCustomTitle(MENTOR_NOT_FOUND_HEADER_TITLE)
      setHandlers({
        onBack: () => router.push(ROUTES.NETWORK.MAIN),
      })
      return () => {
        setCustomTitle(null)
        resetHandlers()
      }
    }
    setCustomTitle(null)
    resetHandlers()
  }, [loading, mentor, setCustomTitle, setHandlers, resetHandlers, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-[600px] items-center justify-center px-5 py-12 md:px-6">
          <p className="body-8 text-grey-8">
            {EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
          </p>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return <MentorNotFoundView />
  }

  return <MentorDetailView mentor={mentor} />
}

export default function MentorDetailPage() {
  const params = useParams()
  const pathname = usePathname()
  const user = useUserStore((s) => s.user)
  const userRole = user ? toNavRole(user.role) : 'YB'
  const mentorId = params.id as string

  const bottomNav = (
    <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto max-w-md bg-white shadow-[0px_0px_20px_3px_rgba(0,0,0,0.04)]">
      <BottomNavContent pathname={pathname} userRole={userRole} />
    </div>
  )

  return (
    <>
      <MentorDetailPageProvider mentorId={mentorId}>
        <MentorDetailContent />
      </MentorDetailPageProvider>
      {bottomNav}
    </>
  )
}
