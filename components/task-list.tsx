"use client"

import * as React from "react"
import { Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
    id: string
    text: string
    completed: boolean
}

export function TaskList() {
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [newTask, setNewTask] = React.useState("")
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        const savedTasks = localStorage.getItem("tasks")
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks))
            } catch (e) {
                console.error("Failed to parse tasks", e)
            }
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("tasks", JSON.stringify(tasks))
        }
    }, [tasks, isLoaded])

    const addTask = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newTask.trim()) return

        const task: Task = {
            id: crypto.randomUUID(),
            text: newTask.trim(),
            completed: false,
        }

        setTasks([task, ...tasks])
        setNewTask("")
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const toggleTask = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }

    if (!isLoaded) {
        return null
    }

    return (
        <Card className="w-full border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
                <div className="text-sm text-muted-foreground">
                    {tasks.length} {tasks.length === 1 ? "item" : "items"}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={addTask} className="flex space-x-2">
                    <Input
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 bg-background/50"
                    />
                    <Button type="submit" size="icon" disabled={!newTask.trim()}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add task</span>
                    </Button>
                </form>

                <ScrollArea className="h-[300px]">
                    <div className="space-y-2 pr-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-all hover:bg-accent/50"
                            >
                                <div className="flex items-center gap-3 overflow-hidden flex-1">
                                    <div
                                        className={`h-4 w-4 rounded-full border cursor-pointer transition-colors flex-shrink-0 ${task.completed
                                            ? "bg-primary border-primary"
                                            : "border-muted-foreground hover:border-primary"
                                            }`}
                                        onClick={() => toggleTask(task.id)}
                                    />
                                    <span
                                        className={`overflow-x-auto whitespace-nowrap scrollbar-hide ${task.completed
                                            ? "text-muted-foreground line-through"
                                            : "text-foreground"
                                            }`}
                                    >
                                        {task.text}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteTask(task.id)}
                                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No tasks yet. Add one above!
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
