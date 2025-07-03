import { db } from '@/db'
import { requireAdmin } from './require-admin'
import { course } from '@/db/schema'
import { desc, getTableColumns } from 'drizzle-orm'

export async function adminGetCourses() {
  const session = await requireAdmin()

  const courses = await db
    .select({
      ...getTableColumns(course),
    })
    .from(course)
    .orderBy(desc(course.createdAt))

  return courses
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0]
