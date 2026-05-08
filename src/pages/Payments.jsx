import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'


const ALL_STATUSES = ['All', 'Payment Needed', 'Next Payment Due', 'Partial', 'Paid in Full', 'Scholarship']

export default function Payments({ search }) {
  const { students, exportCSV } = useApp()
  const [filter, setFilter] = useState('All')

  const today = new Date()

  const stats = useMemo(() => {
    const active = students.filter(s => s.status !== 'Departed')
    return {
      totalRevenue: students.reduce((a, s) => a + (s.amountPaid || 0), 0),
      outstanding:  active.reduce((a, s) => a + Math.max(0, (s.totalFees || 0) - (s.amountPaid || 0)), 0),
      needAction:   active.filter(s => s.paymentStatus === 'Payment Needed' || s.paymentStatus === 'Next Payment Due').length,
      paidInFull:   active.filter(s => s.paymentStatus === 'Paid in Full' || s.paymentStatus === 'Scholarship').length,
    }
  }, [students])

  const filtered = useMemo(() => {
    return students
      .filter(s => {
        if (filter !== 'All' && s.paymentStatus !== filter) return false
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        const order = { 'Payment Needed': 0, 'Next Payment Due': 1, 'Partial': 2, 'Paid in Full': 3, 'Scholarship': 4 }
        return (order[a.paymentStatus] ?? 5) - (order[b.paymentStatus] ?? 5)
      })
  }, [students, filter, search])

  const isOverdue = (s) => s.nextPaymentDate && new Date(s.nextPaymentDate) < today &&
    (s.paymentStatus === 'Payment Needed' || s.paymentStatus === 'Next Payment Due' || s.paymentStatus === 'Partial')

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `$${stats.totalRevenue.toLocaleString()}` },
          { label: 'Outstanding',     value: `$${stats.outstanding.toLocaleString()}`  },
          { label: 'Need Action',     value: stats.needAction                           },
          { label: 'Settled',         value: stats.paidInFull                           },
        ].map(({ label, value }) => (
          <div key={label} className="card p-5 flex flex-col justify-between min-h-[7.5rem]">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters + table */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} className="btn-secondary text-xs">Export CSV</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Student', 'Status', 'Total Fees', 'Paid', 'Balance', 'Due Date', 'Progress'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No payment records match.</td></tr>
              )}
              {filtered.map(s => {
                const balance = Math.max(0, (s.totalFees || 0) - (s.amountPaid || 0))
                const pct     = s.totalFees ? Math.min(100, Math.round((s.amountPaid / s.totalFees) * 100)) : 0
                const overdue = isOverdue(s)
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${overdue ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.status}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{s.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                      ${(s.totalFees || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-primary-600 dark:text-primary-400 font-medium">
                      ${(s.amountPaid || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${balance > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {balance > 0 ? `$${balance.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.nextPaymentDate
                        ? <span className={`text-xs whitespace-nowrap ${overdue ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{s.nextPaymentDate}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-400 w-7 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
