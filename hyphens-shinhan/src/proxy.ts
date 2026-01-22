import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
    matcher: [
      /*
       * 아래 경로들을 제외한 모든 요청에서 미들웨어 실행:
       * 1. api: API 라우트
       * 2. _next/static, _next/image: Next.js 기본 정적 자원
       * 3. favicon.ico, manifest.json, sw.js: PWA 및 메타데이터 파일
       * 4. icons: 아이콘 폴더 (PWA 아이콘 등)
       * 5. 정적 이미지 파일들: svg, png, jpg, jpeg, gif, webp
       */
      '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
  };