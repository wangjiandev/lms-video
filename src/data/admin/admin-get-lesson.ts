import { db } from '@/db'
import { requireAdmin } from './require-admin'
import { lesson } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export async function adminGetLesson(id: string) {
  const session = await requireAdmin()
  try {
    const data = await db.query.lesson.findFirst({
      where: eq(lesson.id, id),
    })

    if (!data) {
      return notFound()
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>
