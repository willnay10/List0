import { TaskList } from "@/components/task-list";

export default function Dashboard() {
    return (
        <main className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center p-4 md:p-24">
            <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm space-y-4">
                <TaskList />
                <div className="flex justify-end">
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="text-xs rounded-full border bg-background/70 px-3 py-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
