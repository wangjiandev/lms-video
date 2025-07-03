import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/lib/env'
import { nanoid } from 'nanoid'
import { S3 } from '@/lib/S3Client'
import arcjet from '@/lib/arcjet'
import { detectBot, fixedWindow } from '@arcjet/next'
import { requireAdmin } from '@/data/admin/require-admin'

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: 'File name is required' }),
  contentType: z.string().min(1, { message: 'Content type is required' }),
  size: z.number().min(1, { message: 'File size is required' }),
  isImage: z.boolean(),
})

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

export async function POST(request: NextRequest) {
  const session = await requireAdmin()

  try {
    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    })

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json()
    const validation = fileUploadSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 })
    }

    const { fileName, contentType, size } = validation.data
    const key = `${nanoid()}-${fileName}`
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      ContentType: contentType,
      Key: key,
      Body: body,
      ContentLength: size,
      ChecksumSHA256: 'sha256',
    })

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 }) // url expires in 6 minutes

    const response = {
      presignedUrl,
      key: key,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
