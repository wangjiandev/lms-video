'use client'

import { AdminLessonType } from '@/data/admin/admin-get-lesson'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTransition } from 'react'
import { RichTextEditor } from '@/components/rich-text-editor/Editor'
import Uploader from '@/components/file-uploader/Uploader'

interface LessonFormProps {
  data: AdminLessonType
  chapterId: string
  courseId: string
}

const LessonForm = ({ data, chapterId, courseId }: LessonFormProps) => {
  const [isPending, startTransition] = useTransition()

  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.data?.title || '',
      courseId: courseId,
      chapterId: chapterId,
      description: data.data?.description || undefined,
      thumbnailKey: data.data?.thumbnailKey || undefined,
      videoKey: data.data?.videoKey || undefined,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    startTransition(async () => {})
  }
  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: 'outline', className: 'mb-6' })}>
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Go Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="thumbnailKey"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="videoKey"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Lesson'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LessonForm
