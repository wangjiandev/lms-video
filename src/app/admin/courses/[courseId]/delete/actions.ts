'use server'

import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { course } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/types'
import { requireAdmin } from '@/data/admin/require-admin'
import arcjet from '@/lib/arcjet'
import { fixedWindow, request } from '@arcjet/next'

const aj = arcjet.withRule(
  fixedWindow({
    mode: 'LIVE',
    window: '1m',
    max: 5,
  }),
)

export const deleteCourse = async (courseId: string): Promise<ActionResponse> => {
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

    await db.delete(course).where(eq(course.id, courseId))
    revalidatePath('/admin/courses')
    return {
      status: 'success',
      message: 'Course deleted successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to delete course',
    }
  }
}
