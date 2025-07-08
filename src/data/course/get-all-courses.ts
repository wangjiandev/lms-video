import { db } from '@/db'
import { course } from '@/db/schema'
import { desc, eq, getTableColumns } from 'drizzle-orm'

export async function getAllCourses() {
  const courses = await db
    .select({
      ...getTableColumns(course),
    })
    .from(course)
    .where(eq(course.status, 'Published'))
    .orderBy(desc(course.createdAt))

  return courses
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]
