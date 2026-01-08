import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string().optional()
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:
    process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI
})

// Don't throw error on import - use fallback values instead
// This allows the app to start even if env vars are missing
let envConfig: z.infer<typeof configSchema>

if (!configProject.success) {
  const missingVars = configProject.error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ')
  console.error('⚠️ Environment Variables Warning:', configProject.error.errors)
  console.warn(
    `Missing or invalid env vars: ${missingVars}. Using fallback values. Please check Vercel Dashboard → Settings → Environment Variables.`
  )
  // Use fallback values to allow app to start
  envConfig = {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI
  }
} else {
  envConfig = configProject.data
}

export default envConfig

// Re-export locale types for backward compatibility
export type { Locale } from '@/constants/locale'
export { locales, defaultLocale } from '@/constants/locale'
