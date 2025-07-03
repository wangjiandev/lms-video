import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { adminGetCourse } from '@/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EditCourseForm from './_components/EditCourseForm'
import CourseStructure from './_components/CourseStructure'

interface EditCoursePageProps {
  params: Promise<{ courseId: string }>
}

const EditCoursePage = async ({ params }: EditCoursePageProps) => {
  const { courseId } = await params
  const course = await adminGetCourse(courseId)

  return (
    <div className="px-4 lg:px-6">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Course: <span className="text-primary ml-2 underline"> {course.title ?? ''}</span>
      </h1>
      <Tabs defaultValue="course-structure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Provide the basic information for your course</CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm course={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can update your Course Structure</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EditCoursePage
