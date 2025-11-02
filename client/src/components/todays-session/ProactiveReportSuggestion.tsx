import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Brain, Activity, FileText, X } from 'lucide-react'
import type { PreFetchedReport } from '@/services/proactiveReportAgent'

interface ProactiveReportSuggestionProps {
  report: PreFetchedReport | null
  isVisible: boolean
  onDismiss: () => void
  onDisplay: (report: PreFetchedReport) => void
  isProcessing?: boolean
}

const typeIcons: Record<PreFetchedReport['type'], React.ReactNode> = {
  'mri': <Brain className="w-5 h-5" />,
  'xray': <Activity className="w-5 h-5" />,
  'bloodwork': <Activity className="w-5 h-5" />,
  'ekg': <Activity className="w-5 h-5" />,
  'ct': <Brain className="w-5 h-5" />,
  'ultrasound': <Activity className="w-5 h-5" />,
  'report': <FileText className="w-5 h-5" />,
}

const typeColors: Record<PreFetchedReport['type'], string> = {
  'mri': 'from-purple-500 to-pink-500',
  'xray': 'from-blue-500 to-cyan-500',
  'bloodwork': 'from-red-500 to-orange-500',
  'ekg': 'from-green-500 to-emerald-500',
  'ct': 'from-indigo-500 to-purple-500',
  'ultrasound': 'from-yellow-500 to-amber-500',
  'report': 'from-gray-500 to-slate-500',
}

export function ProactiveReportSuggestion({
  report,
  isVisible,
  onDismiss,
  onDisplay,
  isProcessing = false,
}: ProactiveReportSuggestionProps) {
  return (
    <AnimatePresence>
      {isVisible && report && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 w-96 z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${typeColors[report.type]} p-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Proactive Suggestion</p>
                  <p className="text-xs opacity-75">AI detected relevant document</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-gray-600`}>{typeIcons[report.type]}</div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Based on your conversation about{' '}
                  <span className="font-medium text-gray-900">
                    {report.tags.join(', ')}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium">{report.date}</span>
                <span className="text-gray-400">
                  Relevance: {Math.round(report.relevanceScore * 10)}%
                </span>
              </div>

              {/* Image preview if available */}
              {report.imagePath && (
                <div className="rounded-lg overflow-hidden bg-gray-100 h-32 flex items-center justify-center">
                  <img
                    src={report.imagePath}
                    alt={report.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      ;(e.currentTarget.style.display = 'none')
                    }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onDisplay(report)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Display Now
                    </>
                  )}
                </button>
                <button
                  onClick={onDismiss}
                  disabled={isProcessing}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI reasoning explanation */}
            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
              <p className="text-xs text-gray-600">
                ✨ <span className="font-medium">AI Reasoning:</span> Detected "{report.tags[0]}"
                context. This report directly relates to the current conversation.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
