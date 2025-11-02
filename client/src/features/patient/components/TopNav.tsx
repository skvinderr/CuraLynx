interface TopNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard Home', icon: '🏥' },
    { id: 'vitals', label: 'My Vitals', icon: '❤️' },
    { id: 'reports', label: 'My Reports', icon: '📋' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
