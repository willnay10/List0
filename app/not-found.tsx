export const runtime = 'edge'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center space-y-4">
            <h2 className="text-4xl font-bold">404</h2>
            <p className="text-xl text-muted-foreground">Page not found</p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}
