'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createLesson } from '../actions'
import { tryCatch } from '@/hooks/try-catch'

const NewLessonModal = ({ courseId, chapterId }: { courseId: string; chapterId: string }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    form.reset({
      name: '',
      courseId: courseId,
      chapterId: chapterId,
    })
    setIsOpen(open)
  }
  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: '',
      courseId: courseId,
      chapterId: chapterId,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      const { data, error } = await tryCatch(createLesson(values))
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.status === 'success') {
        toast.success(data.message)
        form.reset()
        setIsOpen(false)
      } else if (data.status === 'error') {
        toast.error(data.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full">
          <PlusIcon className="h-4 w-4" />
          New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Lesson</DialogTitle>
          <DialogDescription>Add a new lesson to your chapter.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Lesson'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewLessonModal
