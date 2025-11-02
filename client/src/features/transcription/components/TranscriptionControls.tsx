import { motion } from 'framer-motion'

interface TranscriptionControlsProps {
  isRecording: boolean
  isPaused: boolean
  sessionDuration: number
  audioLevel: number
  onStart: () => void
  onStop: () => void
  onTogglePause: () => void
  onGenerateNote: () => void
  transcriptCount: number
  formatDuration: (seconds: number) => string
}

export function TranscriptionControls({
  isRecording,
  isPaused,
  sessionDuration,
  audioLevel,
  onStart,
  onStop,
  onTogglePause,
  onGenerateNote,
  transcriptCount,
  formatDuration,
}: TranscriptionControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recording Controls</h3>

      <div className="space-y-4">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            🎤 Start Recording
          </motion.button>
        ) : (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTogglePause}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isPaused
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
              }`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStop}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              ⏹️ Stop Recording
            </motion.button>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateNote}
          disabled={transcriptCount === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          📄 Generate SOAP Note
        </motion.button>
      </div>

      {/* Audio Level Meter */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Audio Level</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full transition-all duration-300 ${
                audioLevel > 70 ? 'bg-red-500' : audioLevel > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${audioLevel}%` }}
              animate={{
                scale: audioLevel > 50 ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: audioLevel > 50 ? Infinity : 0,
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Session Stats */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Session Statistics</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{formatDuration(sessionDuration)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entries:</span>
            <span className="font-medium">{transcriptCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium">
              {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Stopped'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
