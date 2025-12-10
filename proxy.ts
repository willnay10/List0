// proxy.ts (file must be named exactly this, at project root)
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Official named export for Next.js 16 proxy (renamed from middleware)
export function proxy(request: NextRequest) {
    return updateSession(request)
}

// Your matcher stays the same (this is perfect — skips static files)
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
