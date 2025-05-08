'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LayoutDashboard, Wrench, ClipboardList, Users, TrendingUp, Wallet, LogOut, ListChecks } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/services', label: 'Serviços', icon: <Wrench size={20} /> },
    { href: '/admin/steps', label: 'Etapas', icon: <ListChecks size={20} /> },
    { href: '/admin/clients', label: 'Clientes', icon: <Users size={20} /> },
  ]

  const clientLinks = [
    { href: '/user', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/user/services', label: 'Meus Serviços', icon: <Wrench size={20} /> },
    { href: '/user/progress', label: 'Progresso', icon: <TrendingUp size={20} /> },
    { href: '/user/payments', label: 'Pagamentos', icon: <Wallet size={20} /> },
  ]

  const links = isAdmin ? adminLinks : clientLinks

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-800 text-white z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:w-64
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-8">MG Project</h2>
          <nav className="flex-1">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      flex items-center p-3 rounded-lg transition-colors duration-200
                      ${pathname === link.href 
                        ? 'bg-gray-700 text-white' 
                        : 'hover:bg-gray-700'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3 text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-700 text-red-400 hover:text-red-300 mt-auto"
          >
            <LogOut size={20} className="mr-3" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}