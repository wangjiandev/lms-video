'use server'

import { db } from '@/db'
import { chapter, course, lesson } from '@/db/schema'
import { ActionResponse } from '@/lib/types'
import { courseSchema, type CourseSchemaType } from '@/lib/zodSchemas'
import { nanoid } from 'nanoid'
import { requireAdmin } from '@/data/admin/require-admin'
import arcjet from '@/lib/arcjet'
import { detectBot, fixedWindow, request } from '@arcjet/next'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const aj = arcjet
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 5,
    }),
  )

export async function editCourse(courseId: string, data: CourseSchemaType): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    const req = await request()
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    })

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: 'error',
          message: 'you have been blocked due to rate limiting',
        }
      } else {
        return {
          status: 'error',
          message: 'you are bot! if this is a mistake, please contact support',
        }
      }
    }

    const validation = courseSchema.safeParse(data)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid data',
      }
    }

    const result = await db
      .update(course)
      .set({
        ...validation.data,
      })
      .where(and(eq(course.id, courseId), eq(course.userId, session.user.id)))

    return {
      status: 'success',
      message: 'Course created successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to create course',
    }
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: 'error',
        message: 'No lessons to reorder',
      }
    }

    await db.transaction(async (tx) => {
      await Promise.all(
        lessons.map(async (item) => {
          return tx
            .update(lesson)
            .set({
              position: item.position,
            })
            .where(and(eq(lesson.id, item.id), eq(lesson.chapterId, chapterId)))
        }),
      )
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: 'success',
      message: 'Lessons reordered successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to reorder lessons',
    }
  }
}

export async function reorderChapters(
  chapters: { id: string; position: number }[],
  courseId: string,
): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: 'error',
        message: 'No chapters to reorder',
      }
    }

    await db.transaction(async (tx) => {
      await Promise.all(
        chapters.map(async (item) => {
          return tx
            .update(chapter)
            .set({
              position: item.position,
            })
            .where(and(eq(chapter.id, item.id), eq(chapter.courseId, courseId)))
        }),
      )
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: 'success',
      message: 'Chapters reordered successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to reorder chapters',
    }
  }
}
