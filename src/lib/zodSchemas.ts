import { z } from 'zod'

export const courseLevel = ['Beginner', 'Intermediate', 'Advanced'] as const

export const courseStatus = ['Draft', 'Published', 'Archived'] as const

export const courseCategories = [
  'Web Development',
  'Mobile Development',
  'AI',
  'Data Science',
  'DevOps',
  'Cybersecurity',
  'Game Development',
  'UI/UX Design',
  'Blockchain',
  'Cloud Computing',
  'Other',
] as const

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(1, { message: 'Description is required' }),
  fileKey: z.string().min(1, { message: 'file key is required' }),
  price: z.coerce.number().min(1, { message: 'Price must be at least 1' }),
  duration: z.coerce
    .number()
    .min(1, { message: 'Duration must be at least 1' })
    .max(500, { message: 'Duration must be less than 500' }),
  level: z.enum(courseLevel, {
    required_error: 'Level is required',
    invalid_type_error: 'Level must be a string',
  }),
  category: z.enum(courseCategories, {
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  smallDescription: z
    .string()
    .min(2, { message: 'Small description must be at least 2 characters' })
    .max(200, { message: 'Small description must be less than 200 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }),
  status: z.enum(courseStatus, {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be a string',
  }),
})

export const chapterSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  courseId: z.string().nanoid({ message: 'Course ID is required' }),
})

export const lessonSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  courseId: z.string().nanoid({ message: 'Course ID is required' }),
  chapterId: z.string().nanoid({ message: 'Chapter ID is required' }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
})

export type CourseSchemaType = z.infer<typeof courseSchema>
export type ChapterSchemaType = z.infer<typeof chapterSchema>
export type LessonSchemaType = z.infer<typeof lessonSchema>
