import { useState, useEffect } from 'react'
import { Moon, Sun, Plus, Trash2, Edit, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Priority = 'low' | 'medium' | 'high'
type ColumnId = 'todo' | 'in-progress' | 'done'

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  createdAt: string
  columnId: ColumnId
}

interface Column {
  id: ColumnId
  title: string
}

const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
]

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-red-500 hover:bg-red-600',
  medium: 'bg-yellow-500 hover:bg-yellow-600',
  low: 'bg-green-500 hover:bg-green-600'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    columnId: 'todo' as ColumnId
  })

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks')
    const savedDarkMode = localStorage.getItem('kanban-darkmode')

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true')
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('kanban-darkmode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addTask = () => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      columnId: newTask.columnId,
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', priority: 'medium', columnId: 'todo' })
    setIsAddDialogOpen(false)
  }

  const updateTask = () => {
    if (!editingTask) return
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t))
    setEditingTask(null)
    setIsEditDialogOpen(false)
  }

  const deleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: ColumnId) => {
    if (!draggedTask) return

    setTasks(tasks.map(task =>
      task.id === draggedTask ? { ...task, columnId } : task
    ))
    setDraggedTask(null)
  }

  const getTasksByColumn = (columnId: ColumnId) => {
    return tasks.filter(task => task.columnId === columnId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Organize your tasks efficiently</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new task for your board</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="column">Column</Label>
                    <Select value={newTask.columnId} onValueChange={(value: ColumnId) => setNewTask({ ...newTask, columnId: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={addTask} disabled={!newTask.title.trim()}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h2>
                <Badge variant="secondary" className="text-sm">
                  {getTasksByColumn(column.id).length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {getTasksByColumn(column.id).map(task => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className={`cursor-move transition-all hover:shadow-md ${
                      draggedTask === task.id ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <GripVertical className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <CardTitle className="text-base font-semibold leading-tight">
                            {task.title}
                          </CardTitle>
                        </div>
                        <Badge className={`${PRIORITY_COLORS[task.priority]} text-white text-xs capitalize flex-shrink-0`}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <CardDescription className="text-sm mt-2 line-clamp-2">
                          {task.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(task.createdAt)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingTask(task)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update your task details</DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTask.description}
                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: Priority) => setEditingTask({ ...editingTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateTask} disabled={!editingTask?.title.trim()}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App
