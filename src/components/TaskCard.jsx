import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsThree, List } from '@phosphor-icons/react'

const TaskCard = ({ task, onToggleComplete, onToggleSubtask, onEdit, onDuplicate, onDelete, onShare, onOpenBottomSheet, isDragEnabled }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, disabled: !isDragEnabled })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const isOverdue = !task.completed && task.date < todayStr
  const dateStr = task.date.split('-').reverse().join('/')

  const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0
  const totalSubtasks = task.subtasks?.length || 0
  const progressPercent = totalSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  return (
    <div ref={setNodeRef} style={style} className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <input type="checkbox" className="custom-cb" checked={task.completed} onChange={() => onToggleComplete(task.id)} aria-label="Concluir tarefa" />
        <div className="task-content">
          <div className="task-title-row" onClick={onEdit}>
            <div className={`priority-dot ${task.priority}`}></div>
            <div className="task-title">{task.title}</div>
          </div>
          {task.description && (
            <div className="task-desc" onClick={onEdit}>
              {task.description}
            </div>
          )}
          {totalSubtasks > 0 && !task.completed && (
            <div className="task-checklist">
              {task.subtasks.map(sub => (
                <label key={sub.id} className={`checklist-item ${sub.done ? 'done' : ''}`}>
                  <input type="checkbox" checked={sub.done} onChange={() => onToggleSubtask(task.id, sub.id)} />
                  <span>{sub.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="task-actions-row">
          <button className="action-icon options-btn" onClick={() => onOpenBottomSheet(task)} aria-label="Opções">
            <DotsThree size={20} weight="bold" />
          </button>
          {isDragEnabled && (
            <div className="drag-handle" {...attributes} {...listeners}>
              <List size={20} />
            </div>
          )}
        </div>
      </div>
      <div className="task-footer">
        {totalSubtasks > 0 && (
          <div className="subtask-container">
            <span className="subtask-text"><i className="ph-bold ph-list-checks"></i> {completedSubtasks}/{totalSubtasks}</span>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }}></div></div>
          </div>
        )}
        {totalSubtasks === 0 && <div></div>}
        <div className="task-meta">
          <span className="badge"><i className="ph ph-tag"></i> {task.category}</span>
          <span className={`badge ${isOverdue ? 'overdue' : ''}`}>
            <i className={`ph ${isOverdue ? 'ph-fill ph-warning-circle' : 'ph-calendar-blank'}`}></i> {dateStr}
          </span>
        </div>
      </div>
    </div>
  )
}
export default TaskCard