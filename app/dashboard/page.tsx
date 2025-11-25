import { ModeToggle } from "@/components/mode-toggle";
import { TaskList } from "@/components/task-list";

export default function Dashboard() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm">
                <TaskList />
            </div>

            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] dark:bg-purple-900/20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-900/20" />
            </div>
        </main>
    );
}
