import { redirect } from 'next/navigation'

export default function RootPage() {
  // Default locale is 'vi' - hardcode to avoid config dependency
  redirect('/vi')
}

