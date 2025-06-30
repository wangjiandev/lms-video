import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Page = () => {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeftIcon />
        </Link>
        <h1 className="text-2xl font-bold">Courses Create</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Add the details of the course to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
