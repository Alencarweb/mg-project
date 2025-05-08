'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Circle } from 'lucide-react'

interface ClientStep {
  id: number
  completed: boolean
  completedAt: string | null
  step: {
    name: string
    id: number
  }
  serviceId: number
}

export default function ServiceProgressPage() {
  const params = useParams()
  const [steps, setSteps] = useState<ClientStep[]>([])
  const [service, setService] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Carrega tanto o serviço quanto as etapas
      const [serviceResponse, stepsResponse] = await Promise.all([
        fetch(`/api/user/services/${params.id}`),
        fetch(`/api/user/services/${params.id}/steps`)
      ])
      
      const serviceData = await serviceResponse.json()
      const stepsData = await stepsResponse.json()
      
      setService(serviceData)
      setSteps(stepsData)
    } catch (error) {
      setError('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      {service && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Progresso: {service.name}</h1>
          <div className="text-sm text-gray-500">
            Status: {service.status}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-right mt-1 text-sm text-gray-500">
            {steps.filter(s => s.completed).length} de {steps.length} etapas concluídas
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              {step.completed ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Circle className="text-gray-400" size={24} />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{step.step.name}</h3>
                {step.completedAt && (
                  <p className="text-sm text-gray-500">
                    Concluído em: {new Date(step.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}