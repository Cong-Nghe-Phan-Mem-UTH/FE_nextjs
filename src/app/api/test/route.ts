import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    env: {
      NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'NOT SET',
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'NOT SET'
    }
  })
}

