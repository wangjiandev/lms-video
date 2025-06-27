'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const LoginOut = () => {
  const router = useRouter()
  const loginOut = async () => {
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
  return (
    <>
      <Button onClick={loginOut} variant="secondary">
        LoginOut
      </Button>
    </>
  )
}

export default LoginOut
