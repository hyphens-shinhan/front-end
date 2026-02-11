import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import RQProvider from '@/providers/rq-provider'
import BottomModal from '@/components/common/BottomModal'
import CenterModal from '@/components/common/CenterModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import AlertModal from '@/components/common/AlertModal'
import ToastContainer from '@/components/common/ToastContainer'

const wantedSans = localFont({
  src: [
    {
      path: '../../public/fonts/WantedSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-ExtraBlack.ttf',
      weight: '950',
      style: 'normal',
    },
  ],
  variable: '--font-wanted-sans',
  display: 'swap',
  preload: true,
})

const oneShinhan = localFont({
  src: [
    {
      path: '../../public/fonts/OneShinhanLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OneShinhanMedium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OneShinhanBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-one-shinhan',
  display: 'swap',
  preload: true,
})

const APP_NAME = 'Hyphen'
const APP_DEFAULT_TITLE = 'Hyphen APP'
const APP_TITLE_TEMPLATE = '%s - Hyphen APP'
const APP_DESCRIPTION = 'Hyphen APP'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    apple: [
      // iOS Safari가 자동으로 요청하는 apple-touch-icon
      // 실제 아이콘 파일이 없어도 메타 태그로 404 방지
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "contain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`${wantedSans.variable} ${oneShinhan.variable}`}>
      <head />
      <body>
        <RQProvider>
          {children}
          {/* 전역 모달 */}
          <BottomModal />
          <CenterModal />
          <ConfirmModal />
          <AlertModal />
          <ToastContainer />
        </RQProvider>
      </body>
    </html>
  );
}
