import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { COMPANY_NAME, COMPANY_TAGLINE } from './constants/company'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${COMPANY_NAME} - ${COMPANY_TAGLINE}`,
  description: 'حلول تقنية مبتكرة للأفراد والشركات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}