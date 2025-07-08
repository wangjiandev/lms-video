import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type PublicCourseType } from '@/data/course/get-all-courses'
import { useConstruct } from '@/hooks/use-construct'
import { School, TimerIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PublicCourseCardProps {
  course: PublicCourseType
}

export function PublicCourseCard({ course }: PublicCourseCardProps) {
  const thumbnailUrl = useConstruct(course.fileKey ?? '')
  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="aspect-video h-full w-full rounded-t-xl object-cover"
      />
      <CardContent className="p-4">
        <Link
          className="hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
          href={`/courses/${course.slug}`}>
          {course.title}
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">{course.smallDescription}</p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.duration} h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.category}</p>
          </div>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonVariants({
            variant: 'secondary',
            className: 'mt-4 w-full',
          })}>
          Learn More
        </Link>
      </CardContent>
    </Card>
  )
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video w-full rounded-t-xl" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}
