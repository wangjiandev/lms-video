'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { deleteCourse } from './actions'
import { useParams, useRouter } from 'next/navigation'
import { tryCatch } from '@/hooks/try-catch'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash2 } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { courseId } = useParams<{ courseId: string }>()

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId))
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.status === 'success') {
        toast.success(data.message)
        router.push('/admin/courses')
      } else if (data.status === 'error') {
        toast.error(data.message)
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Delete Course</CardTitle>
          <CardDescription>Are you sure you want to delete this course?</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link href="/admin/courses" className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </Link>
          <Button onClick={onSubmit} disabled={isPending} variant="destructive">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
