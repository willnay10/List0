"use client"

import * as React from "react"
import { Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface List {
    id: string
    name: string
}

interface Task {
    id: string
    listId: string
    text: string
    completed: boolean
}

interface StoredState {
    lists: List[]
    tasks: Task[]
}

const STORAGE_KEY = "list0-data"

export function TaskList() {
    const [lists, setLists] = React.useState<List[]>([])
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [selectedListId, setSelectedListId] = React.useState<string | null>(null)
    const [newListName, setNewListName] = React.useState("")
    const [newTask, setNewTask] = React.useState("")
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [sortMode, setSortMode] = React.useState<"az" | "za" | "on" | "no">("on")

    React.useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed: StoredState = JSON.parse(saved)
                setLists(parsed.lists || [])
                setTasks(parsed.tasks || [])
                if (parsed.lists && parsed.lists.length > 0) {
                    setSelectedListId(parsed.lists[0].id)
                }
            } catch (e) {
                console.error("Failed to parse stored lists/tasks", e)
            }
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (!isLoaded) return
        const data: StoredState = { lists, tasks }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }, [lists, tasks, isLoaded])

    const addList = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newListName.trim()) return

        const list: List = {
            id: crypto.randomUUID(),
            name: newListName.trim(),
        }

        const updatedLists = [...lists, list]
        setLists(updatedLists)
        setNewListName("")
        if (!selectedListId) {
            setSelectedListId(list.id)
        }
    }

    const deleteList = (id: string) => {
        const remainingLists = lists.filter((l) => l.id !== id)
        const remainingTasks = tasks.filter((t) => t.listId !== id)
        setLists(remainingLists)
        setTasks(remainingTasks)

        if (selectedListId === id) {
            setSelectedListId(remainingLists[0]?.id ?? null)
        }
    }

    const addTask = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!selectedListId || !newTask.trim()) return

        const task: Task = {
            id: crypto.randomUUID(),
            listId: selectedListId,
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

    const activeTasks = selectedListId
        ? tasks.filter((t) => t.listId === selectedListId)
        : []

    const sortedTasks = React.useMemo(() => {
        if (!selectedListId) return []

        if (sortMode === "az") {
            return [...activeTasks].sort((a, b) => a.text.localeCompare(b.text))
        }

        if (sortMode === "za") {
            return [...activeTasks].sort((a, b) => b.text.localeCompare(a.text))
        }

        if (sortMode === "no") {
            return [...activeTasks].reverse()
        }

        return activeTasks
    }, [activeTasks, selectedListId, sortMode])

    if (!isLoaded) {
        return null
    }

    const selectedList = lists.find((l) => l.id === selectedListId) || null

    return (
        <Card className="w-full max-w-5xl border-none shadow-2xl bg-card/50 backdrop-blur-sm max-h-[calc(100vh-180px)] overflow-hidden">
            <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold">Lists &amp; tasks</CardTitle>
                <div className="text-sm text-muted-foreground">
                    Keep your day in simple buckets like Morning, Work, Night.
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Lists column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Lists</h2>
                            <span className="text-xs text-muted-foreground">
                                {lists.length} {lists.length === 1 ? "list" : "lists"}
                            </span>
                        </div>
                        <form onSubmit={addList} className="flex space-x-2">
                            <Input
                                placeholder="Add a list (e.g. Morning, Work, Night)"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="flex-1 bg-background/50"
                            />
                            <Button type="submit" size="icon" disabled={!newListName.trim()}>
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add list</span>
                            </Button>
                        </form>
                        <ScrollArea className="h-[260px]">
                            <div className="space-y-2 pr-2">
                                {lists.map((list) => {
                                    const listTasks = tasks.filter((t) => t.listId === list.id)
                                    const isActive = list.id === selectedListId
                                    return (
                                        <button
                                            key={list.id}
                                            type="button"
                                            onClick={() => setSelectedListId(list.id)}
                                            className={`group flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                                isActive
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-card hover:bg-accent/50"
                                            }`}
                                        >
                                            <div className="flex flex-1 flex-col overflow-hidden">
                                                <span className="truncate font-medium">{list.name}</span>
                                                <span className="text-xs text-muted-foreground group-[.bg-primary]:text-primary-foreground/80">
                                                    {listTasks.length} {listTasks.length === 1 ? "task" : "tasks"}
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteList(list.id)
                                                }}
                                                className="ml-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span className="sr-only">Delete list</span>
                                            </Button>
                                        </button>
                                    )
                                })}
                                {lists.length === 0 && (
                                    <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
                                        Start by adding a Morning, Work or Night list.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Tasks column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-foreground">Tasks</h2>
                                <span className="text-xs text-muted-foreground">
                                    {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
                                </span>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="hidden sm:inline">Sort</span>
                                <select
                                    value={sortMode}
                                    onChange={(e) => setSortMode(e.target.value as "az" | "za" | "on" | "no")}
                                    className="h-8 rounded-md border bg-background px-2 text-xs text-foreground shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="az">A–Z</option>
                                    <option value="za">Z–A</option>
                                    <option value="on">Oldest → Newest</option>
                                    <option value="no">Newest → Oldest</option>
                                </select>
                            </label>
                        </div>
                        <form onSubmit={addTask} className="flex space-x-2">
                            <Input
                                placeholder={selectedList ? `Add a task to ${selectedList.name}...` : "Create a list first"}
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                disabled={!selectedListId}
                                className="flex-1 bg-background/50"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!newTask.trim() || !selectedListId}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add task</span>
                            </Button>
                        </form>
                        <ScrollArea className="h-[260px]">
                            <div className="space-y-2 pr-2">
                                {selectedListId ? (
                                    activeTasks.length > 0 ? (
                                        sortedTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-all hover:bg-accent/50"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden flex-1">
                                                    <button
                                                        type="button"
                                                        className={`h-4 w-4 rounded-full border cursor-pointer transition-colors flex-shrink-0 ${
                                                            task.completed
                                                                ? "bg-primary border-primary"
                                                                : "border-muted-foreground hover:border-primary"
                                                        }`}
                                                        onClick={() => toggleTask(task.id)}
                                                    />
                                                    <span
                                                        className={`overflow-x-auto whitespace-nowrap scrollbar-hide ${
                                                            task.completed
                                                                ? "text-muted-foreground line-through"
                                                                : "text-foreground"
                                                        }`}
                                                    >
                                                        {task.text}
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteTask(task.id)}
                                                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
                                            No tasks in this list yet. Add one above.
                                        </div>
                                    )
                                ) : (
                                    <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
                                        Select or create a list to start adding tasks.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
