import React from 'react'

export default function StudentDetailModal({ student: s, onClose, onEdit }) {
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
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-300 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{s.name}</h2>
            {s.email && <p className="text-xs text-gray-400 mt-0.5">{s.email}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <Row label="Phone"         value={s.phone} />
            <Row label="Hometown"      value={s.hometown} />
            <Row label="Nationality"   value={s.nationality} />
            <Row label="Date of Birth" value={s.dateOfBirth} />
            <Row label="Gender"        value={s.gender} />
          </div>

          {/* Studies */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Studies</p>
            <div className="grid grid-cols-2 gap-4">
              <Row label="Type of Studies" value={s.typeOfStudies} />
              <Row label="Level"           value={s.levelOfStudy} />
              <Row label="Teacher"         value={s.teacherName} />
              <Row label="Length of Stay"  value={s.lengthOfStay} />
              <Row label="Arrival Date"    value={s.arrivalDate} />
              <Row label="Departure Date"  value={s.departureDate} />
              <Row label="Status"          value={s.status} />
            </div>
          </div>

          {/* Payment */}
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

          {/* Emergency contact */}
          {s.emergencyContact && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Emergency Contact</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{s.emergencyContact}</p>
              {s.emergencyPhone && <p className="text-xs text-gray-400 mt-0.5">{s.emergencyPhone}</p>}
            </div>
          )}

          {/* Notes */}
          {s.notes && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{s.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 btn-secondary justify-center">Close</button>
            {onEdit && <button onClick={onEdit} className="flex-1 btn-primary justify-center">Edit</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
