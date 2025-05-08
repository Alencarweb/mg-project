'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface ClientService {
  id: number
  service: {
    name: string
  }
  status: string
  startDate: string
  steps: Array<{
    step: {
      name: string
    }
    completed: boolean
    completedAt: string | null
  }>
}

interface Client {
  id: number
  user: {
    name: string
    email: string
  }
  taxId: string
  phone: string
  address: string
  services: ClientService[]
}

export default function ClientDetailsPage() {
  const params = useParams()
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    async function loadClient() {
      const response = await fetch(`/api/admin/clients/${params.id}`)
      const data = await response.json()
      setClient(data)
    }
    loadClient()
  }, [params.id])

  if (!client) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informações do Cliente</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="text-sm text-gray-900">{client.user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{client.user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CPF/CNPJ</dt>
                <dd className="text-sm text-gray-900">{client.taxId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="text-sm text-gray-900">{client.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                <dd className="text-sm text-gray-900">{client.address}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Serviços Contratados</h3>
            <div className="space-y-4">
              {client.services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{service.service.name}</h4>
                  <p className="text-sm text-gray-500">
                    Status: {service.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Início: {new Date(service.startDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Progresso das Etapas:</p>
                    <ul className="mt-1 space-y-1">
                      {service.steps.map((step, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className={`mr-2 ${step.completed ? 'text-green-500' : 'text-gray-500'}`}>
                            {step.completed ? '✓' : '○'}
                          </span>
                          {step.step.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}