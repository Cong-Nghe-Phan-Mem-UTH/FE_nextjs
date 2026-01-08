import { redirect } from 'next/navigation'
import { defaultLocale } from '@/constants/locale'

// This page should never be reached because middleware handles the redirect
// But we keep it as a fallback for Vercel
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}

