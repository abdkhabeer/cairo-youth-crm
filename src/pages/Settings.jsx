import React, { useRef, useState } from 'react'
import { useApp } from '../context/AppContext'

const Bar = ({ label, value, total, color }) => {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-500 dark:text-gray-500">{value} <span className="text-gray-400">({pct}%)</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="card p-6">
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-300 dark:border-gray-800">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
)

export default function Settings() {
  const { theme, setTheme, exportBackup, importBackup, exportCSV, students, teachers } = useApp()
  const fileRef   = useRef()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) { importBackup(file); e.target.value = '' }
  }

  const active   = students.filter(s => s.status === 'Active').length
  const upcoming = students.filter(s => s.status === 'Upcoming').length
  const departed = students.filter(s => s.status === 'Departed').length

  const arabic = students.filter(s => s.typeOfStudies === 'Arabic').length
  const quran  = students.filter(s => s.typeOfStudies === 'Quran').length
  const both   = students.filter(s => s.typeOfStudies === 'Both').length

  const paidFull   = students.filter(s => s.paymentStatus === 'Paid in Full').length
  const scholarship= students.filter(s => s.paymentStatus === 'Scholarship').length
  const partial    = students.filter(s => s.paymentStatus === 'Partial').length
  const due        = students.filter(s => s.paymentStatus === 'Next Payment Due' || s.paymentStatus === 'Payment Needed').length

  const totalCollected  = students.reduce((a, s) => a + (s.amountPaid  || 0), 0)
  const totalOutstanding = students.filter(s => s.status !== 'Departed')
    .reduce((a, s) => a + Math.max(0, (s.totalFees || 0) - (s.amountPaid || 0)), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

      {/* ── Left column ── */}
      <div className="space-y-5">
        <Section title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Theme</p>
              <p className="text-xs text-gray-400 mt-0.5">Switch between light and dark mode</p>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
              {['light', 'dark'].map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    theme === t
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Program Info">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {[
              ['Program',   'Cairo Youth Program'],
              ['Location',  'Cairo, Egypt'],
              ['Students',  students.length],
              ['Teachers',  teachers.length],
              ['Active',    active],
              ['Upcoming',  upcoming],
              ['Departed',  departed],
              ['Revenue',   `$${totalCollected.toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Data Management">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Export Backup</p>
                <p className="text-xs text-gray-400 mt-0.5">Full JSON backup of all students and teachers</p>
              </div>
              <button onClick={exportBackup} className="btn-secondary text-xs shrink-0">Export</button>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Export Students CSV</p>
                <p className="text-xs text-gray-400 mt-0.5">Download all student records as a spreadsheet</p>
              </div>
              <button onClick={exportCSV} className="btn-secondary text-xs shrink-0">Export</button>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Import Backup</p>
                <p className="text-xs text-gray-400 mt-0.5">Restore from a previously exported JSON backup</p>
              </div>
              <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs shrink-0">Import</button>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </div>
        </Section>

        <div className="card p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Data stored locally</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            All data is saved in your browser's local storage. Export a backup regularly to avoid data loss.
          </p>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="space-y-5">
        <Section title="Enrollment Overview">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</p>
            <div className="space-y-2.5">
              <Bar label="Active"   value={active}   total={students.length} color="bg-primary-500" />
              <Bar label="Upcoming" value={upcoming} total={students.length} color="bg-amber-400" />
              <Bar label="Departed" value={departed} total={students.length} color="bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Type of Studies</p>
            <div className="space-y-2.5">
              <Bar label="Arabic" value={arabic} total={students.length} color="bg-blue-400" />
              <Bar label="Quran"  value={quran}  total={students.length} color="bg-emerald-400" />
              <Bar label="Both"   value={both}   total={students.length} color="bg-violet-400" />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Status</p>
            <div className="space-y-2.5">
              <Bar label="Paid in Full"   value={paidFull}    total={students.length} color="bg-green-400" />
              <Bar label="Scholarship"    value={scholarship} total={students.length} color="bg-violet-400" />
              <Bar label="Partial / Due"  value={partial + due} total={students.length} color="bg-red-400" />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">Collected</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">${totalCollected.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">Outstanding</p>
              <p className={`text-lg font-bold mt-0.5 ${totalOutstanding > 0 ? 'text-red-500' : 'text-primary-600 dark:text-primary-400'}`}>
                ${totalOutstanding.toLocaleString()}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Danger Zone">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Clear All Data</p>
              <p className="text-xs text-gray-400 mt-0.5">Permanently delete all students and teachers. Cannot be undone.</p>
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
            >
              Clear
            </button>
          </div>
        </Section>
      </div>

      {/* Clear confirmation */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card p-6 w-80 text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Clear all data?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              This will permanently remove all <strong>{students.length}</strong> students and <strong>{teachers.length}</strong> teachers. Export a backup first if needed.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmClear(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button
                onClick={() => {
                  localStorage.removeItem('cyp-crm-v1')
                  window.location.reload()
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
