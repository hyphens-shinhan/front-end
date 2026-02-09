This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📚 디자인 시스템 가이드

이 프로젝트는 Figma에서 추출한 디자인 토큰을 자동으로 Tailwind CSS에 등록하여 사용합니다.

### 🧩 주요 공통 컴포넌트

- **[Button](./src/components/common/Button.tsx)**: 다양한 스타일과 크기를 지원하는 공통 버튼
- **[InfoTag](./src/components/common/InfoTag.tsx)**: 정보 표시를 위한 태그 (Blue, Grey, Green, Yellow)
- **[StatusTag](./src/components/common/StatusTag.tsx)**: 상태 표시를 위한 태그 (Blue, Grey, Green, Yellow)
- **[Icon](./src/components/common/Icon/Icon.tsx)**: SVG 아이콘 시스템

**👉 [디자인 시스템 상세 가이드 보기](./DESIGN_SYSTEM.md)**

디자인 시스템 가이드에서 다음 내용을 확인할 수 있습니다:

- 공통 컴포넌트 사용 방법 (InfoTag, StatusTag 등)
- 폰트 사용 방법 (Title, Body, Caption 등)
- 컬러 사용 방법 (Primary, State, Greyscale)
- 스페이싱 및 간격 사용 방법
- 전체 유틸리티 클래스 목록
- 디자인 토큰 업데이트 방법

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
