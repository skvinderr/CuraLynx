import { useState } from "react";
import type { Patient } from "@/types";

export default function PatientCard({
  patient,
  onStart,
  onDone,
}: {
  patient: Patient;
  onStart: (id: string) => void;
  onDone: (id: string) => void;
}) {
  // 1. State to track hover status
  const [isHovering, setIsHovering] = useState(false);

  // Determine if the "Start Session" button should be available (only for 'waiting' status)
  const isStartable = patient.status === "waiting";

  const statusClass =
    patient.status === "in-session"
      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      : patient.status === "waiting"
        ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";

  return (
    <div
      // 2. Add mouse event handlers to the main div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700/50 dark:bg-black/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{patient.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{patient.age} y/o</span> • {patient.reason}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}>
          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700/50">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {patient.appointmentType}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {patient.status === "in-session" && (
            <button
              onClick={() => onDone(patient.id)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
            >
              Done
            </button>
          )}

          {/* 3. Conditional rendering and dynamic classes for Start Session */}
          {isStartable && (
            <button
              onClick={() => onStart(patient.id)}
              className={`
                rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-200
                ${isHovering ? "opacity-100 pointer-events-auto hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" : "opacity-0 pointer-events-none"}
              `}
            >
              Start Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
