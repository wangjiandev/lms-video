'use server'

import { requireAdmin } from '@/data/admin/require-admin'
import { db } from '@/db'
import { lesson } from '@/db/schema'
import { ActionResponse } from '@/lib/types'
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas'
import { eq } from 'drizzle-orm'

export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin()

    const result = lessonSchema.safeParse(values)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    await db
      .update(lesson)
      .set({
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      })
      .where(eq(lesson.id, lessonId))

    return {
      status: 'success',
      message: 'Lesson updated successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to update lesson',
    }
  }
}
