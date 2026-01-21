import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { spawnSync } from "child_process";

// 서비스 워커에게 지금 데이터가 새 버전인지 알려주기 위해
// Git Hash나 UUID revision으로 불러오기
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

// 1. Serwist 설정 초기화
const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: "/~offline", revision}],
  swSrc: "src/sw.ts",         // 서비스 워커 소스 파일 (작성할 파일)
  swDest: "public/sw.js",     // 빌드 후 생성될 실제 서비스 워커 파일
});

// 2. 기존 Next.js 설정
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// 3. 설정을 Serwist로 감싸서 내보내기
export default withSerwist(nextConfig);
