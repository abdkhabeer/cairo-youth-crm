import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

const EMPTY = { name: '', subject: 'Both', email: '', phone: '', notes: '' }
const SUBJECTS = ['Arabic', 'Quran', 'Both']


function TeacherModal({ teacher, onClose }) {
  const { addTeacher, updateTeacher } = useApp()
  const [form, setForm] = useState(teacher ? { ...teacher } : { ...EMPTY })
  const [errors, setErrors] = useState({})
  const isEdit = !!teacher

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return }
    isEdit ? updateTeacher(form) : addTeacher(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{isEdit ? 'Edit Teacher' : 'Add Teacher'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg leading-none">
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sheikh Muhammad Hassan" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subject} onChange={e => set('subject', e.target.value)}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="teacher@cyp.edu" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+20 100 000 0000" />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Background, specialisations, etc." />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-300 dark:border-gray-800">
          <button onClick={onClose} className="flex-1 btn-secondary justify-center">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 btn-primary justify-center">{isEdit ? 'Save' : 'Add Teacher'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Teachers({ search }) {
  const { teachers, students, deleteTeacher } = useApp()
  const [modal, setModal]       = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const enriched = useMemo(() =>
    teachers.map(t => ({
      ...t,
      studentCount: students.filter(s => s.teacherId === t.id && s.status !== 'Departed').length,
    })).filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase())),
    [teachers, students, search]
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal('add')} className="btn-primary text-sm">+ Add Teacher</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {enriched.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400 dark:text-gray-600">No teachers found.</div>
        )}
        {enriched.map(t => (
          <div key={t.id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{t.subject}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setModal(t)}
                  className="px-2.5 py-1 rounded-md text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Edit
                </button>
                <button onClick={() => setConfirmDel(t)}
                  className="px-2.5 py-1 rounded-md text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  Remove
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {t.email && <p className="text-xs text-gray-500 dark:text-gray-400">{t.email}</p>}
              {t.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{t.phone}</p>}
              {t.notes && <p className="text-xs text-gray-400 dark:text-gray-500 italic leading-relaxed">{t.notes}</p>}
            </div>

            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">{t.studentCount}</strong> active student{t.studentCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modal && <TeacherModal teacher={modal === 'add' ? null : modal} onClose={() => setModal(null)} />}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card p-6 w-80 text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Remove Teacher?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              Remove <strong>{confirmDel.name}</strong>? Their students will need to be reassigned.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDel(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => { deleteTeacher(confirmDel.id); setConfirmDel(null) }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
