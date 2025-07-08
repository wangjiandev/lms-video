import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { adminGetCourses } from '@/data/admin/admin-get-courses'
import { AdminCourseCard, AdminCourseCardSkeleton } from './_components/AdminCourseCard'
import EmptyState from '@/components/general/EmptyState'
import { Suspense } from 'react'

const Page = () => {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon />
          Add Course
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  )
}

async function RenderCourses() {
  const courses = await adminGetCourses()
  return (
    <>
      {courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a course to get started"
          buttonText="Add Course"
          buttonLink="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  )
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default Page
