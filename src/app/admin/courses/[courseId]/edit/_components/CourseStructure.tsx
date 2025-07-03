'use client'

import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { ReactNode, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { AdminCourseType } from '@/data/admin/admin-get-course'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CourseStructureProps {
  course: AdminCourseType
}

interface SortableItemProps {
  id: string
  children: (listeners: DraggableSyntheticListeners) => ReactNode
  className?: string
  data?: {
    type: 'chapter' | 'lesson'
    chapterId?: string // only relevant for lessons
  }
}

const CourseStructure = ({ course }: CourseStructureProps) => {
  const initialItems = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.position,
    })),
  }))

  const [items, setItems] = useState(initialItems)

  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id, data: data })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn('touch-none', className, isDragging ? 'z-10' : '')}>
        {children(listeners)}
      </div>
    )
  }

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(items.map((chapter) => (chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <Card>
        <CardHeader className="border-border flex flex-row items-center justify-between border-b">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} data={{ type: 'chapter' }} id={item.id}>
                {(listeners) => (
                  <Card>
                    <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                      <div className="border-border flex items-center justify-between border-b p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-grab opacity-60 hover:opacity-100"
                            {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost" className="flex items-center">
                              {item.isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="hover:text-primary cursor-pointer pl-2">{item.title}</p>
                        </div>

                        <Button size="icon" variant="ghost">
                          <Trash className="size-4" />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}>
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                data={{ type: 'lesson', chapterId: item.id }}
                                id={lesson.id}>
                                {(lessonListeners) => (
                                  <div className="hover:bg-accent flex items-center justify-between rounded-sm p-2">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="flex cursor-grab items-center"
                                        {...lessonListeners}>
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link href={`/admin/course/${course.id}/${item.id}/${lesson.id}`}>
                                        <p className="hover:text-primary cursor-pointer pl-2">{lesson.title}</p>
                                      </Link>
                                    </div>
                                    <Button size="icon" variant="ghost">
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button size="sm" className="w-full" variant="secondary">
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
}

export default CourseStructure
