import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StudentModal from '../components/StudentModal'

const PAGE_SIZE = 10


const LEVELS   = ['All', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Graduate']
const STATUSES = ['All', 'Active', 'Upcoming', 'Departed']
const STUDIES  = ['All', 'Arabic', 'Quran', 'Both']

export default function Students({ search }) {
  const { students, deleteStudent, exportCSV } = useApp()
  const [modal, setModal]         = useState(null)
  const [viewModal, setView]      = useState(null)
  const [menuOpen, setMenu]       = useState(null)
  const [sort, setSort]           = useState({ key: 'name', dir: 'asc' })
  const [page, setPage]           = useState(1)
  const [filters, setFilters]     = useState({ status: 'All', study: 'All', level: 'All' })
  const [confirmDel, setConfirmDel] = useState(null)

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }

  const filtered = useMemo(() => {
    return students
      .filter(s => {
        const q = search?.toLowerCase() || ''
        if (q && !s.name.toLowerCase().includes(q) && !s.hometown?.toLowerCase().includes(q) && !s.teacherName?.toLowerCase().includes(q)) return false
        if (filters.status !== 'All' && s.status !== filters.status) return false
        if (filters.study  !== 'All' && s.typeOfStudies !== filters.study) return false
        if (filters.level  !== 'All' && s.levelOfStudy !== filters.level) return false
        return true
      })
      .sort((a, b) => {
        const av = a[sort.key] ?? ''
        const bv = b[sort.key] ?? ''
        return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
      })
  }, [students, search, filters, sort])

  const pages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  const SortArrow = ({ k }) => (
    <span className="text-[10px] ml-0.5 opacity-60">
      {sort.key === k ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
    </span>
  )

  const Col = ({ label, k, cls = '' }) => (
    <th
      onClick={() => toggleSort(k)}
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap ${cls}`}
    >
      {label}<SortArrow k={k} />
    </th>
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
          <select value={filters.study} onChange={e => setFilter('study', e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
            {STUDIES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Studies' : s}</option>)}
          </select>
          <select value={filters.level} onChange={e => setFilter('level', e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
            {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary text-xs">Export CSV</button>
          <button onClick={() => setModal('add')} className="btn-primary text-xs">+ Add Student</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-800">
              <tr>
                <Col label="Student"   k="name"         />
                <Col label="Hometown"  k="hometown"     />
                <Col label="Studies"   k="typeOfStudies"/>
                <Col label="Teacher"   k="teacherName"  />
                <Col label="Level"     k="levelOfStudy" />
                <Col label="Stay"      k="arrivalDate"  />
                <Col label="Status"    k="status"       />
                <Col label="Payment"   k="paymentStatus"/>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                    No students match your filters.
                  </td>
                </tr>
              )}
              {paged.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.email || '—'}</p>
                  </td>
                  {/* Hometown */}
                  <td className="px-4 py-3">
                    <span className="text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">{s.hometown || '—'}</span>
                  </td>
                  {/* Studies */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.typeOfStudies}</span>
                  </td>
                  {/* Teacher */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">{s.teacherName || '—'}</span>
                  </td>
                  {/* Level */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.levelOfStudy}</span>
                  </td>
                  {/* Stay */}
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{s.arrivalDate}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.lengthOfStay}</p>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.status}</span>
                  </td>
                  {/* Payment */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.paymentStatus}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setMenu(menuOpen === s.id ? null : s.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all text-base leading-none tracking-widest"
                    >
                      ···
                    </button>
                    {menuOpen === s.id && (
                      <div className="absolute right-4 top-10 z-30 w-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl py-1" onMouseLeave={() => setMenu(null)}>
                        <button onClick={() => { setView(s); setMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          View Details
                        </button>
                        <button onClick={() => { setModal(s); setMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Edit
                        </button>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                        <button onClick={() => { setConfirmDel(s); setMenu(null) }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} students
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Previous
            </button>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 text-xs rounded-lg transition-colors ${page === n ? 'bg-primary-600 text-white' : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {n}
              </button>
            ))}
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {modal    && <StudentModal student={modal === 'add' ? null : modal} onClose={() => setModal(null)} />}
      {viewModal && <ViewModal student={viewModal} onClose={() => setView(null)} onEdit={() => { setModal(viewModal); setView(null) }} />}

      {/* Confirm Delete */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card p-6 w-80 text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Delete Student</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              Remove <strong>{confirmDel.name}</strong> from the program? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDel(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
              <button onClick={() => { deleteStudent(confirmDel.id); setConfirmDel(null) }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function ViewModal({ student: s, onClose, onEdit }) {
  const pct = s.totalFees ? Math.min(100, Math.round((s.amountPaid / s.totalFees) * 100)) : 0
  const Row = ({ label, value }) => value ? (
    <div>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{value}</p>
    </div>
  ) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{s.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{s.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Row label="Phone"         value={s.phone} />
            <Row label="Hometown"      value={s.hometown} />
            <Row label="Nationality"   value={s.nationality} />
            <Row label="Date of Birth" value={s.dateOfBirth} />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Studies</p>
            <div className="grid grid-cols-2 gap-4">
              <Row label="Type of Studies" value={s.typeOfStudies} />
              <Row label="Level"           value={s.levelOfStudy} />
              <Row label="Teacher"         value={s.teacherName} />
              <Row label="Length of Stay"  value={s.lengthOfStay} />
              <Row label="Arrival Date"    value={s.arrivalDate} />
              <Row label="Departure Date"  value={s.departureDate} />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.paymentStatus}</span>
              {s.nextPaymentDate && <span className="text-xs text-gray-400">· Due: {s.nextPaymentDate}</span>}
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-1">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>${(s.amountPaid || 0).toLocaleString()} paid</span>
              <span>${(s.totalFees || 0).toLocaleString()} total</span>
            </div>
          </div>

          {s.emergencyContact && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Emergency Contact</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{s.emergencyContact}</p>
              {s.emergencyPhone && <p className="text-xs text-gray-400">{s.emergencyPhone}</p>}
            </div>
          )}
          {s.notes && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{s.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 btn-secondary justify-center">Close</button>
            <button onClick={onEdit}  className="flex-1 btn-primary justify-center">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}
