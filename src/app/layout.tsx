import { ReactNode } from 'react'

// Minimal root layout required for Next.js 15
// The actual i18n layout is in [locale]/layout.tsx
export default function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return children
}

