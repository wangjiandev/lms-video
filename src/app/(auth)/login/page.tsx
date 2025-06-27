import { redirect } from 'next/navigation'
import LoginForm from './_components/LoginForm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user) {
    redirect('/')
  }
  return <LoginForm />
}

export default Page
