import 'server-only'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const requireAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return redirect('/login')
  }

  if (session?.user?.role !== 'admin') {
    return redirect('/not-admin')
  }
  return session
}
