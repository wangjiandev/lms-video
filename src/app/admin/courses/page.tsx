import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { adminGetCourses } from '@/data/admin/admin-get-courses'
import AdminCourseCard from './_components/AdminCourseCard'

const Page = async () => {
  const courses = await adminGetCourses()

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon />
          Add Course
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default Page
