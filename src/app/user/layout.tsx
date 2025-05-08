'use client'

import Sidebar from '../../components/Sidebar'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 md:ml-64">
        {children}
      </main>
    </div>
  )
}