/**
 * Patient Dashboard Utilities
 */

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(timeString: string): string {
  if (!timeString) return 'TBD'
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function getAppointmentStatus(
  date: string
): 'upcoming' | 'today' | 'past' {
  const appointmentDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  appointmentDate.setHours(0, 0, 0, 0)

  if (appointmentDate > today) return 'upcoming'
  if (appointmentDate.getTime() === today.getTime()) return 'today'
  return 'past'
}

export function isUpcomingAppointment(date: string): boolean {
  const appointmentDate = new Date(date)
  const today = new Date()
  return appointmentDate >= today
}

export function getRefillStatus(refills: number): 'available' | 'limited' | 'none' {
  if (refills > 3) return 'available'
  if (refills > 0) return 'limited'
  return 'none'
}
