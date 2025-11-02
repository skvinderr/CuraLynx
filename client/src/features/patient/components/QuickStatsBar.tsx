import { motion } from 'framer-motion'
import type { PatientProfile } from '../types/index.ts'
import { formatDate } from '../utils/index.ts'

interface QuickStatsBarProps {
  patient: PatientProfile
}

export function QuickStatsBar({ patient }: QuickStatsBarProps) {
  const nextAppointment = patient.appointments?.[0]
  const unreadMessages = patient.messages?.filter((m) => !m.read).length || 0

  const stats = [
    {
      label: 'Next Appointment',
      value: nextAppointment ? formatDate(nextAppointment.date) : 'None',
      subtext: nextAppointment ? `${nextAppointment.type}` : 'Schedule one',
      icon: '📅',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Recent BP',
      value: '118 / 76',
      subtext: 'Normal • 3 days ago',
      icon: '❤️',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Active Medications',
      value: patient.medications.length,
      subtext: patient.medications.filter((m) => m.refillsRemaining > 0).length > 0 ? 'All current' : 'Need refills',
      icon: '💊',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      subtext: unreadMessages > 0 ? 'From Care Team' : 'All caught up!',
      icon: '💬',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-4">
            <span className={`text-4xl group-hover:scale-110 transition-transform`}>{stat.icon}</span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.textColor} mt-3`}>{stat.value}</p>
            <p className="text-xs text-gray-600 font-medium mt-2">{stat.subtext}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
