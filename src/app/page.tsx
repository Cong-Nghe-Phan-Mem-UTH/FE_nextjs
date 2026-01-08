import { redirect } from 'next/navigation'
import { defaultLocale } from '@/constants/locale'

export default function RootPage() {
  // Permanent redirect to default locale
  redirect(`/${defaultLocale}`)
}

