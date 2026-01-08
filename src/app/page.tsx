import { redirect } from 'next/navigation'
import { defaultLocale } from '@/constants/locale'

// Root page redirect to default locale
// Middleware should handle this, but this is a fallback for Vercel
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}

