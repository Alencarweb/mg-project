'use client'

import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Bem-vindo, {session?.user?.name}
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => signOut()}
            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}