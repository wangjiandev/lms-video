import { db } from '@/db'
import { env } from './env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins'
import { resend } from './resend'
import { admin } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: 'WangjianAdmin <send@dezhiyun.online>',
          to: [email],
          subject: 'WangjianAdmin Verification Code',
          html: `<p>Your verification code is <strong>${otp}</strong></p>`,
        })
      },
    }),
  ],
})
