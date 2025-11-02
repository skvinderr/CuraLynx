export default function ProfileCard({
  name,
  specialization,
  upcoming,
  onLogout,
}: {
  name: string;
  specialization: string;
  upcoming: number;
  onLogout: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-black/30">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold dark:bg-white/10">
          {name.split(' ').map((n) => n[0]).slice(0,2).join('')}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{specialization}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">Upcoming</span>
        <span className="font-semibold">{upcoming}</span>
      </div>
      <button
        onClick={onLogout}
        className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
      >
        Logout
      </button>
    </div>
  );
}
