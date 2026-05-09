import React from 'react'
import { useApp } from '../context/AppContext'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students',  label: 'Students'  },
  { id: 'teachers',  label: 'Teachers'  },
  { id: 'payments',  label: 'Payments'  },
  { id: 'settings',  label: 'Settings'  },
]

export default function Sidebar() {
  const { activePage, setActivePage } = useApp()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-300 dark:border-gray-800">
        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Shababunaa Academy</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">Program CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-300 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Admin</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Shababunaa Academy</p>
      </div>
    </aside>
  )
}
