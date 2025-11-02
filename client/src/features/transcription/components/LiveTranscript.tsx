import { motion, AnimatePresence } from 'framer-motion'
import type { TranscriptEntry } from '../types'

interface LiveTranscriptProps {
  transcript: TranscriptEntry[]
  interimTranscript: string
  isRecording: boolean
  isPaused: boolean
  isProcessing: boolean
}

export function LiveTranscript({
  transcript,
  interimTranscript,
  isRecording,
  isPaused,
  isProcessing,
}: LiveTranscriptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center text-sm text-emerald-600"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
              Processing...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">🎤</div>
            <p className="text-lg font-medium mb-2">
              {isRecording
                ? 'Listening... Start speaking to see real-time transcription.'
                : 'Click "Start Recording" to begin transcription session.'}
            </p>
            <p className="text-sm text-center max-w-md">
              CuralynX will automatically detect speakers and transcribe the conversation in
              real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {transcript.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    entry.speaker === 'doctor'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-emerald-50 border-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                          entry.speaker === 'doctor'
                            ? 'bg-blue-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        👤
                      </div>
                      <span
                        className={`text-sm font-semibold capitalize ${
                          entry.speaker === 'doctor'
                            ? 'text-blue-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {entry.speaker}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{entry.timestamp}</span>
                      <span className="ml-2">
                        {Math.round(entry.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{entry.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Interim Transcript Display */}
            {interimTranscript && isRecording && !isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="p-4 rounded-lg border-l-4 border-gray-300 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3 bg-gray-400 text-white">
                      🎤
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Live (Processing...)
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <div className="animate-pulse rounded-full h-2 w-2 bg-red-500 mr-2"></div>
                    <span>Real-time</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">{interimTranscript}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
