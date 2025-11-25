import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                        Master Your Day
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        A minimalistic task manager designed to help you focus on what matters most.
                        Simple, elegant, and effective.
                    </p>
                </div>
                <div className="space-x-4">
                    <Button asChild size="lg" className="h-11 px-8">
                        <Link href="/login">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-11 px-8 bg-background/50 backdrop-blur-sm">
                        <Link href="https://github.com/antigravity/list0" target="_blank">
                            GitHub
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] dark:bg-purple-900/20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-900/20" />
            </div>
        </div>
    )
}
