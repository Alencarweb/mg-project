'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardStats {
  totalClients: number
  activeServices: number
  pendingPayments: number
  serviceMetrics: {
    labels: string[]
    data: number[]
  }
  monthlyRevenue: {
    labels: string[]
    data: number[]
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function loadStats() {
      const response = await fetch('/api/admin/dashboard-stats')
      const data = await response.json()
      setStats(data)
    }
    loadStats()
  }, [])

  if (!stats) {
    return <div>Carregando...</div>
  }

  const serviceData = {
    labels: stats.serviceMetrics.labels,
    datasets: [
      {
        label: 'Serviços por Tipo',
        data: stats.serviceMetrics.data,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  }

  const revenueData = {
    labels: stats.monthlyRevenue.labels,
    datasets: [
      {
        label: 'Receita Mensal',
        data: stats.monthlyRevenue.data,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      }
    ]
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total de Clientes</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalClients}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Serviços Ativos</h2>
          <p className="text-3xl font-bold text-green-600">{stats.activeServices}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Pagamentos Pendentes</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Serviços por Tipo</h2>
          <Bar data={serviceData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Receita Mensal</h2>
          <Bar data={revenueData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          {/* Lista de atividades recentes será implementada aqui */}
        </div>
      </div>
    </div>
  )
}