'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useSignOut = () => {
  const router = useRouter()

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          toast.success('Logged out successfully')
        },
        onError: () => {
          toast.error('Failed to log out')
        },
      },
    })
  }

  return { signOut }
}
