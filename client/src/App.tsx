import { InteractiveGridPattern } from "./components/ui/interactive-grid-pattern";
import { cn } from "./utils/index";
import { Link } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      // Hide card after scrolling more than 80vh (80% of viewport height)
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowCard(false);
      } else {
        setShowCard(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-y-auto">
      {/* Background grid */}
      <InteractiveGridPattern
        className={cn(
          // make sure it covers the entire viewport regardless of content
          "fixed inset-0 h-screen w-screen border-0 select-none",
          // subtle mask to fade at edges
          "[mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]",
        )}
        squaresClassName="hover:fill-gray-400/40"
        width={60}
        height={42}
        squares={[26, 26]}
      />

      {/* Floating Prescription Card - Follows Cursor */}
      <div 
        className={`fixed z-50 w-44 pointer-events-none lg:block transition-all duration-300 ease-out ${
          showCard ? 'opacity-70' : 'opacity-0 invisible'
        }`}
        style={{
          left: `${mousePosition.x + 20}px`,
          top: `${mousePosition.y + 20}px`,
          transform: 'translate(0, 0)',
        }}
      >
        <div className="relative rounded-lg border border-gray-200/50 bg-white/40 p-3 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-300/50">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <h3 className="text-xs font-bold text-gray-900/90">Listening…</h3>
          </div>

          {/* Conversation Flow */}
          <div className="mt-3 space-y-2">
            {/* Doctor Message */}
            <div className="flex items-start gap-1.5 animate-[slideIn_0.5s_ease-out]">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100/80 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-600">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-semibold text-blue-700/90 mb-0.5">Doctor</p>
                <p className="text-[10px] text-gray-800/90 leading-snug">"Mild fever for 3 days."</p>
              </div>
            </div>

            {/* Curalynx Response 1 */}
            <div className="flex items-start gap-1.5 animate-[slideIn_0.7s_ease-out]">
              <div className="flex-shrink-0 w-3 h-5 rounded-full bg-emerald-100/80 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-emerald-600">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                  <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-semibold text-emerald-700/90 mb-0.5">Curalynx</p>
                <div className="bg-emerald-50/60 rounded-md px-2 py-1 border border-emerald-200/40">
                  <p className="text-[10px] text-emerald-900/90 font-medium">Fever (3 days)</p>
                </div>
              </div>
            </div>

            {/* Curalynx Response 2 */}
            <div className="flex items-start gap-1.5 animate-[slideIn_0.9s_ease-out]">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100/80 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-emerald-600">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-semibold text-emerald-700/90 mb-0.5">Curalynx</p>
                <div className="bg-emerald-50/60 rounded-md px-2 py-1 border border-emerald-200/40">
                  <p className="text-[10px] text-emerald-900/90 font-medium">Viral infection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2.5 pt-2 border-t border-gray-300/50">
            <p className="text-[9px] text-gray-600/90 italic flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-emerald-600">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Auto-generated
            </p>
          </div>

          {/* Decorative pulse effect - Sticks to card */}
          {/* <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
          </div> */}
        </div>
      </div>

      {/* Content */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-400/40 bg-white/60 px-3 py-1 text-xs backdrop-blur-sm dark:bg-black/30">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Doctor is now LIVE
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Redefining clinical documentation with AI precision and empathy with CuralynX.
          </h1>
          <p className="mt-4 text-pretty text-base text-gray-600 sm:mt-6 sm:text-lg dark:text-gray-300">
            Curalynx listens, understands, and writes patient notes automatically—so doctors can focus on medicine, not paperwork.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/get-started"
              className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Get Started
            </Link>
            <Link
              to="/learn-more"
              className="rounded-md border border-gray-400/40 bg-white/60 px-5 py-2.5 text-sm font-medium text-gray-900 backdrop-blur-sm transition hover:bg-white/80 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Why we stand out */}
      <section id="why" className="relative z-10 min-h-screen px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Why we stand out
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-700">
            Built for real clinical conversations in India—accurate, natural, and context-aware.
          </p>

          <div className="mt-10 grid gap-20  sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-white/10 bg-gray-100/80 p-5 text-gray-900 shadow-sm backdrop-blur-sm">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/0">
                {/* microphone with people icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-900">
                  <path d="M12 1.5a3 3 0 00-3 3v6a3 3 0 006 0v-6a3 3 0 00-3-3z" />
                  <path d="M5.25 10.5a.75.75 0 01.75.75 6 6 0 0012 0 .75.75 0 011.5 0 7.5 7.5 0 01-6.75 7.464V21h2.25a.75.75 0 010 1.5h-6a.75.75 0 010-1.5H11.25v-2.286A7.5 7.5 0 014.5 11.25a.75.75 0 01.75-.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Listens Naturally</h3>
              <p className="mt-2 text-sm text-gray-700">
                Most transcription tools need users to pause, dictate, or speak robotically. Curalynx captures live doctor–patient conversations in a natural flow, distinguishing speakers and background noise automatically. Doctors can focus entirely on diagnosis and patient interaction instead of worrying about manual entry or voice commands.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-white/10 bg-gray-100/80 p-5 text-gray-900 shadow-sm backdrop-blur-sm">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/0">
                {/* document-text icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-900">
                  <path d="M19.5 2.25h-9A2.25 2.25 0 008.25 4.5v15A2.25 2.25 0 0010.5 21.75h9A2.25 2.25 0 0021.75 19.5v-15A2.25 2.25 0 0019.5 2.25zM6.75 6A.75.75 0 017.5 6.75v10.5a.75.75 0 01-1.5 0V6.75A.75.75 0 016.75 6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Indic Fine-tuned</h3>
              <p className="mt-2 text-sm text-gray-700">
                Our models are fine-tuned on real Indic clinical dialogues — including English, Hindi, and mixed-language conversations. This means the system understands regional accents, medical terms pronounced in Indian ways, and context-specific phrases doctors actually use. The result is smoother, more accurate transcription for Indian healthcare settings.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-white/10 bg-gray-100/80 p-5 text-gray-900 shadow-sm backdrop-blur-sm">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/0">
                {/* brain icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-900">
                  <path fillRule="evenodd" d="M7.5 3.75A3.75 3.75 0 004.5 7.5v4.125a4.125 4.125 0 108.25 0V5.25a1.5 1.5 0 00-3 0v8.25a.75.75 0 11-1.5 0V3.75zM13.25 5.25a1.5 1.5 0 013 0v8.25a.75.75 0 001.5 0V7.5a3.75 3.75 0 10-3.75 3.75V7.5a2.25 2.25 0 112.25 2.25v3.75a4.125 4.125 0 11-3-3.945V5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Understands Context</h3>
              <p className="mt-2 text-sm text-gray-700">
                Instead of just converting speech to text, Curalynx interprets what's being said. The model identifies symptoms, prescriptions, and clinical insights in real time, helping summarize the visit intelligently. This contextual awareness leads to structured, actionable notes rather than raw transcripts — making it genuinely useful for medical professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/60 backdrop-blur-sm dark:bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-2 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">© {new Date().getFullYear()} Team BODMAS</p>
          <div className="mt-3 flex items-center justify-center gap-5 sm:mt-0">
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-300">Privacy</a>
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-300">Terms</a>
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-300">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
