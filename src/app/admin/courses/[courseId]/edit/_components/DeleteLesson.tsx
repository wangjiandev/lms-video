import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { Loader2, Trash } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteLesson } from '../actions'
import { toast } from 'sonner'

interface DeleteLessonProps {
  courseId: string
  chapterId: string
  lessonId: string
}

const DeleteLesson = ({ courseId, chapterId, lessonId }: DeleteLessonProps) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  async function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteLesson(courseId, chapterId, lessonId))
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.status === 'success') {
        toast.success(data.message)
        setIsOpen(false)
      } else if (data.status === 'error') {
        toast.error(data.message)
      }
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the lesson
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteLesson
