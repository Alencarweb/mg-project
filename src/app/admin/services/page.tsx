'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  type: string
  fixedPrice: number | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      setError('Erro ao carregar serviços')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir serviço')
      
      setServices(services.filter(service => service.id !== id))
    } catch (error) {
      alert('Erro ao excluir serviço')
    }
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <Link
          href="/admin/services/new"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Novo Serviço
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm font-medium">Tipo: {service.type}</span>
              {service.fixedPrice && (
                <span className="text-sm font-medium">
                  R$ {service.fixedPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Editar"
              >
                <Pencil size={20} />
              </Link>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Excluir"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}