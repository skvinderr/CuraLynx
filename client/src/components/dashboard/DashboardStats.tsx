export default function DashboardStats({
  totalPatients,
  activeSessions,
  avgConsultationMins,
}: {
  totalPatients: number;
  activeSessions: number;
  avgConsultationMins: number;
}) {
  const items = [
    { label: 'Total Patients Today', value: totalPatients },
    { label: 'Active Sessions', value: activeSessions },
    { label: 'Avg. Consultation (min)', value: avgConsultationMins },
  ];

    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {items.map((i) => (
          <div
            key={i.label}
            className="rounded-md border border-gray-200 bg-white/80 p-3 text-center shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-black/30"
          >
            <div className="text-[11px] text-gray-500">{i.label}</div>
            <div className="mt-0.5 text-xl font-semibold">{i.value}</div>
          </div>
        ))}
      </div>
    );
}
