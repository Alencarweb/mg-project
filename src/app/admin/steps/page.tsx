'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface Step {
  id: number
  name: string
}

export default function StepsPage() {
  const [steps, setSteps] = useState<Step[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSteps()
  }, [])

  async function loadSteps() {
    try {
      const response = await fetch('/api/admin/steps')
      const data = await response.json()
      setSteps(data)
    } catch (error) {
      setError('Erro ao carregar etapas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta etapa?')) return

    try {
      const response = await fetch(`/api/admin/steps/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir etapa')
      
      setSteps(steps.filter(step => step.id !== id))
    } catch (error) {
      alert('Erro ao excluir etapa')
    }
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Etapas</h1>
        <Link
          href="/admin/steps/new"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Etapa
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {steps.map((step) => (
              <tr key={step.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/steps/${step.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(step.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}