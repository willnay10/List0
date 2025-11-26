import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { LogOut } from "lucide-react"

export async function SiteHeader() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="relative z-20 mt-6 flex w-full justify-center">
            <div className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border bg-background/80 px-6 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-8">
                <div className="flex items-center gap-4 font-bold">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl text-foreground">
                            List0
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <Button asChild variant="default" size="sm">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <Button asChild variant="default" size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
