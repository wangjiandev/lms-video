import { db } from '@/db'
import { chapter, course, lesson } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export async function getIndividualCourse(slug: string) {
  const courseData = await db.query.course.findFirst({
    where: eq(course.slug, slug),
    with: {
      chapters: {
        orderBy: [asc(chapter.position)],
        with: {
          lessons: {
            orderBy: [asc(lesson.position)],
          },
        },
      },
    },
  })

  if (!courseData) {
    return notFound()
  }

  return courseData
}

export type PublicIndividualCourseType = Awaited<ReturnType<typeof getIndividualCourse>>
