'use server'

import { db } from '@/db'
import { course } from '@/db/schema'
import { ActionResponse } from '@/lib/types'
import { courseSchema, type CourseSchemaType } from '@/lib/zodSchemas'
import { nanoid } from 'nanoid'
import { requireAdmin } from '@/data/admin/require-admin'
import arcjet from '@/lib/arcjet'
import { detectBot, fixedWindow, request } from '@arcjet/next'

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

export async function createCourse(data: CourseSchemaType): Promise<ActionResponse> {
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
