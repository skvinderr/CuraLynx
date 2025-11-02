import { useEffect, useRef, useState } from 'react'
import type { TranscriptEntry } from '@/features/transcription/types'
import {
  initializeAgentState,
  runProactiveAgentLoop,
  executeReportDisplay,
  prefetchReportsForContext,
  type AgentState,
  type PreFetchedReport,
} from '@/services/proactiveReportAgent'

interface UseProactiveReportAgentProps {
  transcript: TranscriptEntry[]
  patientId?: string
  enabled?: boolean
}

interface UseProactiveReportAgentReturn {
  agentState: AgentState
  proactiveSuggestion: PreFetchedReport | null
  handleDoctorIntent: (speech: string) => Promise<PreFetchedReport | null>
  isProcessing: boolean
}

export function useProactiveReportAgent({
  transcript,
  patientId = 'patient_001',
  enabled = true,
}: UseProactiveReportAgentProps): UseProactiveReportAgentReturn {
  const [agentState, setAgentState] = useState<AgentState>(() => initializeAgentState())
  const [proactiveSuggestion, setProactiveSuggestion] = useState<PreFetchedReport | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const lastTranscriptLengthRef = useRef(0)

  // Stage 1: Continuous background loop - runs whenever transcript updates
  useEffect(() => {
    if (!enabled || transcript.length === 0) return

    // Only process if new transcript entries were added
    if (transcript.length <= lastTranscriptLengthRef.current) return

    lastTranscriptLengthRef.current = transcript.length

    // Run agent loop
    const newState = runProactiveAgentLoop(transcript, agentState)
    console.log('🎤 Agent Loop Triggered:', {
      transcriptCount: transcript.length,
      dominantTags: newState.currentDominantTags,
      prefetchedCount: newState.prefetchedReports.length,
      mostLikelyReport: newState.mostLikelyReport?.title,
    })
    setAgentState(newState)

    // Pre-fetch reports based on current clinical context
    if (newState.currentDominantTags.length > 0 && newState.prefetchedReports.length === 0) {
      // Non-blocking pre-fetch in background
      void prefetchReportsForContext(patientId, newState.currentDominantTags).then(reports => {
        console.log('📋 Pre-fetch Complete:', {
          patientId,
          tags: newState.currentDominantTags,
          reportCount: reports.length,
          topReport: reports[0]?.title,
        })
        setAgentState(prev => ({
          ...prev,
          prefetchedReports: reports,
          // Set the most likely report (top ranking)
          mostLikelyReport: reports[0],
        }))
      })
    }
  }, [transcript, enabled, patientId, agentState])

  // Stage 2: Auto-display when most likely report is available
  useEffect(() => {
    if (agentState.mostLikelyReport && !proactiveSuggestion) {
      console.log('✨ Auto-displaying Most Likely Report:', agentState.mostLikelyReport.title)
      setProactiveSuggestion(agentState.mostLikelyReport)
    }
  }, [agentState.mostLikelyReport, proactiveSuggestion])

  // Stage 3: Handle doctor's speech intent
  const handleDoctorIntent = async (speech: string): Promise<PreFetchedReport | null> => {
    setIsProcessing(true)
    try {
      const reportToDisplay = await executeReportDisplay(speech, agentState, patientId)
      if (reportToDisplay) {
        setProactiveSuggestion(reportToDisplay)
      }
      return reportToDisplay
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    agentState,
    proactiveSuggestion,
    handleDoctorIntent,
    isProcessing,
  }
}
