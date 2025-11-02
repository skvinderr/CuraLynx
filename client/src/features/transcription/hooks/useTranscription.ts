import { useState, useRef, useCallback, useEffect } from 'react'
import type { TranscriptEntry } from '../types'
import { detectSpeaker, formatDuration } from '../utils/speaker-detection'

export const useTranscription = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [interimTranscript, setInterimTranscript] = useState('')
  const [sessionDuration, setSessionDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [sessionId] = useState(() => `session_${Date.now()}`)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<any>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream

      // Setup audio context for visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start(2000) // Record in 2-second chunks

      // Setup Web Speech API for real transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()

        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started')
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          let interimText = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transText = event.results[i][0].transcript
            const confidence = event.results[i][0].confidence

            if (event.results[i].isFinal) {
              finalTranscript += transText

              setTranscript((prev) => {
                const previousSpeaker =
                  prev.length > 0 ? prev[prev.length - 1].speaker : undefined

                const newEntry: TranscriptEntry = {
                  id: `entry_${Date.now()}_${Math.random()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  speaker: detectSpeaker(finalTranscript, previousSpeaker),
                  text: finalTranscript.trim(),
                  confidence: confidence || 0.8,
                }

                if (newEntry.text.length > 0) {
                  const updated = [...prev, newEntry]
                  localStorage.setItem(
                    'currentTranscript',
                    JSON.stringify(updated)
                  )
                  return updated
                }
                return prev
              })
            } else {
              interimText += transText
            }
          }

          setInterimTranscript(interimText)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'not-allowed') {
            alert(
              'Microphone access denied. Please allow microphone permissions and try again.'
            )
          }
        }

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended')
          if (isRecording && !isPaused) {
            setTimeout(() => {
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.start()
              }
            }, 100)
          }
        }

        recognitionRef.current.start()
      }

      setIsRecording(true)
      setIsPaused(false)

      // Start timer
      intervalRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Error accessing microphone. Please check permissions.')
    }
  }, [isRecording, isPaused])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }

      setInterimTranscript('')

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop())
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isRecording])

  const togglePause = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        if (recognitionRef.current) {
          recognitionRef.current.start()
        }
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
        setIsPaused(true)
      }
    }
  }, [isPaused])

  const monitorAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      const checkLevel = () => {
        if (analyserRef.current && isRecording && !isPaused) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel((average / 255) * 100)
          requestAnimationFrame(checkLevel)
        }
      }

      checkLevel()
    }
  }, [isRecording, isPaused])

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  useEffect(() => {
    if (isRecording && !isPaused) {
      monitorAudioLevel()
    }
  }, [isRecording, isPaused, monitorAudioLevel])

  return {
    isRecording,
    isPaused,
    transcript,
    interimTranscript,
    sessionDuration,
    audioLevel,
    isProcessing: false,
    sessionId,
    startRecording,
    stopRecording,
    togglePause,
    setTranscript,
    formatDuration,
  }
}
