/**
 * Patient Feature - Public Exports
 */

// Pages
export { PatientDashboardPage } from './pages/PatientDashboardPage.tsx'

// Components
export { LatestVisitCard } from './components/LatestVisitCard.tsx'
export { AuraCompanionCard } from './components/AuraCompanionCard.tsx'
export { MedicalSnapshotCard } from './components/MedicalSnapshotCard.tsx'
export { SecureMessagesCard } from './components/SecureMessagesCard.tsx'
export { PatientSidebar } from './components/PatientSidebar.tsx'
export { QuickStatsBar } from './components/QuickStatsBar.tsx'
export { TopNav } from './components/TopNav.tsx'

// Types
export type {
  Appointment,
  Medication,
  MedicalReport,
  ActionItem,
  Message,
  VisitSummary,
  PatientProfile,
} from './types/index.ts'

// Utils
export {
  formatDate,
  formatTime,
  getAppointmentStatus,
  isUpcomingAppointment,
  getRefillStatus,
} from './utils/index.ts'
