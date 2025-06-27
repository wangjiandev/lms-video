import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../../public/logo.png'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: 'outline',
          className: 'absolute top-4 left-4',
        })}>
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src={Logo} alt="logo" width={32} height={32} />
          EpxCMS
        </Link>
        {children}
        <div className="text-muted-foreground text-center text-sm text-balance">
          By continuing you agree to our{' '}
          <Link href="/terms" className="hover:text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Layout
