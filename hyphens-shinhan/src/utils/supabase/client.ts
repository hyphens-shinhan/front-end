import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // 환경 변수 이름이 정확히 일치해야 합니다.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}