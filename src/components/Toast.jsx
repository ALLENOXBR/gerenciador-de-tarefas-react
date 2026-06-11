import React from 'react'
import { Info } from '@phosphor-icons/react'

const Toast = ({ show, message, undoable, onUndo }) => {
  if (!show) return null
  return (
    <div id="toast" className="show">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Info size={20} weight="fill" style={{ color: 'var(--brand-primary)' }} />
        <span>{message}</span>
      </div>
      {undoable && <button className="toast-action" onClick={onUndo}>Desfazer</button>}
    </div>
  )
}
export default Toast