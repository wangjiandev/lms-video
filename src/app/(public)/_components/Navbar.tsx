'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { authClient } from '@/lib/auth-client'
import { buttonVariants } from '@/components/ui/button'
import UserDropdown from './UserDropdown'

const navigations = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Courses',
    href: '/courses',
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
]

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="font-bold">EpxCMS</span>
        </Link>

        <nav className="hidden md:flex md:w-full md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {navigations.map((navigation) => (
              <Link
                key={navigation.name}
                href={navigation.href}
                className="hover:text-primary text-sm font-medium transition-colors">
                {navigation.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropdown name={session.user.name} email={session.user.email} image={session.user.image ?? ''} />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: 'secondary',
                  })}>
                  Login
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: 'default',
                  })}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
