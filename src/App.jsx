import React, { useState, useEffect, useMemo } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import Fuse from 'fuse.js'
import Header from './components/Header'
import FiltersBar from './components/FiltersBar'
import TaskCard from './components/TaskCard'
import TaskModal from './components/TaskModal'
import ConfirmDialog from './components/ConfirmDialog'
import Toast from './components/Toast'
import Onboarding from './components/Onboarding'
import PomodoroTimer from './components/PomodoroTimer'
import ProductivityChart from './components/ProductivityChart'
import BottomSheet from './components/BottomSheet'
import { loadTasks, saveTasks, loadTheme, saveTheme, loadShowChart, saveShowChart, loadTourDone, saveTourDone } from './utils/storage'
import { generateId } from './utils/helpers'
import { PRIORITY_ORDER } from './utils/constants'

function App() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('manual')
  const [isGridView, setIsGridView] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(() => loadTheme())
  const [showChart, setShowChart] = useState(() => loadShowChart())
  const [tourDone, setTourDone] = useState(() => loadTourDone())
  const [editingTask, setEditingTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', danger: false, onConfirm: null, onCancel: null })
  const [toast, setToast] = useState({ show: false, message: '', undoable: false, onUndo: null })
  const [bottomSheetTask, setBottomSheetTask] = useState(null)
  const [lastDeletedTask, setLastDeletedTask] = useState(null)

  useEffect(() => { saveTasks(tasks) }, [tasks])
  useEffect(() => { saveTheme(isLightTheme); document.body.classList.toggle('light-theme', isLightTheme) }, [isLightTheme])
  useEffect(() => { saveShowChart(showChart) }, [showChart])

  const addTask = (taskData) => {
    const newTask = { id: generateId(), ...taskData, completed: false, subtasks: (taskData.subtasks || []).map(s => ({ ...s, id: generateId() })), completedDate: null }
    setTasks(prev => [newTask, ...prev])
    showToastMessage('Tarefa criada!')
  }
  const updateTask = (id, data) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data, subtasks: data.subtasks.map(s => ({ ...s, id: s.id || generateId() })) } : t))
    showToastMessage('Tarefa atualizada!')
  }
  const deleteTask = (id, withUndo = true) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    setLastDeletedTask(task)
    setTasks(prev => prev.filter(t => t.id !== id))
    if (withUndo) showToastMessage('Tarefa eliminada.', true, () => undoDelete())
  }
  const undoDelete = () => {
    if (lastDeletedTask) { setTasks(prev => [lastDeletedTask, ...prev]); setLastDeletedTask(null); showToastMessage('Ação revertida!') }
  }
  const duplicateTask = (id) => {
    const original = tasks.find(t => t.id === id)
    if (!original) return
    const copy = { ...original, id: generateId(), title: original.title + ' (Cópia)', completed: false, completedDate: null, subtasks: original.subtasks.map(s => ({ ...s, id: generateId(), done: false })) }
    setTasks(prev => [copy, ...prev])
    showToastMessage('Tarefa duplicada!')
  }
  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const newCompleted = !t.completed
      return { ...t, completed: newCompleted, completedDate: newCompleted ? new Date().toISOString().slice(0,10) : undefined, subtasks: t.subtasks?.map(s => ({ ...s, done: newCompleted })) || [] }
    }))
    if (navigator.vibrate) navigator.vibrate(40)
  }
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const newSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s)
      const allDone = newSubtasks.length > 0 && newSubtasks.every(s => s.done)
      return { ...t, subtasks: newSubtasks, completed: allDone, completedDate: allDone ? new Date().toISOString().slice(0,10) : t.completedDate }
    }))
    if (navigator.vibrate) navigator.vibrate(20)
  }
  const clearCompleted = async () => {
    const ok = await openConfirmDialog('Limpar Tarefas', 'Eliminar todas as tarefas concluídas?', true)
    if (ok) { setTasks(prev => prev.filter(t => !t.completed)); showToastMessage('Limpeza efetuada!') }
  }
  const importTasksFromFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const ext = file.name.split('.').pop().toLowerCase()
        let imported = []
        if (ext === 'json') imported = parseJSONImport(e.target.result)
        else if (ext === 'csv') imported = parseCSVImport(e.target.result)
        else throw new Error()
        if (imported.length) { setTasks(prev => [...imported, ...prev]); showToastMessage(`${imported.length} tarefa(s) importada(s)!`) }
        else showToastMessage('Nenhuma tarefa válida.')
      } catch { showToastMessage('Erro ao processar ficheiro.') }
    }
    reader.readAsText(file)
  }
  const parseJSONImport = (content) => {
    const data = JSON.parse(content)
    const arr = Array.isArray(data) ? data : [data]
    return arr.map(item => ({ id: generateId(), title: item.title || 'Sem título', description: item.description || '', priority: ['high','medium','low'].includes(item.priority) ? item.priority : 'medium', category: ['Trabalho','Projeto','Pessoal'].includes(item.category) ? item.category : 'Pessoal', date: item.date || new Date().toISOString().slice(0,10), subtasks: (item.subtasks || []).map((s,i) => ({ id: generateId(), text: typeof s === 'string' ? s : (s.text || ''), done: false })), completed: false, completedDate: null }))
  }
  const parseCSVImport = (content) => {
    const lines = content.split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) throw new Error()
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const titleIdx = headers.indexOf('title'), dateIdx = headers.indexOf('date')
    if (titleIdx === -1 || dateIdx === -1) throw new Error()
    const descIdx = headers.indexOf('description'), prioIdx = headers.indexOf('priority'), catIdx = headers.indexOf('category'), subIdx = headers.indexOf('subtasks')
    const tasks = []
    for (let i=1; i<lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim())
      const title = cols[titleIdx] || 'Sem título'
      const date = cols[dateIdx] || new Date().toISOString().slice(0,10)
      const priority = (cols[prioIdx] && ['high','medium','low'].includes(cols[prioIdx])) ? cols[prioIdx] : 'medium'
      const category = (cols[catIdx] && ['Trabalho','Projeto','Pessoal'].includes(cols[catIdx])) ? cols[catIdx] : 'Pessoal'
      const description = cols[descIdx] || ''
      let subtasks = []
      if (subIdx !== -1 && cols[subIdx]) {
        const parts = cols[subIdx].includes('|') ? cols[subIdx].split('|') : cols[subIdx].split(';')
        subtasks = parts.map(s => ({ id: generateId(), text: s.trim(), done: false })).filter(s => s.text)
      }
      tasks.push({ id: generateId(), title, description, priority, category, date, subtasks, completed: false, completedDate: null })
    }
    return tasks
  }
  const exportBackup = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' }))
    a.download = `taskflow_${Date.now()}.json`
    a.click()
  }
  const restoreBackup = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try { const data = JSON.parse(e.target.result); if (Array.isArray(data)) { setTasks(data); showToastMessage('Backup restaurado!') } }
      catch { showToastMessage('Ficheiro inválido.') }
    }
    reader.readAsText(file)
  }
  const openConfirmDialog = (title, message, danger = false) => {
    return new Promise((resolve) => {
      setConfirmDialog({ open: true, title, message, danger, onConfirm: () => { resolve(true); setConfirmDialog(prev => ({ ...prev, open: false })) }, onCancel: () => { resolve(false); setConfirmDialog(prev => ({ ...prev, open: false })) } })
    })
  }
  const showToastMessage = (message, undoable = false, onUndo = null) => {
    setToast({ show: true, message, undoable, onUndo })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), undoable ? 6000 : 3000)
  }

  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    if (filterStatus === 'pending') result = result.filter(t => !t.completed)
    if (filterStatus === 'completed') result = result.filter(t => t.completed)
    if (filterCategory !== 'all') result = result.filter(t => t.category === filterCategory)
    if (searchQuery.trim()) {
      const fuse = new Fuse(result, { keys: ['title','description','category'], threshold: 0.4 })
      result = fuse.search(searchQuery).map(r => r.item)
    }
    if (sortBy === 'date') result.sort((a,b) => a.date.localeCompare(b.date))
    if (sortBy === 'priority') result.sort((a,b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    return result
  }, [tasks, filterStatus, filterCategory, searchQuery, sortBy])

  const isDragEnabled = sortBy === 'manual' && filterStatus === 'all' && filterCategory === 'all' && searchQuery.trim() === ''
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id && isDragEnabled) {
      const oldIndex = tasks.findIndex(t => t.id === active.id)
      const newIndex = tasks.findIndex(t => t.id === over.id)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
    }
  }

  const total = tasks.length, completed = tasks.filter(t => t.completed).length, rate = total ? Math.round((completed/total)*100) : 0, pending = total - completed, highPending = tasks.filter(t => !t.completed && t.priority === 'high').length

  return (
    <div className="app">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} isLightTheme={isLightTheme} toggleTheme={() => setIsLightTheme(!isLightTheme)} isGridView={isGridView} toggleGridView={() => setIsGridView(!isGridView)} onExportBackup={exportBackup} onRestoreBackup={restoreBackup} onImportTasks={importTasksFromFile} onClearCompleted={clearCompleted} onToggleChart={() => setShowChart(!showChart)} showChart={showChart} />
      <FiltersBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterCategory={filterCategory} setFilterCategory={setFilterCategory} sortBy={sortBy} setSortBy={setSortBy} completionRate={rate} pendingCount={pending} highPriorityPending={highPending} />
      <PomodoroTimer />
      <div className={`main-content ${isGridView ? 'grid-view' : ''}`}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy} disabled={!isDragEnabled}>
            {filteredTasks.map(task => <TaskCard key={task.id} task={task} onToggleComplete={toggleComplete} onToggleSubtask={toggleSubtask} onEdit={() => { setEditingTask(task); setModalOpen(true) }} onDuplicate={duplicateTask} onDelete={(id) => deleteTask(id, true)} onShare={() => { const text = `${task.title}\nPrioridade: ${task.priority}\nData: ${task.date.split('-').reverse().join('/')}`; if (navigator.share) navigator.share({ title: task.title, text }); else { navigator.clipboard.writeText(text); showToastMessage('Copiado!') } }} onOpenBottomSheet={() => setBottomSheetTask(task)} isDragEnabled={isDragEnabled} />)}
          </SortableContext>
        </DndContext>
      </div>
      {showChart && <ProductivityChart tasks={tasks} />}
      <button className="fab" onClick={() => { setEditingTask(null); setModalOpen(true) }}><i className="ph ph-plus"></i></button>
      <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null) }} onSave={(data) => { if (editingTask) updateTask(editingTask.id, data); else addTask(data); setModalOpen(false); setEditingTask(null) }} initialTask={editingTask} />
      <BottomSheet isOpen={!!bottomSheetTask} onClose={() => setBottomSheetTask(null)} task={bottomSheetTask} onEdit={() => { setEditingTask(bottomSheetTask); setModalOpen(true); setBottomSheetTask(null) }} onDuplicate={() => { duplicateTask(bottomSheetTask.id); setBottomSheetTask(null) }} onShare={() => { const text = `${bottomSheetTask.title}\nPrioridade: ${bottomSheetTask.priority}\nData: ${bottomSheetTask.date.split('-').reverse().join('/')}`; if (navigator.share) navigator.share({ title: bottomSheetTask.title, text }); else { navigator.clipboard.writeText(text); showToastMessage('Copiado!') }; setBottomSheetTask(null) }} onDelete={() => { deleteTask(bottomSheetTask.id, true); setBottomSheetTask(null) }} />
      <ConfirmDialog isOpen={confirmDialog.open} title={confirmDialog.title} message={confirmDialog.message} danger={confirmDialog.danger} onConfirm={confirmDialog.onConfirm} onCancel={confirmDialog.onCancel} />
      <Toast show={toast.show} message={toast.message} undoable={toast.undoable} onUndo={toast.onUndo} />
      {!tourDone && <Onboarding onFinish={() => setTourDone(true)} />}
    </div>
  )
}
export default App