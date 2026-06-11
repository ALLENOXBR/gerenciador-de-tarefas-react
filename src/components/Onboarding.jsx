import React, { useState } from 'react'

const Onboarding = ({ onFinish }) => {
  const [step, setStep] = useState(0)
  const steps = [
    { title: 'Bem-vindo ao TaskFlow Pro', desc: 'Organize suas tarefas com inteligência e estilo premium.' },
    { title: 'Arraste & Solte', desc: 'Reordene tarefas manualmente. Use filtros e busca fuzzy.' },
    { title: 'Foco e Produtividade', desc: 'Use o timer Pomodoro e acompanhe seu progresso semanal.' }
  ]
  const nextStep = () => { if (step < steps.length - 1) setStep(step + 1); else onFinish() }
  return (
    <div className="onboarding-overlay" style={{ display: 'flex' }}>
      <div className="onboarding-card">
        <h2>{steps[step].title}</h2>
        <p>{steps[step].desc}</p>
        <div className="onboarding-dots">
          {steps.map((_, i) => <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`}></div>)}
        </div>
        <button className="btn-onboard" onClick={nextStep}>{step < steps.length - 1 ? 'Próximo' : 'Começar'}</button>
      </div>
    </div>
  )
}
export default Onboarding