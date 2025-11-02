/* eslint-disable */
// @ts-nocheck
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, X, Activity, Users, Clock, TrendingUp, BarChart3, Calendar, DoorOpen, LogOut } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

type AppointmentType = "Consultation" | "Follow-up" | "Emergency" | "Checkup";
type PatientStatus = "waiting" | "in-session" | "done";

interface Patient {
  id: string;
  name: string;
  age: number;
  reason: string;
  appointmentType: AppointmentType;
  status: PatientStatus;
  time: string;
}

const initialPatients: Patient[] = [
  { id: "p1", name: "Rahul Verma", age: 42, reason: "Chest pain", appointmentType: "Consultation", status: "waiting", time: new Date().toISOString() },
  { id: "p2", name: "Neha Gupta", age: 29, reason: "Regular checkup", appointmentType: "Checkup", status: "waiting", time: new Date().toISOString() },
  { id: "p3", name: "Amit Singh", age: 64, reason: "Follow-up ECG", appointmentType: "Follow-up", status: "in-session", time: new Date().toISOString() },
  { id: "p4", name: "Priya Menon", age: 55, reason: "High blood pressure", appointmentType: "Consultation", status: "waiting", time: new Date().toISOString() },
  { id: "p5", name: "Suresh K.", age: 31, reason: "Annual physical", appointmentType: "Checkup", status: "waiting", time: new Date().toISOString() },
  { id: "p6", name: "Deepa Rathi", age: 78, reason: "Post-op check", appointmentType: "Follow-up", status: "done", time: new Date().toISOString() },
  { id: "p7", name: "Vikas Jain", age: 19, reason: "Fever and cough", appointmentType: "Emergency", status: "waiting", time: new Date().toISOString() },
  { id: "p8", name: "Anjali Shah", age: 49, reason: "Diabetic review", appointmentType: "Consultation", status: "waiting", time: new Date().toISOString() },
  { id: "p9", name: "Rajesh T.", age: 60, reason: "Knee pain follow-up", appointmentType: "Follow-up", status: "in-session", time: new Date().toISOString() },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState<PatientStatus | "">("");

  const activeSessions = useMemo(() => patients.filter((p) => p.status === "in-session").length, [patients]);
  const waitingCount = useMemo(() => patients.filter((p) => p.status === "waiting").length, [patients]);
  const completedToday = useMemo(() => patients.filter((p) => p.status === "done").length, [patients]);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const byId = !patientId || p.id.toLowerCase().includes(patientId.toLowerCase()) || p.name.toLowerCase().includes(patientId.toLowerCase());
      const byStatus = !status || p.status === status;
      return byId && byStatus;
    });
  }, [patients, patientId, status]);

  const appointmentTypeData = useMemo(() => {
    const counts = patients.reduce((acc, p) => {
      acc[p.appointmentType] = (acc[p.appointmentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  }, [patients]);

  function addPatient(form: { name: string; age: number; reason: string; appointmentType: AppointmentType }) {
    const np: Patient = {
      id: Math.random().toString(36).slice(2),
      name: form.name,
      age: form.age,
      reason: form.reason,
      appointmentType: form.appointmentType,
      status: "waiting",
      time: new Date().toISOString(),
    };
    setPatients((prev) => [np, ...prev]);
  }

  function onStart(id: string) {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status: "in-session" } : p)));
    navigate(`/todays-session?patientId=${id}`);
  }

  function onDone(id: string) {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status: "done" } : p)));
  }

  function handlePatientClick(patientId: string) {
    navigate(`/patient/dashboard?id=${patientId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100" style={{ background: 'linear-gradient(to bottom right, #f0f4f0, #ffffff, #e8f0e8)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-sage-200 shadow-sm" style={{ borderColor: '#d4e4d4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold" style={{ color: '#5a7a5a' }}>
                  <span className="font-serif">Curalynx</span>
                </div>
                <div className="h-6 w-px bg-sage-300" style={{ backgroundColor: '#b8d4b8' }}></div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dr. A. Sharma</h1>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: '#e8f4e8', borderColor: '#b8d4b8' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#5a7a5a' }}></div>
                <span className="text-sm font-medium" style={{ color: '#4a6a4a' }}>Live</span>
              </div>
              <button
                onClick={() => navigate('/get-started')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(to right, #6a8a6a, #7a9a7a)' }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your appointments and patients</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/todays-session')}
              className="relative flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #5a7a5a 0%, #6a8a6a 25%, #7a9a7a 50%, #6a8a6a 75%, #5a7a5a 100%)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 3s ease infinite'
                }}
              ></div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #4a6a4a 0%, #5a7a5a 25%, #6a8a6a 50%, #5a7a5a 75%, #4a6a4a 100%)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 2s ease infinite'
                }}
              ></div>
              <Activity className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Start Session</span>
            </button>
            <AddPatient onAdd={addPatient} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Patients"
            value={patients.length}
            color="sage"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Active Sessions"
            value={activeSessions}
            color="sage-dark"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Waiting"
            value={waitingCount}
            color="sage-medium"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Completed Today"
            value={completedToday}
            color="sage-light"
          />
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Patient Trends Graph */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: '#5a7a5a' }} />
              <h3 className="text-base font-semibold text-gray-900">Patient Trends</h3>
            </div>
            <PatientTrendGraph />
          </div>

          {/* Patient Distribution Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4" style={{ color: '#5a7a5a' }} />
              <h3 className="text-base font-semibold text-gray-900">Patient Distribution</h3>
            </div>
            <IndiaHeatmap />
          </div>

          {/* Appointment Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#5a7a5a' }} />
              <h3 className="text-base font-semibold text-gray-900">Appointment Types</h3>
            </div>
            <AppointmentTypesGraph appointmentTypeData={appointmentTypeData} totalPatients={patients.length} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6 inline-flex items-center gap-3">
          <div className="relative" style={{ width: '200px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Search by ID/Name"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-transparent outline-none transition-all"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PatientStatus | "")}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-transparent outline-none transition-all"
            style={{ width: '140px' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          >
            <option value="">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="in-session">In Session</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={() => {
              setPatientId("");
              setStatus("");
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            <Filter className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Patients ({filtered.length})</h3>
              </div>
              <div className="overflow-y-auto p-4" style={{ maxHeight: '600px', minHeight: '400px' }}>
                <div className="space-y-3">
                  {filtered.map((p) => (
                    <PatientCard key={p.id} patient={p} onStart={onStart} onDone={onDone} onClick={() => handlePatientClick(p.id)} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No patients match your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Additional Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" style={{ color: '#5a7a5a' }} />
                <h3 className="text-base font-semibold text-gray-900">Today's Schedule</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5a7a5a' }}></div>
                    <span className="text-sm text-gray-600">9:00 AM</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#e8f4e8', color: '#5a7a5a' }}>Consultation</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6a8a6a' }}></div>
                    <span className="text-sm text-gray-600">11:30 AM</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#e8f4e8', color: '#5a7a5a' }}>Follow-up</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7a9a7a' }}></div>
                    <span className="text-sm text-gray-600">2:00 PM</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#e8f4e8', color: '#5a7a5a' }}>Checkup</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8aaa8a' }}></div>
                    <span className="text-sm text-gray-600">4:30 PM</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#e8f4e8', color: '#5a7a5a' }}>Emergency</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4" style={{ color: '#5a7a5a' }} />
                <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Appointment
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  View Calendar
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: '#5a7a5a' }} />
                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600">Patient discharge</p>
                  <p className="text-xs text-gray-400">5 minutes ago</p>
                </div>
                <div className="text-sm border-t border-gray-100 pt-3">
                  <p className="text-gray-600">New lab results</p>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
                <div className="text-sm border-t border-gray-100 pt-3">
                  <p className="text-gray-600">Prescription updated</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

type ColorKey = 'sage' | 'sage-dark' | 'sage-medium' | 'sage-light';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: ColorKey }) {
  const colorClasses: Record<ColorKey, { bg: string }> = {
    sage: { bg: 'linear-gradient(to bottom right, #6a8a6a, #7a9a7a)' },
    "sage-dark": { bg: 'linear-gradient(to bottom right, #5a7a5a, #6a8a6a)' },
    "sage-medium": { bg: 'linear-gradient(to bottom right, #7a9a7a, #8aaa8a)' },
    "sage-light": { bg: 'linear-gradient(to bottom right, #8aaa8a, #9aba9a)' },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: colorClasses[color].bg }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function PatientCard({ patient, onStart, onDone, onClick }: { patient: Patient; onStart: (id: string) => void; onDone: (id: string) => void; onClick: () => void }) {
  const statusConfig = {
    waiting: { label: "Waiting", bg: '#fef9e7', text: '#8a7a4a', border: '#e8d4a4' },
    "in-session": { label: "In Session", bg: '#e8f4e8', text: '#4a6a4a', border: '#b8d4b8' },
    done: { label: "Done", bg: '#f0f0f0', text: '#606060', border: '#d0d0d0' },
  };

  const typeColors = {
    Consultation: { bg: '#e8f4e8', text: '#5a7a5a', border: '#b8d4b8' },
    "Follow-up": { bg: '#f0f4f0', text: '#6a6a6a', border: '#d0d4d0' },
    Emergency: { bg: '#fee8e8', text: '#8a5a5a', border: '#e8b8b8' },
    Checkup: { bg: '#e8f0e8', text: '#4a6a4a', border: '#b8d4b8' },
  };

  const status = statusConfig[patient.status];
  const typeColor = typeColors[patient.appointmentType];

  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
            <span className="text-sm text-gray-500">({patient.age} yrs)</span>
          </div>
          <p className="text-sm text-gray-600">{patient.reason}</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-medium border"
          style={{ backgroundColor: status.bg, color: status.text, borderColor: status.border }}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-md text-xs font-medium border"
          style={{ backgroundColor: typeColor.bg, color: typeColor.text, borderColor: typeColor.border }}
        >
          {patient.appointmentType}
        </span>

        <div className="flex gap-2">
          {patient.status === "waiting" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart(patient.id);
              }}
              className="px-3 py-1.5 text-white rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: '#6a8a6a' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a7a5a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6a8a6a'}
            >
              Start
            </button>
          )}
          {patient.status === "in-session" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDone(patient.id);
              }}
              className="px-3 py-1.5 text-white rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: '#6a8a6a' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a7a5a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6a8a6a'}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientTrendGraph() {
  // Dummy data for the last 7 days
  const data = [
    { day: 'Mon', patients: 12 },
    { day: 'Tue', patients: 15 },
    { day: 'Wed', patients: 9 },
    { day: 'Thu', patients: 18 },
    { day: 'Fri', patients: 14 },
    { day: 'Sat', patients: 8 },
    { day: 'Sun', patients: 6 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1.5 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-900">{payload[0].payload.day}</p>
          <p className="text-xs" style={{ color: '#5a7a5a' }}>
            {payload[0].value} patients
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6a8a6a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6a8a6a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#9ca3af"
            style={{ fontSize: '10px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '10px' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="patients"
            stroke="#5a7a5a"
            strokeWidth={2.5}
            fill="url(#colorPatients)"
            activeDot={{ r: 5, fill: '#5a7a5a', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Peak</div>
          <div className="text-sm font-semibold text-gray-900">Thu</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg</div>
          <div className="text-sm font-semibold text-gray-900">
            {Math.round(data.reduce((sum, d) => sum + d.patients, 0) / data.length)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationTimeGraph() {
  const data = [
    { time: '0-10', count: 8 },
    { time: '10-20', count: 22 },
    { time: '20-30', count: 15 },
    { time: '30-40', count: 10 },
    { time: '40+', count: 5 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1.5 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-900">{payload[0].payload.time} min</p>
          <p className="text-xs" style={{ color: '#5a7a5a' }}>
            {payload[0].value} sessions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7a9a7a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7a9a7a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            style={{ fontSize: '10px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '10px' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6a8a6a"
            strokeWidth={2.5}
            fill="url(#colorTime)"
            activeDot={{ r: 5, fill: '#6a8a6a', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Most Common</div>
          <div className="text-sm font-semibold text-gray-900">10-20m</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg Time</div>
          <div className="text-sm font-semibold text-gray-900">18m</div>
        </div>
      </div>
    </div>
  );
}

function IndiaHeatmap() {
  // Real India GeoJSON URL
  const geoUrl = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

  // Major cities with patient data
  const cities = [
    { name: "Delhi", coordinates: [77.2090, 28.6139], patients: 145 },
    { name: "Mumbai", coordinates: [72.8777, 19.0760], patients: 198 },
    { name: "Bangalore", coordinates: [77.5946, 12.9716], patients: 176 },
    { name: "Kolkata", coordinates: [88.3639, 22.5726], patients: 112 },
    { name: "Chennai", coordinates: [80.2707, 13.0827], patients: 134 },
    { name: "Hyderabad", coordinates: [78.4867, 17.3850], patients: 89 },
    { name: "Pune", coordinates: [73.8567, 18.5204], patients: 78 },
    { name: "Ahmedabad", coordinates: [72.5714, 23.0225], patients: 67 },
  ];

  const maxPatients = Math.max(...cities.map(c => c.patients));

  // Function to calculate circle radius and color based on patient count
  const getCircleProps = (patients: number) => {
    const normalizedSize = (patients / maxPatients);
    return {
      radius: 2 + normalizedSize * 6,
      opacity: 0.4 + normalizedSize * 0.6,
      color: normalizedSize > 0.7 ? '#4a6a4a' : normalizedSize > 0.4 ? '#5a7a5a' : '#6a8a6a'
    };
  };

  return (
    <div>
      {/* Map */}
      <div className="relative" style={{ width: '100%', height: '100%' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 400,
            center: [82, 23]
          }}
          width={300}
          height={120}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e8f0e8"
                  stroke="#b8d4b8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#d4e4d4' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Circular heatmap markers */}
          {cities.map(({ name, coordinates, patients }) => {
            const { radius, opacity, color } = getCircleProps(patients);
            return (
              <Marker key={name} coordinates={coordinates}>
                <circle
                  r={radius}
                  fill={color}
                  opacity={opacity}
                  stroke="#fff"
                  strokeWidth={0.5}
                >
                  <title>{name}: {patients} patients</title>
                </circle>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>



    </div>
  );
}

function AppointmentTypesGraph({ appointmentTypeData, totalPatients }: { appointmentTypeData: Record<string, number>; totalPatients: number }) {
  const data = Object.entries(appointmentTypeData).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: Math.round((count / totalPatients) * 100)
  }));

  const COLORS = ['#5a7a5a', '#6a8a6a', '#7a9a7a', '#8aaa8a'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1.5 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-xs" style={{ color: '#5a7a5a' }}>
            {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTypes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5a7a5a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#5a7a5a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '9px' }}
            tickLine={false}
            angle={-15}
            textAnchor="end"
            height={35}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '10px' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#5a7a5a"
            strokeWidth={2.5}
            fill="url(#colorTypes)"
            activeDot={{ r: 5, fill: '#5a7a5a', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Total Types</div>
          <div className="text-sm font-semibold text-gray-900">{Object.keys(appointmentTypeData).length}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-sm font-semibold text-gray-900">{totalPatients}</div>
        </div>
      </div>
    </div>
  );
}

function AddPatient({ onAdd }: { onAdd: (p: { name: string; age: number; reason: string; appointmentType: AppointmentType }) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("Consultation");

  function submit() {
    if (!name || !age || !reason) return;
    onAdd({ name, age: Number(age), reason, appointmentType });
    setOpen(false);
    setName("");
    setAge("");
    setReason("");
    setAppointmentType("Consultation");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
        style={{ background: 'linear-gradient(to right, #6a8a6a, #7a9a7a)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #5a7a5a, #6a8a6a)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #6a8a6a, #7a9a7a)'}
      >
        <Plus className="w-4 h-4" />
        Add Patient
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Add New Patient</h3>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patient name"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-transparent outline-none"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              type="number"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-transparent outline-none"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for visit"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-transparent outline-none"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-transparent outline-none"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #7a9a7a'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
              <option value="Checkup">Checkup</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={submit}
              className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-all"
              style={{ background: 'linear-gradient(to right, #6a8a6a, #7a9a7a)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #5a7a5a, #6a8a6a)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #6a8a6a, #7a9a7a)'}
            >
              Add Patient
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
