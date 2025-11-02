import ProfileCard from "./ProfileCard";
import { useEffect, useRef, useState } from "react";

export default function Sidebar({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      const threshold = 8; // small threshold to avoid jitter
      if (delta > threshold) {
        // scrolling down -> hide
        setCollapsed(true);
        lastY.current = y;
      } else if (delta < -threshold) {
        // scrolling up -> show
        setCollapsed(false);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-xs flex-col gap-4 border-r border-gray-200 bg-white/60 p-4 backdrop-blur-sm dark:border-gray-700/50 dark:bg-black/20">
      {/* Profile (animated hide/show on scroll) */}
      <div
        className={`transition-all duration-300 ease-out transform-gpu ${collapsed
            ? "opacity-0 -translate-y-3 max-h-0 overflow-hidden pointer-events-none"
            : "opacity-100 translate-y-0 max-h-60"
          }`}
        aria-hidden={collapsed}
      >
        <ProfileCard name="Dr. A. Sharma" specialization="Cardiologist" upcoming={3} onLogout={onLogout} />
      </div>

      {/* Top navigation removed as requested */}

      {/* Footer removed as requested */}
    </aside>
  );
}
