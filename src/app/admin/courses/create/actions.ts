'use server'

import { db } from '@/db'
import { course } from '@/db/schema'
import { auth } from '@/lib/auth'
import { ActionResponse } from '@/lib/types'
import { courseSchema, type CourseSchemaType } from '@/lib/zodSchemas'
import { nanoid } from 'nanoid'
import { headers } from 'next/headers'

export async function createCourse(data: CourseSchemaType): Promise<ActionResponse> {
  try {
    const validation = courseSchema.safeParse(data)

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        status: 'error',
        message: 'Unauthorized',
      }
    }

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid data',
      }
    }

    const result = await db.insert(course).values({
      ...validation.data,
      id: nanoid(),
      userId: session.user.id,
    })

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
