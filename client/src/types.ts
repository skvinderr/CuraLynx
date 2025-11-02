export type PatientStatus = "waiting" | "in-session" | "done";

export type AppointmentType = "Consultation" | "Follow-up" | "Emergency" | "Checkup";

export interface Patient {
  id: string;
  name: string;
  age: number;
  reason: string;
  appointmentType: AppointmentType;
  status: PatientStatus;
  time: string; // ISO string for simplicity
}
