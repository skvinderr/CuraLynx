/* eslint-disable */
// @ts-nocheck
import { Link } from "react-router-dom";
import { Home, LayoutDashboard, Calendar, Check } from "lucide-react";
import curalynxGif from "../assets/curalynx.gif";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={curalynxGif} alt="Curalynx" className="h-10 w-25 scale-180 rounded-lg" />
             
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/todays-session "
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <Calendar className="h-4 w-4" />
                Appointments
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Curalynx</h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Curalynx was built to give doctors their time back.
            Every year, thousands of hours are lost to typing, clicking, and documenting patient visits. 
            Curalynx changes that by turning conversations into clinical notes—automatically and securely.
          </p>
        </div>
      </section>

     
       {/* What Sets Us Apart Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Curalynx we designed the system with one clear goal: let doctors focus on patients—not keyboards. 
              Other solutions do parts of that, but here's what sets us apart:
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {/* Robin Healthcare */}
            <div className="group relative bg-gradient-to-r from-gray-50 to-white border-l-4 border-gray-400 rounded-r-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-x-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-gray-800">Where Robin Healthcare stands</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Robin's device listens in the exam room, records audio/video and uses AI plus human-backed scribes to generate clinical notes.
                  </p>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                    <span>MedCity News</span>
                    <span className="text-xs">+1</span>
                  </a>
                </div>
                <div className="hidden md:block text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  📹
                </div>
              </div>
            </div>

            {/* MyRx */}
            <div className="group relative bg-gradient-to-r from-gray-50 to-white border-l-4 border-gray-400 rounded-r-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-x-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <h3 className="text-xl font-bold text-gray-800">Where MyRx stands</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    MyRx offers digital prescription generation, practice-management tools and a strong focus on e-prescriptions and patient portals.
                  </p>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                    <span>myrx.in</span>
                    <span className="text-xs">+1</span>
                  </a>
                </div>
                <div className="hidden md:block text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  💊
                </div>
              </div>
            </div>

            {/* Curalynx - Featured */}
            <div className="group relative bg-gradient-to-br from-gray-600 via-gray-500 to-gray-600 border-l-4 border-gray-700 rounded-r-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-[fadeIn_1s_ease-in]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-white">Where Curalynx stands</h3>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex items-start gap-3 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-200 rounded-full group-hover/item:scale-150 transition-transform"></div>
                    <p className="text-blue-50 leading-relaxed flex-1">
                      <span className="font-semibold text-white">Ambient listening and transcription</span> built directly into workflow—no extra hardware required and no major changes in how the doctor works.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-200 rounded-full group-hover/item:scale-150 transition-transform"></div>
                    <p className="text-blue-50 leading-relaxed flex-1">
                      <span className="font-semibold text-white">Fully structured, SOAP-format notes</span> (Subjective, Objective, Assessment, Plan) delivered instantly so doctors just review and approve rather than type.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-200 rounded-full group-hover/item:scale-150 transition-transform"></div>
                    <p className="text-blue-50 leading-relaxed flex-1">
                      <span className="font-semibold text-white">Supplemented features:</span> speaker detection, medical-term recognition, integration-friendly backend (React-frontend, Python backend), flexible data structure—so small clinics to large practices can adopt easily.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-200 rounded-full group-hover/item:scale-150 transition-transform"></div>
                    <p className="text-blue-50 leading-relaxed flex-1">
                      <span className="font-semibold text-white">Focus on usability and simplicity:</span> less setup, fewer steps, minimal friction for the doctor.
                    </p>
                  </div>
                </div>

                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                  ⚡
                </div>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5a7a5a] rounded-full blur-3xl opacity-30"></div>
            <div className="relative">
              <h4 className="text-xl font-bold text-gray-900 mb-4">In short:</h4>
              <p className="text-gray-700 leading-relaxed text-lg">
                While Robin automates documentation with hardware in the room and MyRx focuses on prescription-and-practice tools, 
                <span className="font-semibold text-blue-700"> Curalynx combines those ideas into an ambient, lightweight, end-to-end scribe workflow </span>
                purpose-built for speed and ease. We believe this gives doctors back their time—and gives patient care the full attention it deserves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">It Listens</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Curalynx passively listens during consultations. No setup, no "start recording" button—just natural conversation. 
                    All audio is processed locally or through encrypted channels for privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">It Understands</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Using Whisper for speech-to-text and a custom-tuned language model, Curalynx identifies key details—symptoms, vitals, medications, and diagnoses. 
                    It recognizes who's speaking and structures the data accordingly.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">It Writes</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Within seconds, it drafts a SOAP note (Subjective, Objective, Assessment, Plan) that's accurate, well-formatted, and ready for review.
                    The doctor makes quick edits, clicks approve, and moves on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why It Matters</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Check className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Less Burnout</h3>
              </div>
              <p className="text-gray-700">Every 15 minutes saved per patient adds up.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Check className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Better Accuracy</h3>
              </div>
              <p className="text-gray-700">Real-time transcription reduces missed details.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Check className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">More Face-Time</h3>
              </div>
              <p className="text-gray-700">Doctors can focus on listening, not typing.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Check className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Consistent Notes</h3>
              </div>
              <p className="text-gray-700">Structured, standardized documentation for every visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Privacy & Security</h2>
          <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">We take security seriously.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>All recordings are encrypted in transit and at rest.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>No data is shared with third parties.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Models can run on-premise or within secure healthcare environments.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>You stay in control of what's recorded, stored, or deleted.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Who It's For</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinics</h3>
              <p className="text-gray-700">Looking to reduce admin load</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Independent Practitioners</h3>
              <p className="text-gray-700">Without a scribe</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospitals</h3>
              <p className="text-gray-700">Adopting digital transformation</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telehealth Platforms</h3>
              <p className="text-gray-700">Integrating smarter documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">The Vision</h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-4">
            Curalynx isn't just a transcription tool—it's the start of a smarter clinical workflow.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Imagine an assistant that can summarize follow-ups, auto-generate prescriptions, and even spot inconsistencies in treatment plans. 
            That's where we're headed.
          </p>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Us</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be among the first to experience Curalynx.
            Sign up for early access or reach out if you'd like to collaborate.
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/get-started"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              Join Waitlist
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition border border-blue-500"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Curalynx by Team BODMAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
