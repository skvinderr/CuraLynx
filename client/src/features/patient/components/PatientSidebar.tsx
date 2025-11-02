import { motion } from 'framer-motion'
import type { PatientProfile } from '../types/index.ts'

interface SidebarProps {
  patient: PatientProfile
}

export function PatientSidebar({ patient }: SidebarProps) {
  const menuItems = [
    { icon: '🏥', label: 'Dashboard Home', active: true },
    { icon: '❤️', label: 'My Vitals' },
    { icon: '📋', label: 'My Reports' },
    { icon: '💊', label: 'Medications' },
    { icon: '📅', label: 'Appointments' },
    { icon: '💬', label: 'Secure Messages' },
    { icon: '🎯', label: 'My Health Goals' },
    { icon: '⚙️', label: 'Profile Settings' },
  ]

  return (
    <div className="w-80 bg-gradient-to-b from-emerald-50 via-emerald-50 to-white border-r border-gray-200 p-8 space-y-8 h-screen overflow-y-auto sticky top-0">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            S
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{patient.name}</h2>
            <p className="text-xs text-gray-500 font-medium">Patient Portal</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Next Appointment</p>
            <p className="text-lg font-bold text-emerald-700 mt-2">
              Follow-up Checkup
            </p>
            <p className="text-xs text-gray-600 mt-1">Dec 1, 2025</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Medications</p>
            <p className="text-lg font-bold text-blue-700 mt-2">{patient.medications.length} Active</p>
            <p className="text-xs text-gray-600 mt-1">All current</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Unread Messages</p>
            <p className="text-lg font-bold text-purple-700 mt-2">
              {patient.messages.filter((m) => !m.read).length} Unread
            </p>
            <p className="text-xs text-gray-600 mt-1">From care team</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent" />

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold text-sm ${
              item.active
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                : 'text-gray-700 hover:bg-emerald-100'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
        >
          📞 Call Care Team
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="w-full px-4 py-3 bg-white text-emerald-600 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all font-semibold text-sm"
        >
          📤 Share Records
        </motion.button>
      </div>
    </div>
  )
}
