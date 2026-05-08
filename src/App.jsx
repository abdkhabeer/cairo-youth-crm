import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Payments from './pages/Payments'
import Settings from './pages/Settings'

function Inner() {
  const { activePage } = useApp()
  const [search, setSearch] = useState('')

  // Reset search on page change
  React.useEffect(() => setSearch(''), [activePage])

  const Page = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'students':  return <Students  search={search} />
      case 'teachers':  return <Teachers  search={search} />
      case 'payments':  return <Payments  search={search} />
      case 'settings':  return <Settings />
      default:          return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="pl-60">
        <Header searchValue={search} onSearchChange={setSearch} />
        <main className="pt-16">
          <div className="p-6">
            <Page />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
