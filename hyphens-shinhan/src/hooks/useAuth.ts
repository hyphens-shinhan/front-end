'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error(error.message)
      console.log('data', data.session.access_token)
      return data
    },
    // 성공 시 처리
    onSuccess: () => {
      // 1. 기존 로그인 관련 쿼리 무효화
      queryClient.invalidateQueries()

      // 2. 홈 화면으로 이동 (이제 proxy.ts가 통과시켜줌)
      router.push('/')

      // 3. 페이지 새로고침을 통해 세션 쿠키 강제 갱신
      router.refresh()
    },
    // 실패 시 처리
    onError: (error: Error) => {
      console.error('Login Error:', error.message)
      alert(`로그인 실패: ${error.message}`)
    },
  })
}
