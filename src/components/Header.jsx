import React, { useRef, useEffect, useState } from 'react'
import { MagnifyingGlass, GridFour, List, Moon, Sun, DotsThreeVertical, DownloadSimple, UploadSimple, FileCsv, Info, ChartBar, Broom } from '@phosphor-icons/react'

const Header = ({ searchQuery, setSearchQuery, isLightTheme, toggleTheme, isGridView, toggleGridView, onExportBackup, onRestoreBackup, onImportTasks, onClearCompleted, onToggleChart, showChart }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const restoreInputRef = useRef()
  const importInputRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRestore = (e) => { if (e.target.files[0]) onRestoreBackup(e.target.files[0]); e.target.value = '' }
  const handleImport = (e) => { if (e.target.files[0]) onImportTasks(e.target.files[0]); e.target.value = '' }

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand">
          <div className="logo-box"><i className="ph-bold ph-check-square-offset"></i></div>
          <span>TaskFlow</span>
        </div>
        <div className="search-container">
          <MagnifyingGlass size={18} />
          <input type="text" placeholder="Pesquisar tarefas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={toggleGridView}>{isGridView ? <List size={20} /> : <GridFour size={20} />}</button>
          <button className="icon-btn" onClick={toggleTheme}>{isLightTheme ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}><DotsThreeVertical size={20} /></button>
          {menuOpen && (
            <div className="dropdown-menu active" ref={menuRef}>
              <div className="dropdown-item" onClick={onExportBackup}><DownloadSimple size={18} /> Backup JSON</div>
              <label className="dropdown-item" htmlFor="restoreFileInput"><UploadSimple size={18} /> Restaurar Backup</label>
              <input type="file" id="restoreFileInput" accept=".json" style={{ display: 'none' }} ref={restoreInputRef} onChange={handleRestore} />
              <div className="dropdown-item" onClick={() => importInputRef.current.click()}><FileCsv size={18} /> Importar Lista (CSV/JSON)</div>
              <input type="file" accept=".csv,.json" style={{ display: 'none' }} ref={importInputRef} onChange={handleImport} />
              <div className="dropdown-item" onClick={() => document.getElementById('modelDialog')?.showModal()}><Info size={18} /> Modelos para IA</div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>
              <div className="dropdown-item" onClick={onToggleChart}><ChartBar size={18} /> Dashboard {showChart ? '(Ocultar)' : '(Mostrar)'}</div>
              <div className="dropdown-item danger" onClick={onClearCompleted}><Broom size={18} /> Limpar Concluídas</div>
            </div>
          )}
        </div>
      </div>
      <div className="global-progress"><div className="global-progress-fill" id="globalProgressFill"></div></div>
    </header>
  )
}
export default Header