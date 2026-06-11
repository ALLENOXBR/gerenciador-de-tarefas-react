import React from 'react'
import { CheckCircle, HourglassHigh, Fire, X } from '@phosphor-icons/react'

const FiltersBar = ({ filterStatus, setFilterStatus, filterCategory, setFilterCategory, sortBy, setSortBy, completionRate, pendingCount, highPriorityPending }) => {
  const isFilterActive = filterStatus !== 'all' || filterCategory !== 'all' || sortBy !== 'manual'
  
  const clearFilters = () => {
    setFilterStatus('all')
    setFilterCategory('all')
    setSortBy('manual')
  }

  return (
    <div className="sub-header">
      <div className="mini-stats">
        <span style={{ color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle size={14} weight="fill" /> {completionRate}%
        </span>
        <span>
          <HourglassHigh size={14} weight="fill" /> {pendingCount} pendentes
        </span>
        <span style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <Fire size={14} weight="fill" /> {highPriorityPending} críticas
        </span>
      </div>
      <div className="filters-scroll">
        {isFilterActive && (
          <button onClick={clearFilters} className="filter-pill" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
            <X size={12} /> Limpar
          </button>
        )}
        <select className="filter-pill" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Situação: Todas</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
        </select>
        <select className="filter-pill" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">Categoria: Todas</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Projeto">Projeto</option>
          <option value="Pessoal">Pessoal</option>
        </select>
        <select className="filter-pill" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="manual">Ord: Manual</option>
          <option value="date">Ord: Prazo</option>
          <option value="priority">Ord: Prioridade</option>
        </select>
      </div>
    </div>
  )
}
export default FiltersBar