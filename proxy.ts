// proxy.ts   ← file name must be exactly "proxy.ts"
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// This exact format is required in Next.js 16
export const proxy = async (request: NextRequest) => {
  return await updateSession(request)
}

// Your matcher stays exactly the same
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
