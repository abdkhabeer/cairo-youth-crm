import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const EMPTY = {
  name: '', email: '', phone: '', hometown: '', nationality: '', dateOfBirth: '', gender: '',
  typeOfStudies: 'Arabic', teacherId: '', teacherName: '',
  levelOfStudy: 'Beginner', arrivalDate: '', departureDate: '',
  paymentStatus: 'Payment Needed', nextPaymentDate: '', totalFees: '', amountPaid: '',
  notes: '', emergencyContact: '', emergencyPhone: '',
}

const TABS     = ['Basic Info', 'Studies', 'Payment']
const TAB_IDS  = ['basic', 'studies', 'payment']
const LEVELS   = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Graduate']
const STATUSES = ['Paid in Full', 'Next Payment Due', 'Partial', 'Payment Needed', 'Scholarship']

const F = ({ label, error, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

export default function StudentModal({ student, onClose }) {
  const { addStudent, updateStudent, teachers } = useApp()
  const [form, setForm] = useState(student ? { ...student } : { ...EMPTY })
  const [tab, setTab]   = useState('basic')
  const [errors, setErrors] = useState({})

  const isEdit = !!student

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleTeacher = (id) => {
    const t = teachers.find(t => t.id === id)
    setForm(f => ({ ...f, teacherId: id, teacherName: t?.name || '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name = 'Name is required'
    if (!form.arrivalDate)   e.arrivalDate = 'Required'
    if (!form.departureDate) e.departureDate = 'Required'
    if (!form.teacherId)     e.teacherId = 'Select a teacher'
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const payload = {
      ...form,
      totalFees:  parseFloat(form.totalFees)  || 0,
      amountPaid: parseFloat(form.amountPaid) || 0,
    }
    isEdit ? updateStudent(payload) : addStudent(payload)
    onClose()
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the student's information below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3">
          {TABS.map((label, i) => {
            const id = TAB_IDS[i]
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* BASIC INFO */}
          {tab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Full Name *" error={errors.name}>
                  <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Ahmed Al-Rashid" />
                </F>
                <F label="Gender">
                  <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select…</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </F>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Email">
                  <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@email.com" />
                </F>
                <F label="Phone">
                  <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
                </F>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Hometown">
                  <input className="input" value={form.hometown} onChange={e => set('hometown', e.target.value)} placeholder="City, State/Country" />
                </F>
                <F label="Nationality">
                  <input className="input" value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="e.g. American" />
                </F>
              </div>
              <F label="Date of Birth">
                <input className="input" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              </F>
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Contact Name & Relation">
                    <input className="input" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} placeholder="e.g. Ahmad Ali (Father)" />
                  </F>
                  <F label="Contact Phone">
                    <input className="input" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} placeholder="+1 555 000 0001" />
                  </F>
                </div>
              </div>
            </div>
          )}

          {/* STUDIES */}
          {tab === 'studies' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Type of Studies">
                  <select className="input" value={form.typeOfStudies} onChange={e => set('typeOfStudies', e.target.value)}>
                    <option>Arabic</option>
                    <option>Quran</option>
                    <option>Both</option>
                  </select>
                </F>
                <F label="Level of Study">
                  <select className="input" value={form.levelOfStudy} onChange={e => set('levelOfStudy', e.target.value)}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </F>
              </div>
              <F label="Assigned Teacher *" error={errors.teacherId}>
                <select className="input" value={form.teacherId} onChange={e => handleTeacher(e.target.value)}>
                  <option value="">Select a teacher…</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                  ))}
                </select>
              </F>
              <div className="grid grid-cols-2 gap-4">
                <F label="Arrival Date *" error={errors.arrivalDate}>
                  <input className="input" type="date" value={form.arrivalDate} onChange={e => set('arrivalDate', e.target.value)} />
                </F>
                <F label="Departure Date *" error={errors.departureDate}>
                  <input className="input" type="date" value={form.departureDate} onChange={e => set('departureDate', e.target.value)} />
                </F>
              </div>
              {form.arrivalDate && form.departureDate && (
                <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-3 text-sm text-primary-700 dark:text-primary-400">
                  Length of stay: <strong>
                    {(() => {
                      const days = Math.round((new Date(form.departureDate) - new Date(form.arrivalDate)) / 86400000)
                      if (days <= 0) return 'Invalid range'
                      const m = Math.floor(days / 30), d = days % 30
                      return m === 0 ? `${days} days` : d === 0 ? `${m} months` : `${m} months, ${d} days`
                    })()}
                  </strong>
                </div>
              )}
              <F label="Notes">
                <textarea className="input resize-none" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any relevant notes about the student's progress or situation…" />
              </F>
            </div>
          )}

          {/* PAYMENT */}
          {tab === 'payment' && (
            <div className="space-y-4">
              <F label="Payment Status">
                <select className="input" value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </F>
              <div className="grid grid-cols-2 gap-4">
                <F label="Total Fees (USD)">
                  <input className="input" type="number" min="0" step="0.01" value={form.totalFees} onChange={e => set('totalFees', e.target.value)} placeholder="0.00" />
                </F>
                <F label="Amount Paid (USD)">
                  <input className="input" type="number" min="0" step="0.01" value={form.amountPaid} onChange={e => set('amountPaid', e.target.value)} placeholder="0.00" />
                </F>
              </div>
              {(parseFloat(form.totalFees) > 0 || parseFloat(form.amountPaid) > 0) && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Balance due</span>
                    <span className={`font-semibold ${(parseFloat(form.totalFees) - parseFloat(form.amountPaid)) > 0 ? 'text-red-500' : 'text-primary-600'}`}>
                      ${((parseFloat(form.totalFees) || 0) - (parseFloat(form.amountPaid) || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${Math.min(100, ((parseFloat(form.amountPaid) || 0) / (parseFloat(form.totalFees) || 1)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {Math.round(((parseFloat(form.amountPaid) || 0) / (parseFloat(form.totalFees) || 1)) * 100)}% paid
                  </p>
                </div>
              )}
              {(form.paymentStatus === 'Next Payment Due' || form.paymentStatus === 'Partial' || form.paymentStatus === 'Payment Needed') && (
                <F label="Next Payment Date">
                  <input className="input" type="date" value={form.nextPaymentDate} onChange={e => set('nextPaymentDate', e.target.value)} />
                </F>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-300 dark:border-gray-800">
          <div className="flex gap-2">
            {TAB_IDS.map(id => (
              <div key={id} className={`w-2 h-2 rounded-full transition-colors ${tab === id ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="button" onClick={handleSubmit} className="btn-primary">
              {isEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
