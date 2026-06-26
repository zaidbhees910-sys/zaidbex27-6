import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { COMPANY_NAME, COMPANY_TAGLINE } from './constants/company'
import Providers from './components/Providers'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

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
      <body className={cairo.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}