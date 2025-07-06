'use server'

import { db } from '@/db'
import { chapter, course, lesson } from '@/db/schema'
import { ActionResponse } from '@/lib/types'
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  lessonSchema,
  LessonSchemaType,
  type CourseSchemaType,
} from '@/lib/zodSchemas'
import { nanoid } from 'nanoid'
import { requireAdmin } from '@/data/admin/require-admin'
import arcjet from '@/lib/arcjet'
import { detectBot, fixedWindow, request } from '@arcjet/next'
import { and, asc, desc, eq } from 'drizzle-orm'
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

export async function createChapter(data: ChapterSchemaType): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    const validation = chapterSchema.safeParse(data)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid data',
      }
    }

    await db.transaction(async (tx) => {
      const lastChapter = await tx.query.chapter.findFirst({
        where: eq(chapter.courseId, validation.data.courseId),
        orderBy: desc(chapter.position),
      })

      await tx.insert(chapter).values({
        title: validation.data.name,
        courseId: validation.data.courseId,
        position: lastChapter ? lastChapter.position + 1 : 1,
      })
    })

    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`)

    return {
      status: 'success',
      message: 'Chapter created successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to create chapter',
    }
  }
}

export async function createLesson(data: LessonSchemaType): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    const validation = lessonSchema.safeParse(data)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid data',
      }
    }

    await db.transaction(async (tx) => {
      const lastLesson = await tx.query.lesson.findFirst({
        where: eq(lesson.chapterId, validation.data.chapterId),
        orderBy: desc(lesson.position),
      })

      await tx.insert(lesson).values({
        title: validation.data.name,
        chapterId: validation.data.chapterId,
        description: validation.data.description,
        thumbnailKey: validation.data.thumbnailKey,
        videoKey: validation.data.videoKey,
        position: lastLesson ? lastLesson.position + 1 : 1,
      })
    })

    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`)

    return {
      status: 'success',
      message: 'Lesson created successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to create lesson',
    }
  }
}

export async function deleteLesson(courseId: string, chapterId: string, lessonId: string): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    const chapterWithLessons = await db.query.lesson.findMany({
      columns: {
        id: true,
        position: true,
      },
      where: eq(lesson.chapterId, chapterId),
      orderBy: asc(lesson.position),
    })

    if (!chapterWithLessons) {
      return {
        status: 'error',
        message: 'Chapter not found',
      }
    }

    const lessonToDeleteIndex = chapterWithLessons.findIndex((lesson) => lesson.id === lessonId)

    if (lessonToDeleteIndex === -1) {
      return {
        status: 'error',
        message: 'Lesson not found',
      }
    }

    const remainingLessons = chapterWithLessons.filter((lesson) => lesson.id !== lessonId)

    await db.transaction(async (tx) => {
      await tx.delete(lesson).where(eq(lesson.id, lessonId))
      await Promise.all(
        remainingLessons.map(async (item, index) => {
          return tx
            .update(lesson)
            .set({
              position: index + 1,
            })
            .where(eq(lesson.id, item.id))
        }),
      )
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: 'success',
      message: 'Lesson deleted successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to delete lesson',
    }
  }
}

export async function deleteChapter(courseId: string, chapterId: string): Promise<ActionResponse> {
  const session = await requireAdmin()
  try {
    const chapters = await db.query.chapter.findMany({
      where: eq(chapter.courseId, courseId),
    })

    if (!chapters || chapters.length === 0) {
      return {
        status: 'error',
        message: 'Chapter not found',
      }
    }

    const chapterToDeleteIndex = chapters.findIndex((chapter) => chapter.id === chapterId)

    if (chapterToDeleteIndex === -1) {
      return {
        status: 'error',
        message: 'Lesson not found',
      }
    }

    const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId)

    await db.transaction(async (tx) => {
      await tx.delete(chapter).where(eq(chapter.id, chapterId))
      await Promise.all(
        remainingChapters.map(async (item, index) => {
          return tx
            .update(chapter)
            .set({
              position: index + 1,
            })
            .where(eq(chapter.id, item.id))
        }),
      )
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: 'success',
      message: 'Chapter deleted successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to delete chapter',
    }
  }
}
