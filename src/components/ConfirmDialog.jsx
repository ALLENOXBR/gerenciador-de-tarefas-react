import React from 'react'
import { X } from '@phosphor-icons/react'

const ConfirmDialog = ({ isOpen, title, message, danger, onConfirm, onCancel }) => {
  if (!isOpen) return null
  return (
    <dialog id="confirmDialog" open className="confirm-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <span>{title}</span>
          <button className="icon-btn" onClick={onCancel} style={{ width: '32px', height: '32px' }}><X size={20} /></button>
        </div>
        <p style={{ color: 'var(--text-support)' }}>{message}</p>
        <div className="btn-group">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary-confirm'}>Confirmar</button>
        </div>
      </div>
    </dialog>
  )
}
export default ConfirmDialog