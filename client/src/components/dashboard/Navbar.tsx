import logo from "../../assets/curalynx.gif";

export default function Navbar({
  doctorName = "Dr. A. Sharma",
  avatarUrl,
}: {
  doctorName?: string;
  avatarUrl?: string;
}) {
  // Scroll logic removed, Navbar is always visible.

  const initials = doctorName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      // Always visible classes
      className="fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-out transform-gpu opacity-100 translate-y-0"
      aria-hidden={false}
    >
      <div className="px-4 mx-24">
        <div className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/60 px-3 py-2 backdrop-blur-md dark:border-gray-700/50 dark:bg-black/30">

          {/* Left: company logo (as requested) */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="CuralynX" className="h-12 w-auto rounded" />
          </div>

          {/* Right: doctor profile (Name then Avatar) */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{doctorName}</span> {/* Doctor Name on the left */}

            {avatarUrl ? (
              <img src={avatarUrl} alt={doctorName} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              // Doctor Avatar/Initials on the right (the "even further right" element)
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-white">
                {initials}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
