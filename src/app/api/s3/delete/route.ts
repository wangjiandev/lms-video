import { NextRequest, NextResponse } from 'next/server'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@/lib/env'
import { S3 } from '@/lib/S3Client'
import arcjet from '@/lib/arcjet'
import { detectBot, fixedWindow } from '@arcjet/next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

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

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    })

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json()
    const key = body.key

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    })

    await S3.send(command)

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
