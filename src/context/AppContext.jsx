import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'

const genId = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

const calcStatus = (arrival, departure) => {
  const today = new Date()
  const a = new Date(arrival)
  const d = new Date(departure)
  if (today < a) return 'Upcoming'
  if (today > d) return 'Departed'
  return 'Active'
}

const calcLengthOfStay = (arrival, departure) => {
  if (!arrival || !departure) return ''
  const a = new Date(arrival)
  const d = new Date(departure)
  const days = Math.round((d - a) / (1000 * 60 * 60 * 24))
  if (days <= 0) return '—'
  const months = Math.floor(days / 30)
  const rem = days % 30
  if (months === 0) return `${days}d`
  if (rem === 0) return `${months}mo`
  return `${months}mo ${rem}d`
}

const SAMPLE_TEACHERS = [
  { id: 'T001', name: 'Sheikh Muhammad Hassan', subject: 'Both',   email: 'sheikh.hassan@cyp.edu',    phone: '+20 100 123 4567', notes: 'Senior teacher, 15 years experience', createdAt: '2025-01-01' },
  { id: 'T002', name: 'Ustadh Khalid Ibrahim',  subject: 'Arabic', email: 'ustadh.khalid@cyp.edu',    phone: '+20 100 234 5678', notes: 'Specialises in Fusha Arabic and grammar', createdAt: '2025-01-01' },
  { id: 'T003', name: 'Sheikh Omar Abdallah',   subject: 'Quran',  email: 'sheikh.omar@cyp.edu',      phone: '+20 100 345 6789', notes: 'Hafidh, specialises in Tajweed', createdAt: '2025-01-01' },
  { id: 'T004', name: 'Ustadha Fatima Al-Azhari', subject: 'Both', email: 'ustadha.fatima@cyp.edu',   phone: '+20 100 456 7890', notes: 'Female students specialist', createdAt: '2025-01-01' },
]

const SAMPLE_STUDENTS = [
  {
    id: 'S001', name: 'Ahmed Al-Rashid',   email: 'ahmed.rashid@email.com',   phone: '+1 313 555 0101',
    hometown: 'Detroit, MI',      nationality: 'American',    dateOfBirth: '2000-03-15', gender: 'Male',
    typeOfStudies: 'Both',        teacherId: 'T001', teacherName: 'Sheikh Muhammad Hassan',
    levelOfStudy: 'Intermediate', arrivalDate: '2025-01-10',  departureDate: '2025-07-10',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 3500, amountPaid: 3500,
    notes: 'Strong Arabic background, focusing on Tajweed improvement.',
    emergencyContact: 'Omar Al-Rashid (Father)', emergencyPhone: '+1 313 555 0102',
    createdAt: '2025-01-01',
  },
  {
    id: 'S002', name: 'Yusuf Abdullah',    email: 'yusuf.a@email.com',         phone: '+44 20 7946 0102',
    hometown: 'London, UK',       nationality: 'British',     dateOfBirth: '1999-07-22', gender: 'Male',
    typeOfStudies: 'Quran',       teacherId: 'T003', teacherName: 'Sheikh Omar Abdallah',
    levelOfStudy: 'Advanced',    arrivalDate: '2025-02-01',  departureDate: '2025-08-01',
    paymentStatus: 'Next Payment Due', nextPaymentDate: '2025-06-01', totalFees: 2800, amountPaid: 1400,
    notes: 'Working towards completing memorisation of the Quran.',
    emergencyContact: 'Ibrahim Abdullah (Father)', emergencyPhone: '+44 20 7946 0103',
    createdAt: '2025-01-15',
  },
  {
    id: 'S003', name: 'Fatima Khan',       email: 'fatima.khan@email.com',     phone: '+1 404 555 0201',
    hometown: 'Atlanta, GA',      nationality: 'American',    dateOfBirth: '2001-11-08', gender: 'Female',
    typeOfStudies: 'Arabic',      teacherId: 'T004', teacherName: 'Ustadha Fatima Al-Azhari',
    levelOfStudy: 'Beginner',    arrivalDate: '2025-03-01',  departureDate: '2025-09-01',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 2500, amountPaid: 2500,
    notes: 'First time in Egypt, highly motivated student.',
    emergencyContact: 'Aisha Khan (Mother)', emergencyPhone: '+1 404 555 0202',
    createdAt: '2025-02-15',
  },
  {
    id: 'S004', name: 'Ibrahim Saleh',     email: 'ibrahim.saleh@email.com',   phone: '+1 312 555 0301',
    hometown: 'Chicago, IL',      nationality: 'American',    dateOfBirth: '1998-05-30', gender: 'Male',
    typeOfStudies: 'Both',        teacherId: 'T002', teacherName: 'Ustadh Khalid Ibrahim',
    levelOfStudy: 'Elementary',  arrivalDate: '2025-04-01',  departureDate: '2025-10-01',
    paymentStatus: 'Payment Needed', nextPaymentDate: '2025-05-15', totalFees: 3200, amountPaid: 0,
    notes: 'Arrived recently, payment still pending.',
    emergencyContact: 'Hassan Saleh (Father)', emergencyPhone: '+1 312 555 0302',
    createdAt: '2025-03-20',
  },
  {
    id: 'S005', name: 'Maryam Hassan',    email: 'maryam.h@email.com',        phone: '+61 2 9876 5432',
    hometown: 'Sydney, Australia', nationality: 'Australian', dateOfBirth: '2002-09-14', gender: 'Female',
    typeOfStudies: 'Quran',       teacherId: 'T004', teacherName: 'Ustadha Fatima Al-Azhari',
    levelOfStudy: 'Intermediate', arrivalDate: '2024-10-01',  departureDate: '2025-04-01',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 2800, amountPaid: 2800,
    notes: 'Completed first 10 juz with excellent Tajweed. Departed on schedule.',
    emergencyContact: 'Ali Hassan (Father)', emergencyPhone: '+61 2 9876 5433',
    createdAt: '2024-09-15',
  },
  {
    id: 'S006', name: 'Omar Farooq',      email: 'omar.farooq@email.com',     phone: '+1 617 555 0401',
    hometown: 'Boston, MA',       nationality: 'American',    dateOfBirth: '2003-01-20', gender: 'Male',
    typeOfStudies: 'Arabic',      teacherId: 'T002', teacherName: 'Ustadh Khalid Ibrahim',
    levelOfStudy: 'Beginner',    arrivalDate: '2025-07-01',  departureDate: '2026-01-01',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 2500, amountPaid: 2500,
    notes: 'Upcoming student. Full deposit paid.',
    emergencyContact: 'Bilal Farooq (Father)', emergencyPhone: '+1 617 555 0402',
    createdAt: '2025-04-01',
  },
  {
    id: 'S007', name: 'Zainab Ali',       email: 'zainab.ali@email.com',      phone: '+1 213 555 0501',
    hometown: 'Los Angeles, CA',  nationality: 'American',    dateOfBirth: '2001-06-25', gender: 'Female',
    typeOfStudies: 'Both',        teacherId: 'T004', teacherName: 'Ustadha Fatima Al-Azhari',
    levelOfStudy: 'Advanced',    arrivalDate: '2025-01-15',  departureDate: '2025-07-15',
    paymentStatus: 'Scholarship', nextPaymentDate: '', totalFees: 3500, amountPaid: 3500,
    notes: 'Scholarship recipient. Exceptional talent in Arabic literature.',
    emergencyContact: 'Muhammad Ali (Father)', emergencyPhone: '+1 213 555 0502',
    createdAt: '2025-01-05',
  },
  {
    id: 'S008', name: 'Tariq Mahmoud',    email: 'tariq.m@email.com',         phone: '+1 416 555 0601',
    hometown: 'Toronto, Canada',  nationality: 'Canadian',    dateOfBirth: '1997-12-03', gender: 'Male',
    typeOfStudies: 'Quran',       teacherId: 'T003', teacherName: 'Sheikh Omar Abdallah',
    levelOfStudy: 'Graduate',    arrivalDate: '2024-09-01',  departureDate: '2025-03-01',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 2800, amountPaid: 2800,
    notes: 'Graduated with honours. Completed full Hifz programme.',
    emergencyContact: 'Khalil Mahmoud (Father)', emergencyPhone: '+1 416 555 0602',
    createdAt: '2024-08-15',
  },
  {
    id: 'S009', name: 'Aisha Osman',      email: 'aisha.o@email.com',         phone: '+1 202 555 0701',
    hometown: 'Washington, DC',   nationality: 'American',    dateOfBirth: '2000-08-12', gender: 'Female',
    typeOfStudies: 'Arabic',      teacherId: 'T004', teacherName: 'Ustadha Fatima Al-Azhari',
    levelOfStudy: 'Intermediate', arrivalDate: '2025-02-15',  departureDate: '2025-08-15',
    paymentStatus: 'Partial',     nextPaymentDate: '2025-05-15', totalFees: 2500, amountPaid: 1250,
    notes: 'On payment plan. Good progress in conversational Arabic.',
    emergencyContact: 'Khalid Osman (Father)', emergencyPhone: '+1 202 555 0702',
    createdAt: '2025-02-01',
  },
  {
    id: 'S010', name: 'Hamza Noor',       email: 'hamza.noor@email.com',      phone: '+61 3 9665 4321',
    hometown: 'Melbourne, Australia', nationality: 'Australian', dateOfBirth: '2002-04-18', gender: 'Male',
    typeOfStudies: 'Both',        teacherId: 'T001', teacherName: 'Sheikh Muhammad Hassan',
    levelOfStudy: 'Intermediate', arrivalDate: '2025-03-10',  departureDate: '2025-09-10',
    paymentStatus: 'Paid in Full', nextPaymentDate: '', totalFees: 3500, amountPaid: 3500,
    notes: 'Second stay — returned after a year break.',
    emergencyContact: 'Abdul Noor (Father)', emergencyPhone: '+61 3 9665 4322',
    createdAt: '2025-03-01',
  },
]

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] }
    case 'UPDATE_STUDENT':
      return { ...state, students: state.students.map(s => s.id === action.payload.id ? action.payload : s) }
    case 'DELETE_STUDENT':
      return { ...state, students: state.students.filter(s => s.id !== action.id) }
    case 'ADD_TEACHER':
      return { ...state, teachers: [...state.teachers, action.payload] }
    case 'UPDATE_TEACHER':
      return { ...state, teachers: state.teachers.map(t => t.id === action.payload.id ? action.payload : t) }
    case 'DELETE_TEACHER':
      return { ...state, teachers: state.teachers.filter(t => t.id !== action.id) }
    case 'IMPORT_DATA':
      return action.payload
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem('cyp-crm-v1')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { students: SAMPLE_STUDENTS, teachers: SAMPLE_TEACHERS }
  })

  const [theme, setTheme] = useState(() => localStorage.getItem('cyp-theme') || 'light')
  const [activePage, setActivePage] = useState('dashboard')

  useEffect(() => {
    localStorage.setItem('cyp-crm-v1', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    localStorage.setItem('cyp-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const addStudent    = (s) => dispatch({ type: 'ADD_STUDENT',    payload: { ...s, id: genId('S'), createdAt: new Date().toISOString().split('T')[0] } })
  const updateStudent = (s) => dispatch({ type: 'UPDATE_STUDENT', payload: s })
  const deleteStudent = (id) => dispatch({ type: 'DELETE_STUDENT', id })
  const addTeacher    = (t) => dispatch({ type: 'ADD_TEACHER',    payload: { ...t, id: genId('T'), createdAt: new Date().toISOString().split('T')[0] } })
  const updateTeacher = (t) => dispatch({ type: 'UPDATE_TEACHER', payload: t })
  const deleteTeacher = (id) => dispatch({ type: 'DELETE_TEACHER', id })

  const exportCSV = () => {
    const headers = ['ID','Name','Email','Phone','Hometown','Nationality','DOB','Gender','Type of Studies','Teacher','Level','Arrival','Departure','Length of Stay','Payment Status','Total Fees','Amount Paid','Balance','Next Payment Due','Emergency Contact','Emergency Phone','Notes']
    const rows = state.students.map(s => [
      s.id, s.name, s.email, s.phone, s.hometown, s.nationality, s.dateOfBirth, s.gender,
      s.typeOfStudies, s.teacherName, s.levelOfStudy, s.arrivalDate, s.departureDate,
      calcLengthOfStay(s.arrivalDate, s.departureDate),
      s.paymentStatus, s.totalFees, s.amountPaid, s.totalFees - s.amountPaid,
      s.nextPaymentDate, s.emergencyContact, s.emergencyPhone, s.notes
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `cyp-students-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportBackup = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }))
    a.download = `cyp-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importBackup = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.students && data.teachers) dispatch({ type: 'IMPORT_DATA', payload: data })
      } catch {}
    }
    reader.readAsText(file)
  }

  const enrichedStudents = state.students.map(s => ({
    ...s,
    status: calcStatus(s.arrivalDate, s.departureDate),
    lengthOfStay: calcLengthOfStay(s.arrivalDate, s.departureDate),
  }))

  return (
    <AppContext.Provider value={{
      students: enrichedStudents,
      rawStudents: state.students,
      teachers: state.teachers,
      theme, setTheme,
      activePage, setActivePage,
      addStudent, updateStudent, deleteStudent,
      addTeacher, updateTeacher, deleteTeacher,
      exportCSV, exportBackup, importBackup,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
