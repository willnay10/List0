import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { LogOut } from "lucide-react"

export async function SiteHeader() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            List0
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" size="icon">
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">Sign out</span>
                            </Button>
                        </form>
                    ) : (
                        <Button asChild variant="default" size="sm">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
