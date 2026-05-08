import React from 'react'

import { useApp } from '../context/AppContext'

const StatCard = ({ label, value, sub, onClick }) => (
  <div
    onClick={onClick}
    className={`card p-5 flex flex-col justify-between min-h-[7.5rem] ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  >
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-tight">{label}</p>
    <div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 min-h-[1rem]">{sub || ''}</p>
    </div>
  </div>
)

const STUDY_COLORS = {
  Arabic: 'bg-gray-300 dark:bg-gray-600',
  Quran:  'bg-gray-300 dark:bg-gray-600',
  Both:   'bg-gray-300 dark:bg-gray-600',
}

const STATUS_COLORS = {
  Active:   'bg-primary-500',
  Upcoming: 'bg-amber-500',
  Departed: 'bg-gray-400',
}

export default function Dashboard() {
  const { students, setActivePage } = useApp()

  const active   = students.filter(s => s.status === 'Active').length
  const upcoming = students.filter(s => s.status === 'Upcoming').length
  const departed = students.filter(s => s.status === 'Departed').length
  const paymentDue = students.filter(s => s.paymentStatus === 'Payment Needed' || s.paymentStatus === 'Next Payment Due').length
  const totalRevenue = students.reduce((acc, s) => acc + (s.amountPaid || 0), 0)
  const outstanding  = students.reduce((acc, s) => acc + Math.max(0, (s.totalFees || 0) - (s.amountPaid || 0)), 0)

  // Recent students (last 5 by createdAt)
  const recent = [...students].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  // Breakdowns
  const byStudyType = ['Arabic', 'Quran', 'Both'].map(t => ({
    type: t, count: students.filter(s => s.typeOfStudies === t).length
  }))

  const today = new Date()
  const soonDue = students
    .filter(s => s.nextPaymentDate && new Date(s.nextPaymentDate) >= today)
    .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate))
    .slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students" value={students.length}
          sub={`${active} currently active`}
          onClick={() => setActivePage('students')}
        />
        <StatCard
          label="Active Now" value={active}
          sub={`${upcoming} upcoming · ${departed} departed`}
        />
        <StatCard
          label="Payments Due" value={paymentDue}
          sub="Need attention"
          onClick={() => setActivePage('payments')}
        />
        <StatCard
          label="Revenue Collected" value={`$${totalRevenue.toLocaleString()}`}
          sub={outstanding > 0 ? `$${outstanding.toLocaleString()} outstanding` : 'All collected'}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent students */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Students</h3>
            <button onClick={() => setActivePage('students')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {recent.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.hometown || '—'}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{s.typeOfStudies}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{s.paymentStatus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Study breakdown */}
          <div className="card p-5 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Studies Breakdown</h3>
            <div className="space-y-3">
              {byStudyType.map(({ type, count }) => (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{type}</span>
                    <span className="text-gray-500 dark:text-gray-500">{count} students</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STUDY_COLORS[type]} transition-all`}
                      style={{ width: `${students.length ? (count / students.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              {['Active', 'Upcoming', 'Departed'].map(st => (
                <div key={st} className="flex justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[st]}`} />
                    {st}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {students.filter(s => s.status === st).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming payments */}
          {soonDue.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Upcoming Payments</h3>
              <div className="space-y-2.5">
                {soonDue.map(s => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{s.name}</p>
                      <p className="text-[11px] text-gray-400">${((s.totalFees || 0) - (s.amountPaid || 0)).toLocaleString()} due {s.nextPaymentDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
