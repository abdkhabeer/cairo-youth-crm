import React, { useRef } from 'react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { theme, setTheme, exportBackup, importBackup, students, teachers } = useApp()
  const fileRef = useRef()

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) { importBackup(file); e.target.value = '' }
  }

  const Section = ({ title, children }) => (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-5">
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Program',   'Cairo Youth Program'],
            ['Location',  'Cairo, Egypt'],
            ['Students',  students.length],
            ['Teachers',  teachers.length],
            ['Active',    students.filter(s => s.status === 'Active').length],
            ['Upcoming',  students.filter(s => s.status === 'Upcoming').length],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800/50">
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
              <p className="text-xs text-gray-400 mt-0.5">Download a full JSON backup of all students and teachers</p>
            </div>
            <button onClick={exportBackup} className="btn-secondary text-xs shrink-0">Export</button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Import Backup</p>
              <p className="text-xs text-gray-400 mt-0.5">Restore data from a previously exported JSON backup</p>
            </div>
            <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs shrink-0">Import</button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>
      </Section>

      <div className="card p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Data stored locally</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
          All data is saved in your browser's local storage. Use the export backup feature regularly to avoid data loss.
        </p>
      </div>
    </div>
  )
}
