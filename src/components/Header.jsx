import React from 'react'
import { useApp } from '../context/AppContext'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  students:  'Students',
  teachers:  'Teachers',
  payments:  'Payments',
  settings:  'Settings',
}

export default function Header({ searchValue, onSearchChange }) {
  const { theme, setTheme, activePage } = useApp()

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-10">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
        {PAGE_TITLES[activePage]}
      </h1>

      <div className="flex items-center gap-3">
        {(activePage === 'students' || activePage === 'teachers' || activePage === 'payments') && (
          <input
            type="text"
            placeholder="Search…"
            value={searchValue || ''}
            onChange={e => onSearchChange?.(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-52 transition-all"
          />
        )}

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5">
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                theme === t
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
