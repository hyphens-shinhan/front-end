// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // expect, describe 등을 import 없이 사용 가능함
    environment: 'jsdom', // 브라우저 환경 모사
    setupFiles: './src/tests/setup.ts', // 테스트 시작 전 실행할 파일
    include: ['src/**/*.{test,spec}.{ts,tsx}'], // 테스트 파일 찾기 규칙
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @ 별칭 인식 설정
    },
  },
});