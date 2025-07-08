'use server'

import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { course } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/types'
import { requireAdmin } from '@/data/admin/require-admin'

export const deleteCourse = async (courseId: string): Promise<ActionResponse> => {
  await requireAdmin()
  try {
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
