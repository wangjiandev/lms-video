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
import { chapterSchema, ChapterSchemaType } from '@/lib/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createChapter } from '../actions'
import { tryCatch } from '@/hooks/try-catch'

const NewChapterModal = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    form.reset({
      name: '',
      courseId: courseId,
    })
    setIsOpen(open)
  }
  // 1. Define your form.
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: '',
      courseId: courseId,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: ChapterSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      const { data, error } = await tryCatch(createChapter(values))
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
        <Button variant="outline" size="sm" className="gap-2">
          <PlusIcon className="h-4 w-4" />
          New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
          <DialogDescription>Add a new chapter to your course.</DialogDescription>
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
                    <Input placeholder="Chapter Name" {...field} />
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
                  'Create Chapter'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewChapterModal
