import { useNavigate } from 'react-router-dom'
import { useTranscription } from '../hooks/useTranscription'
import { TranscriptionControls } from '../components/TranscriptionControls'
import { LiveTranscript } from '../components/LiveTranscript'
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern'
import { cn } from '@/utils'

export function TranscriptionPage() {
  const navigate = useNavigate()
  const {
    isRecording,
    isPaused,
    transcript,
    interimTranscript,
    sessionDuration,
    audioLevel,
    isProcessing,
    sessionId,
    startRecording,
    stopRecording,
    togglePause,
    formatDuration,
  } = useTranscription()

  const handleGenerateNote = () => {
    if (transcript.length > 0) {
      localStorage.setItem('currentTranscript', JSON.stringify(transcript))
      localStorage.setItem(
        'sessionInfo',
        JSON.stringify({
          sessionId,
          duration: sessionDuration,
          timestamp: new Date().toISOString(),
        })
      )
      navigate('/notes')
    } else {
      alert('No transcript available to generate SOAP note.')
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <InteractiveGridPattern
        className={cn(
          'fixed inset-0 h-screen w-screen border-0 select-none',
          '[mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]'
        )}
        squaresClassName="hover:fill-gray-100/40"
        width={60}
        height={42}
        squares={[26, 26]}
      />

      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 mr-4 text-lg"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Real-time Transcription</h1>
                <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                ⏱️ {formatDuration(sessionDuration)}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isRecording
                    ? isPaused
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Stopped'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TranscriptionControls
              isRecording={isRecording}
              isPaused={isPaused}
              sessionDuration={sessionDuration}
              audioLevel={audioLevel}
              onStart={startRecording}
              onStop={stopRecording}
              onTogglePause={togglePause}
              onGenerateNote={handleGenerateNote}
              transcriptCount={transcript.length}
              formatDuration={formatDuration}
            />
          </div>

          <div className="lg:col-span-2">
            <LiveTranscript
              transcript={transcript}
              interimTranscript={interimTranscript}
              isRecording={isRecording}
              isPaused={isPaused}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
