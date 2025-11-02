import { motion } from 'framer-motion'
import type { Appointment, Medication } from '../types/index.ts'
import { formatDate, formatTime, isUpcomingAppointment, getRefillStatus } from '../utils/index.ts'

interface MedicalSnapshotProps {
  appointments: Appointment[]
  medications: Medication[]
}

export function MedicalSnapshotCard({ appointments, medications }: MedicalSnapshotProps) {
  const upcomingAppointments = appointments.filter((a) => isUpcomingAppointment(a.date)).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Medical Snapshot</h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Appointments Section */}
        <div className="px-8 py-8 border-r border-gray-200 md:border-b-0 border-b">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">📅</span>
            <h3 className="text-lg font-bold text-gray-900">Upcoming Appointments</h3>
          </div>

          <div className="space-y-3 mb-6">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, idx) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-md transition-all"
                >
                  <p className="font-bold text-gray-900 text-base">{appointment.type}</p>
                  <p className="text-sm text-blue-700 font-semibold mt-1">
                    Dr. {appointment.doctorName}
                  </p>
                  <p className="text-xs text-gray-600 font-medium mt-2">
                    {formatDate(appointment.date)} • {formatTime(appointment.time)}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No upcoming appointments</p>
            )}
          </div>

          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all text-sm">
            Schedule New
          </button>
        </div>

        {/* Medications Section */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">💊</span>
            <h3 className="text-lg font-bold text-gray-900">My Medications</h3>
          </div>

          <div className="space-y-3 mb-6">
            {medications.length > 0 ? (
              medications.map((med, idx) => {
                const refillStatus = getRefillStatus(med.refillsRemaining)
                return (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:shadow-md transition-all"
                  >
                    <p className="font-bold text-gray-900 text-base">{med.name}</p>
                    <p className="text-xs text-gray-600 font-medium mt-1">
                      {med.dosage} • {med.frequency}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600 font-semibold">
                        Refills: {med.refillsRemaining}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          refillStatus === 'available'
                            ? 'bg-emerald-200 text-emerald-800'
                            : refillStatus === 'limited'
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {refillStatus}
                      </span>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No active medications</p>
            )}
          </div>

          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all text-sm">
            Request Refill
          </button>
        </div>
      </div>
    </motion.div>
  )
}
