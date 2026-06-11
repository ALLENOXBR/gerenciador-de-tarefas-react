import React, { useState, useEffect } from 'react'
import { X, Plus, Trash } from '@phosphor-icons/react'

const TaskModal = ({ isOpen, onClose, onSave, initialTask }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('Pessoal')
  const [date, setDate] = useState('')
  const [subtasks, setSubtasks] = useState([])

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '')
      setDescription(initialTask.description || '')
      setPriority(initialTask.priority || 'medium')
      setCategory(initialTask.category || 'Pessoal')
      setDate(initialTask.date || new Date().toISOString().slice(0, 10))
      setSubtasks(initialTask.subtasks?.map(st => ({ ...st, tempId: st.id })) || [])
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategory('Pessoal')
      setDate(new Date().toISOString().slice(0, 10))
      setSubtasks([])
    }
  }, [initialTask, isOpen])

  const addSubtask = () => { setSubtasks([...subtasks, { tempId: Date.now(), text: '', done: false }]) }
  const updateSubtask = (index, text) => { const updated = [...subtasks]; updated[index].text = text; setSubtasks(updated) }
  const removeSubtask = (index) => { setSubtasks(subtasks.filter((_, i) => i !== index)) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const filteredSubtasks = subtasks.filter(st => st.text.trim() !== '')
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      date,
      subtasks: filteredSubtasks.map(st => ({ id: st.id || st.tempId, text: st.text, done: st.done || false })),
    })
  }

  if (!isOpen) return null

  return (
    <dialog id="taskModal" open>
      <div className="modal-content">
        <div className="modal-header">
          <span>{initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}</span>
          <button className="icon-btn cancel-modal" onClick={onClose} style={{ width: '32px', height: '32px' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Título da Tarefa</label>
            <input type="text" className="form-control" required value={title} onChange={e => setTitle(e.target.value)} placeholder="O que precisa de ser feito?" />
          </div>
          <div className="form-group">
            <label>Descrição Opcional</label>
            <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Adicione notas, links ou detalhes..."></textarea>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Prioridade</label>
              <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data Limite</label>
              <input type="date" className="form-control" required value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Trabalho">Trabalho</option>
              <option value="Projeto">Projeto</option>
              <option value="Pessoal">Pessoal</option>
            </select>
          </div>
          <div className="form-group" style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Checklist</label>
              <button type="button" onClick={addSubtask} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-title)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                <Plus size={14} /> Item
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '0.5rem', marginTop: '0.5rem' }}>
              {subtasks.map((sub, idx) => (
                <div key={sub.tempId || sub.id} className="subtask-item">
                  <input type="text" className="form-control sub-input" placeholder="Passo..." value={sub.text} onChange={e => updateSubtask(idx, e.target.value)} required />
                  <button type="button" className="action-icon del-sub" onClick={() => removeSubtask(idx)} style={{ color: 'var(--danger)' }}><Trash size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Guardar Alterações</button>
        </form>
      </div>
    </dialog>
  )
}
export default TaskModal