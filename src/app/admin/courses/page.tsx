import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const Page = () => {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon />
          Add Course
        </Link>
      </div>
    </div>
  )
}

export default Page
