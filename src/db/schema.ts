import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),

  stripeCustomerId: text('stripe_customer_id').unique(),

  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
})

export const courseLevel = pgEnum('course_level', ['Beginner', 'Intermediate', 'Advanced'])

export const courseStatus = pgEnum('course_status', ['Draft', 'Published', 'Archived'])

export const course = pgTable('course', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title'),
  description: text('description'),
  fileKey: text('file_key'),
  price: integer('price'),
  duration: integer('duration'),
  level: courseLevel('level').default('Beginner'),
  category: text('category'),
  smallDescription: text('small_description'),
  slug: text('slug').notNull().unique(),
  status: courseStatus('status').default('Draft'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const courseRelations = relations(course, ({ many }) => ({
  chapters: many(chapter),
  enrollments: many(enrollment),
}))

export const chapter = pgTable('chapter', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  position: integer('position').notNull(),

  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
})

export const chapterRelations = relations(chapter, ({ many, one }) => ({
  lessons: many(lesson),
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
}))

export const lesson = pgTable('lesson', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailKey: text('thumbnail_key'),
  videoKey: text('video_key'),
  position: integer('position').notNull(),

  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapter.id, { onDelete: 'cascade' }),
})

export const lessonRelations = relations(lesson, ({ one }) => ({
  chapter: one(chapter, {
    fields: [lesson.chapterId],
    references: [chapter.id],
  }),
}))

export const EnrollmentStatus = pgEnum('enrollment_status', ['Pending', 'Active', 'Cancelled'])

export const enrollment = pgTable('enrollment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  amount: integer('amount').notNull(),
  status: EnrollmentStatus('status').default('Pending'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
})
