import React from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const ProductivityChart = ({ tasks }) => {
  const getData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const counts = new Array(7).fill(0)
    const today = new Date()
    tasks.forEach(t => {
      if (t.completed && t.completedDate) {
        const d = new Date(t.completedDate)
        if ((today - d) / (1000 * 60 * 60 * 24) <= 7) counts[d.getDay()]++
      }
    })
    return { labels: days, data: counts }
  }
  const { labels, data } = getData()
  const chartData = {
    labels,
    datasets: [{
      label: 'Tarefas concluídas',
      data,
      backgroundColor: getComputedStyle(document.body).getPropertyValue('--brand-primary') || '#F97316',
      borderRadius: 6,
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw} tarefa(s)` } } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  }
  return (
    <div className="chart-container visible">
      <Bar data={chartData} options={options} />
    </div>
  )
}
export default ProductivityChart