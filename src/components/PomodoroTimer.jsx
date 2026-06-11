import React, { useState, useEffect } from 'react'
import { Timer } from '@phosphor-icons/react'

const PomodoroTimer = () => {
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(25 * 60)
  const duration = 25 * 60

  useEffect(() => {
    let interval
    if (running) {
      interval = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false)
            if (Notification.permission === 'granted') new Notification('TaskFlow', { body: 'Tempo de foco concluído!' })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    const bar = document.getElementById('pomodoroBar')
    if (bar) bar.style.width = `${((duration - remaining) / duration) * 100}%`
  }, [remaining])

  const toggle = () => {
    if (!running) {
      if (Notification.permission === 'default') Notification.requestPermission()
      setRemaining(duration)
      setRunning(true)
    } else {
      setRunning(false)
      const bar = document.getElementById('pomodoroBar')
      if (bar) bar.style.width = '0%'
    }
  }

  return (
    <>
      <button className={`icon-btn ${running ? 'pomodoro-active' : ''}`} onClick={toggle}><Timer size={20} /></button>
      <div className="pomodoro-bar" id="pomodoroBar"></div>
    </>
  )
}
export default PomodoroTimer