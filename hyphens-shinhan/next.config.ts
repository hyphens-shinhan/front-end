import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'
import { spawnSync } from 'child_process'

// 서비스 워커에게 지금 데이터가 새 버전인지 알려주기 위해
// Git Hash나 UUID revision으로 불러오기
const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout ??
  crypto.randomUUID()

// 1. Serwist 설정 초기화
const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'src/sw.ts', // 서비스 워커 소스 파일 (작성할 파일)
  swDest: 'public/sw.js', // 빌드 후 생성될 실제 서비스 워커 파일
})

// 2. 기존 Next.js 설정
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // SVGR 설정을 추가
  webpack(config) {
    // SVG 파일을 처리하는 기존 규칙이 있다면 제외하고 SVGR을 적용합니다.
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true, // SVG 내부 크기 대신 props 크기 우선
            svgoConfig: {
              plugins: [
                {
                  name: 'convertColors',
                  params: {
                    currentColor: true, // 고정 색상을 currentColor로 자동 변환
                  },
                },
              ],
            },
          },
        },
      ],
    })

    return config
  },
}

// 3. 설정을 Serwist로 감싸서 내보내기
export default withSerwist(nextConfig)
