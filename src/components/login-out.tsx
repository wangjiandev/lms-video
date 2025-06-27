'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'

const LoginOut = () => {
  const loginOut = async () => {
    await authClient.signOut()
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
