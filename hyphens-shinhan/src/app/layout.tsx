import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import RQProvider from '@/providers/rq-provider'
import BottomModal from '@/components/common/BottomModal'
import CenterModal from '@/components/common/CenterModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import AlertModal from '@/components/common/AlertModal'
import ToastContainer from '@/components/common/ToastContainer'

const APP_NAME = '하이픈'
const APP_DEFAULT_TITLE = '하이픈'
const APP_TITLE_TEMPLATE = '%s - 하이픈'
const APP_DESCRIPTION = '하이픈 앱'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    icon: '/assets/images/shinhan.png',
    apple: '/assets/images/shinhan.png',
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
    <html lang="en" dir="ltr">
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
