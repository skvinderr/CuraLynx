import { useState } from 'react'
import { motion } from 'framer-motion'
import type { VisitSummary, MedicalReport, ActionItem } from '../types/index.ts'
import { formatDate } from '../utils/index.ts'

interface LatestVisitCardProps {
  visitData: VisitSummary
}

export function LatestVisitCard({ visitData }: LatestVisitCardProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'plan' | 'reports'>('summary')

  const tabs = [
    { id: 'summary', label: 'My Summary' },
    { id: 'plan', label: 'My Action Plan' },
    { id: 'reports', label: 'My Reports' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900">Visit Summary</h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(visitData.date)} • Dr. {visitData.doctorName}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-0 py-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-gray-700 leading-relaxed text-base">{visitData.summary}</p>
            <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
              <p className="text-sm text-emerald-900 font-medium">
                ℹ️ AI-Generated Summary
              </p>
              <p className="text-xs text-emerald-800 mt-1">Based on your doctor's notes</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'plan' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {visitData.actionPlan && visitData.actionPlan.length > 0 ? (
              visitData.actionPlan.map((item: ActionItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="mt-1 w-5 h-5 rounded accent-emerald-500"
                  />
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-base ${
                        item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">📅 Due: {formatDate(item.dueDate)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      item.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No action items assigned yet.</p>
            )}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {visitData.reports && visitData.reports.length > 0 ? (
              visitData.reports.map((report: MedicalReport) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{report.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-600 font-medium">{report.type}</span>
                      <span className="text-xs text-gray-500">📅 {formatDate(report.date)}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                          report.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-700'
                            : report.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm hover:bg-blue-200 transition-colors whitespace-nowrap">
                      Open
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-bold text-sm hover:bg-purple-200 transition-colors flex items-center gap-1 whitespace-nowrap">
                      ✨ Explain
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No reports available yet.</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
