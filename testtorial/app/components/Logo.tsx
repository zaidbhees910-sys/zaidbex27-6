import Link from 'next/link'
import Image from 'next/image'
import { COMPANY_NAME } from '../constants/company'

type LogoProps = {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
}

export default function Logo({
  showText = true,
  size = 'md',
}: LogoProps) {

  const logoSize = {
    sm: 'h-10 w-36',
    md: 'h-12 w-44',
    lg: 'h-20 w-72',
  }

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center justify-center ${logoSize[size]}`}
      aria-label={COMPANY_NAME}
    >
      {showText && (
        <Image
          src="/bec-logo.png"
          alt={COMPANY_NAME}
          width={892}
          height={369}
          className="h-full w-full object-contain"
          priority
        />
      )}
    </Link>
  )
}
