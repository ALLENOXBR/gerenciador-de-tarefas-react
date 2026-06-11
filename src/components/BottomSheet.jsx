import React from 'react'
import { PencilSimple, Copy, ShareNetwork, Trash, X } from '@phosphor-icons/react'

const BottomSheet = ({ isOpen, onClose, task, onEdit, onDuplicate, onShare, onDelete }) => {
  if (!isOpen || !task) return null
  return (
    <dialog id="optionsSheet" className="bottom-sheet" open>
      <div className="modal-content" style={{ paddingBottom: 'env(safe-area-inset-bottom, 2rem)' }}>
        <div className="sheet-grip"></div>
        <div className="modal-header" style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-support)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>{task.title}</span>
          <button className="icon-btn close-sheet" onClick={onClose} style={{ width: '32px', height: '32px' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={onEdit} className="dropdown-item" style={{ border: 'none', background: 'var(--bg-surface-hover)', width: '100%', fontSize: '0.95rem' }}><PencilSimple size={18} /> Editar Tarefa</button>
          <button onClick={onDuplicate} className="dropdown-item" style={{ border: 'none', background: 'var(--bg-surface-hover)', width: '100%', fontSize: '0.95rem' }}><Copy size={18} /> Duplicar</button>
          <button onClick={onShare} className="dropdown-item" style={{ border: 'none', background: 'var(--bg-surface-hover)', width: '100%', fontSize: '0.95rem' }}><ShareNetwork size={18} /> Partilhar</button>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
          <button onClick={onDelete} className="dropdown-item danger" style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', width: '100%', fontSize: '0.95rem' }}><Trash size={18} /> Eliminar Tarefa</button>
        </div>
      </div>
    </dialog>
  )
}
export default BottomSheet