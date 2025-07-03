'use client'

import Link from 'next/link'
import { ArrowLeftIcon, Loader2Icon, SparkleIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseCategories, courseLevel, courseSchema, courseStatus, type CourseSchemaType } from '@/lib/zodSchemas'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import slugify from 'slugify'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from '@/components/rich-text-editor/Editor'
import Uploader from '@/components/file-uploader/Uploader'
import { useTransition } from 'react'
import { tryCatch } from '@/hooks/try-catch'
import { createCourse } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      fileKey: '',
      price: 0,
      duration: 0,
      level: 'Beginner',
      status: 'Draft',
      category: 'Web Development',
      smallDescription: '',
      slug: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: CourseSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      const { data, error } = await tryCatch(createCourse(values))
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.status === 'success') {
        toast.success(data.message)
        form.reset()
        router.push('/admin/courses')
      } else if (data.status === 'error') {
        toast.error(data.message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeftIcon />
        </Link>
        <h1 className="text-2xl font-bold">Courses Create</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Add the details of the course to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const title = form.getValues('title')
                    const slug = slugify(title)
                    form.setValue('slug', slug, { shouldValidate: true })
                  }}>
                  Generate Slug
                  <SparkleIcon />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" placeholder="Small Description" {...field} />
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
                  name="fileKey"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <Uploader onChange={field.onChange} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                            {courseCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Level" />
                          </SelectTrigger>
                          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                            {courseLevel.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Duration (in hours)</FormLabel>
                      <FormControl>
                        <Input placeholder="Duration" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price (in USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Status" />
                        </SelectTrigger>
                        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                          {courseStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
