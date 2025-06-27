'use client'

import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const VerifyRequestPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') as string

  const [otpPending, startOtpTransition] = useTransition()
  const [otp, setOtp] = useState('')
  const isVerified = otp.length === 6

  const handleVerify = () => {
    startOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email verified')
            router.push('/')
          },
          onError: ({ error }) => {
            toast.error('Email verification failed')
          },
        },
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Request</CardTitle>
        <CardDescription>We sent a code to your email. Please enter it below to verify your request.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP maxLength={6} className="gap-2" value={otp} onChange={(value) => setOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0}></InputOTPSlot>
              <InputOTPSlot index={1}></InputOTPSlot>
              <InputOTPSlot index={2}></InputOTPSlot>
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3}></InputOTPSlot>
              <InputOTPSlot index={4}></InputOTPSlot>
              <InputOTPSlot index={5}></InputOTPSlot>
            </InputOTPGroup>
          </InputOTP>
          <p className="text-muted-foreground text-sm">Enter the code sent to your email address.</p>
        </div>
        <Button className="w-full" onClick={handleVerify} disabled={otpPending || !isVerified }>
          {otpPending ? <Loader2 className="size-4 animate-spin" /> : 'Verify'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default VerifyRequestPage
