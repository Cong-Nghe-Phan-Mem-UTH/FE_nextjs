import { ReactNode } from 'react'

// Root layout required for Next.js 15
// This is a minimal pass-through - actual layout is in [locale]/layout.tsx
export default function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return children
}

