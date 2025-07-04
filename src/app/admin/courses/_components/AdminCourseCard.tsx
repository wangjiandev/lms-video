import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdminCourseType } from '@/data/admin/admin-get-courses'
import { useConstruct } from '@/hooks/use-construct'
import { ArrowRight, EllipsisVerticalIcon, EyeIcon, PencilIcon, School2Icon, TimerIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface AdminCourseCardProps {
  course: AdminCourseType
}

const AdminCourseCard = ({ course }: AdminCourseCardProps) => {
  const thumbnailUrl = useConstruct(course.fileKey ?? '')
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <PencilIcon className="mr-4 size-4" /> Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`}>
                <EyeIcon className="mr-4 size-4" /> Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/delete`}>
                <TrashIcon className="text-destructive mr-4 size-4" /> Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Url"
        width={600}
        height={400}
        className="aspect-video h-full w-full rounded-t-xl object-cover"
      />
      <CardContent className="p-6">
        <Link
          href={`/admin/courses/${course.id}`}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline">
          {course.title}
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">{course.smallDescription}</p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary/50 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.duration} hours</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School2Icon className="text-primary/50 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.level}</p>
          </div>
        </div>
        <Link
          className={buttonVariants({
            className: 'mt-4 w-full',
          })}
          href={`/admin/courses/${course.id}/edit`}>
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

// https://epx-lms.fly.storage.tigris.dev/NVXRxeAvs6EfSq3vgsLTp-iShot_2025-07-02_20.30.25.png

export default AdminCourseCard
