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
  variant = 'default'
}: LogoProps) {

  const logoSize = {
    sm: 'h-12 w-40',
    md: 'h-16 w-56',
    lg: 'h-24 w-80'
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
          className={`h-full w-full object-contain ${
            variant === 'light' ? 'rounded-md bg-white px-2 py-1' : ''
          }`}
          priority
        />
      )}
    </Link>
  )
}
