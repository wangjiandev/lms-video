'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { GithubIcon, Loader2, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { toast } from 'sonner'

const LoginForm = () => {
  const router = useRouter()
  const [githubPending, startGithubTransition] = useTransition()
  const [emailPending, startEmailTransition] = useTransition()
  const [email, setEmail] = useState('')

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Sign In With Github, you will be redirected ...')
          },
          onError: ({ error }) => {
            toast.error('GitHub SignIn Failed: ' + error)
          },
        },
      })
    })
  }

  async function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('email otp send')
            router.push(`/verify-request?email=${email}`)
          },
          onError: ({ error }) => {
            toast.error('send email otp error')
          },
        },
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Welcome Back</CardTitle>
        <CardDescription>Login at your Github or Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button disabled={githubPending} onClick={signInWithGithub} className="w-full" variant="outline">
          {githubPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon />
              Sign in with Github
            </>
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-x-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">Or Continue With</span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button className="w-full" disabled={emailPending} onClick={signInWithEmail}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <MailIcon />
                Sign in with Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginForm
