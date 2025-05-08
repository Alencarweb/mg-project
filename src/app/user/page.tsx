'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Service {
  id: number
  service: {
    name: string
  }
  status: string
  startDate: string
  steps: Array<{
    completed: boolean
    step: {
      name: string
    }
  }>
}

export default function UserDashboard() {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch('/api/user/services')
        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadServices()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{service.service.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Started: {new Date(service.startDate).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">
                  {service.steps.filter(s => s.completed).length} of {service.steps.length} steps
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(service.steps.filter(s => s.completed).length / service.steps.length) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Steps:</h4>
              <ul className="space-y-1">
                {service.steps.map((step, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className={`mr-2 ${step.completed ? 'text-green-500' : 'text-gray-400'}`}>
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
  )
}