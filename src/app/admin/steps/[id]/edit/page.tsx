'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Step {
  id: number
  name: string
}

export default function EditStepPage() {
  const router = useRouter()
  const params = useParams()
  const [step, setStep] = useState<Step | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStep()
  }, [])

  async function loadStep() {
    try {
      const response = await fetch(`/api/admin/steps/${params.id}`)
      if (!response.ok) throw new Error('Etapa não encontrada')
      const data = await response.json()
      setStep(data)
    } catch (error) {
      setError('Erro ao carregar etapa')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!step) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/steps/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(step)
      })

      if (!response.ok) throw new Error('Erro ao atualizar etapa')
      
      router.push('/admin/steps')
    } catch (error) {
      setError('Erro ao atualizar etapa')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Carregando...</div>
  if (!step) return <div>Etapa não encontrada</div>

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/steps" 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Etapa</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Etapa *
            </label>
            <input
              type="text"
              id="name"
              value={step.name}
              onChange={(e) => setStep({ ...step, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/admin/steps"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}