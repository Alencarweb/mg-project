'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GripVertical, Plus, X } from 'lucide-react'

interface Step {
  id: number
  name: string
}

interface ServiceStep {
  id: number
  stepId: number
  order: number
  step: Step
}

export default function ServiceStepsPage() {
  const params = useParams()
  const [steps, setSteps] = useState<Step[]>([])
  const [serviceSteps, setServiceSteps] = useState<ServiceStep[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newStepName, setNewStepName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [stepsResponse, serviceStepsResponse] = await Promise.all([
        fetch('/api/admin/steps'),
        fetch(`/api/admin/services/${params.id}/steps`)
      ])
      
      const stepsData = await stepsResponse.json()
      const serviceStepsData = await serviceStepsResponse.json()
      
      setSteps(stepsData)
      setServiceSteps(serviceStepsData)
    } catch (error) {
      setError('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStep = async (stepId: number) => {
    try {
      const response = await fetch(`/api/admin/services/${params.id}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId,
          order: serviceSteps.length
        })
      })

      if (!response.ok) throw new Error('Erro ao adicionar etapa')
      
      const newServiceStep = await response.json()
      setServiceSteps([...serviceSteps, newServiceStep])
    } catch (error) {
      setError('Erro ao adicionar etapa')
    }
  }

  const handleRemoveStep = async (serviceStepId: number) => {
    try {
      const response = await fetch(`/api/admin/services/${params.id}/steps/${serviceStepId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao remover etapa')
      
      setServiceSteps(serviceSteps.filter(step => step.id !== serviceStepId))
    } catch (error) {
      setError('Erro ao remover etapa')
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(serviceSteps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedSteps = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setServiceSteps(updatedSteps)

    try {
      await fetch(`/api/admin/services/${params.id}/steps/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: updatedSteps })
      })
    } catch (error) {
      setError('Erro ao reordenar etapas')
    }
  }

  const handleCreateAndAddStep = async () => {
    if (!newStepName.trim()) return
    try {
      // Cria o step
      const stepRes = await fetch('/api/admin/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStepName })
      })
      if (!stepRes.ok) throw new Error('Erro ao criar etapa')
      const step = await stepRes.json()

      // Associa ao serviço
      await handleAddStep(step.id)
      setNewStepName('')
    } catch (error) {
      setError('Erro ao criar e adicionar etapa')
    }
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciar Etapas do Serviço</h1>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Etapas Disponíveis</h2>
          <div className="bg-white shadow rounded-lg p-4">
            {/* Formulário para criar e já vincular */}
            <div className="flex mb-4">
              <input
                type="text"
                value={newStepName}
                onChange={e => setNewStepName(e.target.value)}
                placeholder="Nova etapa"
                className="flex-1 border rounded-l px-3 py-2"
              />
              <button
                onClick={handleCreateAndAddStep}
                className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
              >
                Criar e Vincular
              </button>
            </div>
            {/* Lista de steps já existentes */}
            {steps.map(step => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <span>{step.name}</span>
                <button
                  onClick={() => handleAddStep(step.id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Etapas do Serviço</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white shadow rounded-lg p-4"
                >
                  {serviceSteps.map((serviceStep, index) => (
                    <Draggable
                      key={serviceStep.id}
                      draggableId={serviceStep.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-3 bg-gray-50 mb-2 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span {...provided.dragHandleProps} className="mr-3">
                              <GripVertical size={20} className="text-gray-400" />
                            </span>
                            <span>{serviceStep.step.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveStep(serviceStep.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}