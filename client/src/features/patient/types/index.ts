/**
 * Patient Feature Types
 * Defines all TypeScript interfaces for patient-related data
 */

export interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  type: string
  location?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedDate: string
  expirationDate: string
  refillsRemaining: number
}

export interface MedicalReport {
  id: string
  name: string
  type: string
  date: string
  url?: string
  status: 'pending' | 'ready' | 'reviewed'
}

export interface ActionItem {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  read: boolean
  type: 'incoming' | 'outgoing'
}

export interface VisitSummary {
  id: string
  date: string
  doctorName: string
  summary: string
  actionPlan: ActionItem[]
  reports: MedicalReport[]
}

export interface PatientProfile {
  id: string
  name: string
  email: string
  dateOfBirth: string
  phone: string
  avatar?: string
  lastVisit?: VisitSummary
  medications: Medication[]
  appointments: Appointment[]
  messages: Message[]
}
