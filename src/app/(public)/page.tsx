import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'

interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'AI-Powered Learning',
    description: 'AI-powered learning to help you learn faster and better.',
    icon: '🤖',
  },
  {
    title: 'Interactive Learning',
    description: 'Interactive learning to help you learn faster and better.',
    icon: '🎓',
  },
  {
    title: 'Affordable Pricing',
    description: 'Affordable pricing to help you learn faster and better.',
    icon: '💰',
  },
  {
    title: 'Certified Courses',
    description: 'Certified courses to help you learn faster and better.',
    icon: '🔵',
  },
]

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant="outline"> The Future of online education</Badge>
          <h1 className="text-4xl md:text-6xl">Elevate your learning with AI</h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover the power of AI to transform your learning experience. Master new skills, expand your knowledge,
            and achieve learning paths.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/courses"
              className={buttonVariants({
                size: 'lg',
                variant: 'default',
              })}>
              Explore Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: 'lg',
                variant: 'outline',
              })}>
              Login
            </Link>
          </div>
        </div>
      </section>
      <section className="mb-36 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 text-4xl">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}

export default Page
