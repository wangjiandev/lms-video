import 'server-only'

import { db } from '@/db'
import { requireAdmin } from './require-admin'
import { course } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export async function adminGetCourse(courseId: string) {
  const session = await requireAdmin()

  const data = await db.query.course.findFirst({
    with: {
      chapters: {
        with: {
          lessons: true,
        },
      },
    },
    where: eq(course.id, courseId),
  })

  if (!data) {
    return notFound()
  }

  return data
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourse>>
