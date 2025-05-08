'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Step {
  id: number
  step: {
    name: string
  }
  order: number
}

interface Service {
  id: number
  name: string
  description: string
  type: string
  fixedPrice: number | null
  steps: Step[]
}

export default function ServiceDetailsPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadService() {
      try {
        const response = await fetch(`/api/admin/services/${params.id}`)
        const data = await response.json()
        setService(data)
      } catch (error) {
        console.error('Erro ao carregar serviço:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadService()
  }, [params.id])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!service) {
    return <div>Serviço não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes do Serviço</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={service.name}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={service.description || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <input
                  type="text"
                  value={service.type}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço Base</label>
                <input
                  type="number"
                  value={service.fixedPrice || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Etapas do Serviço</h3>
            <div className="mt-4">
              <ul className="space-y-3">
                {service.steps && service.steps.length > 0 ? (
                  service.steps
                    .sort((a, b) => a.order - b.order)
                    .map((serviceStep) => (
                      <li
                        key={serviceStep.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <span>{serviceStep.step.name}</span>
                        <span className="text-gray-500">Ordem: {serviceStep.order}</span>
                      </li>
                    ))
                ) : (
                  <li>Nenhuma etapa cadastrada</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}