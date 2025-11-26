import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                        Organise your day in seconds
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        List0 keeps your day in simple lists and tasks so you can stop fiddling with tools and just get things done.
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
				<div className="grid w-full max-w-3xl gap-4 pt-6 text-left sm:grid-cols-3 text-sm text-muted-foreground">
					<div className="rounded-xl border bg-background/60 p-4">
						<h2 className="mb-1 text-sm font-semibold text-foreground">Lists for every part of your day</h2>
						<p>Keep everything grouped so you always know what's next.</p>
					</div>
					<div className="rounded-xl border bg-background/60 p-4">
						<h2 className="mb-1 text-sm font-semibold text-foreground">Fast capture</h2>
						<p>Add tasks in one keystroke friendly box and reorder your day as you go.</p>
					</div>
					<div className="rounded-xl border bg-background/60 p-4">
						<h2 className="mb-1 text-sm font-semibold text-foreground">Simple by design</h2>
						<p>No projects, no boards, just focused lists and tasks that live in your browser.</p>
					</div>
				</div>
            </div>
        </div>
    )
}
