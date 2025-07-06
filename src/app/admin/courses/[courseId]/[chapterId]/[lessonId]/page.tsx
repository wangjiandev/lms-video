import { adminGetLesson } from '@/data/admin/admin-get-lesson'
import LessonForm from './_components/LessonForm'


type Params = Promise<{
  courseId: string
  chapterId: string
  lessonId: string
}>

const Page = async ({ params }: { params: Params }) => {
  const { courseId, chapterId, lessonId } = await params
  const data = await adminGetLesson(lessonId)

  return (
    <div className="px-4 lg:px-6">
      <LessonForm data={data} chapterId={chapterId} courseId={courseId} />
    </div>
  )
}

export default Page
