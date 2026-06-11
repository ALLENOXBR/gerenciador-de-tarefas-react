const KEY = 'taskflow_pro_v3'
export const loadTasks = () => { const data = localStorage.getItem(KEY); return data ? JSON.parse(data) : [] }
export const saveTasks = (tasks) => localStorage.setItem(KEY, JSON.stringify(tasks))
export const loadTheme = () => localStorage.getItem('taskflow_theme') === 'light'
export const saveTheme = (isLight) => localStorage.setItem('taskflow_theme', isLight ? 'light' : 'dark')
export const loadShowChart = () => localStorage.getItem('showChart') === 'true'
export const saveShowChart = (show) => localStorage.setItem('showChart', show)
export const loadTourDone = () => localStorage.getItem('tourDone') === 'true'
export const saveTourDone = () => localStorage.setItem('tourDone', 'true')