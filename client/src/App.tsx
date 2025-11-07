import { InteractiveGridPattern } from "./components/ui/interactive-grid-pattern";
import { cn } from "./utils/index";
import { Link } from "react-router-dom";
import { Mic, FileText, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import "./App.css";

export default function App() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background grid */}
      <InteractiveGridPattern
        className={cn(
          "pointer-events-none fixed inset-0 h-screen w-screen border-0 select-none",
          "[mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]",
        )}
        squaresClassName="hover:fill-gray-400/40"
        width={60}
        height={42}
        squares={[26, 26]}
      />

      {/* HEADER */}
      <header className="relative z-20 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold" style={{ color: '#5a7a5a' }}>
              <span className="font-serif">CuraLynx</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-[#5a7a5a] transition-colors">
              Dashboard
            </Link>
            <Link to="/todays-session" className="text-sm font-medium text-gray-700 hover:text-[#5a7a5a] transition-colors">
              Live Demo
            </Link>
            <Link 
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
              style={{ background: 'linear-gradient(to right, #5a7a5a, #7a9a7a)' }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-6 pt-16 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8d4b8] bg-white/70 px-3 py-1 text-xs backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#5a7a5a' }} />
              Built for clinical conversations
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Clinical documentation, automated with precision
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Curalynx listens to real consultations and turns them into structured notes, recommendations, and prescriptions—so you focus on care, not clerical work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/get-started"
                className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition"
                style={{ background: 'linear-gradient(to right, #5a7a5a, #7a9a7a)' }}
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/todays-session"
                className="inline-flex items-center gap-2 rounded-lg border border-[#b8d4b8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2f3f2f] backdrop-blur-sm hover:bg-white"
              >
                View live demo
              </Link>
            </div>

            {/* Social proof / stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <div className="text-3xl font-bold text-gray-900">~30%</div>
                <p className="text-sm text-gray-600">Less time on paperwork</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <p className="text-sm text-gray-600">Languages supported</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <p className="text-sm text-gray-600">Data ownership</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-[#b8d4b8] bg-white/70 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-[#b8d4b8]/60">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#5a7a5a' }} />
                <p className="text-sm font-semibold" style={{ color: '#5a7a5a' }}>Real‑time understanding</p>
              </div>
              <div className="mt-4 grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#e8f4e8] flex items-center justify-center">
                    <Mic className="h-4 w-4" style={{ color: '#5a7a5a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Natural, live transcription</p>
                    <p className="text-sm text-gray-600">Built for real doctor–patient conversations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#e8f4e8] flex items-center justify-center">
                    <FileText className="h-4 w-4" style={{ color: '#5a7a5a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Structured notes & prescriptions</p>
                    <p className="text-sm text-gray-600">Actionable outputs, not raw text blobs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#e8f4e8] flex items-center justify-center">
                    <Shield className="h-4 w-4" style={{ color: '#5a7a5a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Privacy‑first by design</p>
                    <p className="text-sm text-gray-600">Your data stays yours—secure and compliant.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">Everything you need, built‑in</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-700">
            From transcription to recommendations and workflows, Curalynx is an end‑to‑end assistant for clinical documentation.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Real‑time transcription',
                desc: 'Accurate, robust speech recognition tuned for clinical settings.',
                icon: <Mic className="h-4 w-4" style={{ color: '#5a7a5a' }} />, 
              },
              {
                title: 'AI recommendations',
                desc: 'Medication and test suggestions based on the conversation.',
                icon: <CheckCircle2 className="h-4 w-4" style={{ color: '#5a7a5a' }} />,
              },
              {
                title: 'Prescription builder',
                desc: 'Generate structured prescriptions with one click.',
                icon: <FileText className="h-4 w-4" style={{ color: '#5a7a5a' }} />, 
              },
              {
                title: 'Workflow automation',
                desc: 'Parse plans and execute clinical workflows safely.',
                icon: <CheckCircle2 className="h-4 w-4" style={{ color: '#5a7a5a' }} />, 
              },
              {
                title: 'Privacy & security',
                desc: 'Security‑first architecture with clear data ownership.',
                icon: <Shield className="h-4 w-4" style={{ color: '#5a7a5a' }} />, 
              },
              {
                title: 'Built for India',
                desc: 'Understands multi‑lingual, code‑mixed clinical conversations.',
                icon: <CheckCircle2 className="h-4 w-4" style={{ color: '#5a7a5a' }} />, 
              },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-[#b8d4b8] bg-white/70 p-5 shadow-sm backdrop-blur-sm">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: '#e8f4e8' }}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {["Start a session", "Speak naturally", "Approve and export"].map((step, idx) => (
              <div key={idx} className="rounded-xl border border-[#b8d4b8] bg-white/70 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#6a8a6a' }}>
                  {idx + 1}
                </div>
                <p className="text-sm font-semibold text-gray-900">{step}</p>
                <p className="mt-2 text-sm text-gray-700">
                  {idx === 0 && 'Open a live consultation and Curalynx starts listening instantly.'}
                  {idx === 1 && 'Continue your normal flow—Curalynx captures and understands context.'}
                  {idx === 2 && 'Review AI‑generated notes and prescriptions, then export or share.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">Trusted by clinicians</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: 'Cuts my documentation time dramatically while improving structure and clarity.',
                author: 'Cardiologist, Delhi',
              },
              {
                quote: 'Understands code‑mixed conversations remarkably well during busy OPD hours.',
                author: 'General Physician, Mumbai',
              },
              {
                quote: 'The recommendations are sensible and save me multiple clicks per patient.',
                author: 'Endocrinologist, Bengaluru',
              },
            ].map((t, i) => (
              <div key={i} className="rounded-xl border border-[#b8d4b8] bg-white/70 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-sm text-gray-900">“{t.quote}”</p>
                <p className="mt-3 text-xs font-medium text-gray-600">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">Simple pricing</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-700">Choose a plan that fits your practice.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Starter', price: 'Free', cta: 'Get started', features: ['Live transcription', 'Basic notes', 'Single user'] },
              { name: 'Pro', price: '₹999/mo', cta: 'Start trial', features: ['Recommendations', 'Prescription builder', 'Priority support'] },
              { name: 'Enterprise', price: 'Talk to us', cta: 'Contact sales', features: ['Custom workflows', 'On‑prem options', 'Advanced security'] },
            ].map((p, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-[#b8d4b8] bg-white/70 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900">{p.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" style={{ color: '#5a7a5a' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={i === 2 ? '/learn-more' : '/get-started'}
                  className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(to right, #5a7a5a, #7a9a7a)' }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-gray-900 sm:text-4xl">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-[#b8d4b8] rounded-xl border border-[#b8d4b8] bg-white/70 backdrop-blur-sm">
            {[
              {
                q: 'Is patient data secure?',
                a: 'Yes. We follow a privacy‑first approach and ensure data remains under your control. We can support on‑prem or VPC deployments for enterprises.',
              },
              {
                q: 'Does it work with code‑mixed speech?',
                a: 'Yes. Curalynx is tuned for clinical conversations across English, Hindi, and typical code‑mixed usage common in Indian settings.',
              },
              {
                q: 'Can I export notes into my system?',
                a: 'You can export structured notes and prescriptions and integrate with your EMR via APIs.',
              },
            ].map((item, i) => (
              <div key={i} className="p-5">
                <p className="text-sm font-semibold text-gray-900">{item.q}</p>
                <p className="mt-2 text-sm text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#b8d4b8] bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
          <h3 className="text-2xl font-semibold text-gray-900">Ready to try Curalynx?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-700">Start a live session or explore the product with sample data.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(to right, #5a7a5a, #7a9a7a)' }}
            >
              Get started
            </Link>
            <Link
              to="/learn-more"
              className="inline-flex items-center gap-2 rounded-lg border border-[#b8d4b8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2f3f2f]"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="relative z-10 border-t border-[#b8d4b8] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-3 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">© {new Date().getFullYear()} Curalynx</p>
          <div className="mt-3 flex items-center justify-center gap-5 sm:mt-0">
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline">Privacy</a>
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline">Terms</a>
            <a href="#" className="text-sm text-gray-600 underline-offset-4 hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
