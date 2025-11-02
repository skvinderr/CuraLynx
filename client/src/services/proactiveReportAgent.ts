import type { TranscriptEntry } from '@/features/transcription/types'

// Types for the Proactive Report Agent
export interface ClinicalTag {
  category: 'symptom' | 'condition' | 'medication' | 'test' | 'vital'
  value: string
  confidence: number
}

export interface ContextFrame {
  timestamp: string
  tags: ClinicalTag[]
  dominantContext: string[]
  raw: string
}

export interface PreFetchedReport {
  id: string
  filename: string
  title: string
  type: 'mri' | 'xray' | 'bloodwork' | 'ekg' | 'ct' | 'ultrasound' | 'report'
  date: string
  tags: string[]
  relevanceScore: number
  imagePath?: string
}

export interface AgentState {
  contextFrames: ContextFrame[]
  prefetchedReports: PreFetchedReport[]
  currentDominantTags: string[]
  mostLikelyReport?: PreFetchedReport
  lastIntent?: string
}

// Clinical keyword mappings for context extraction
const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  'headache': ['headache', 'migraine', 'head pain', 'temple pain'],
  'chest_pain': ['chest pain', 'chest discomfort', 'heart pain', 'angina'],
  'blood_pressure': ['blood pressure', 'hypertension', 'bp', 'pressure'],
  'diabetes': ['blood sugar', 'glucose', 'diabetes', 'sugar level'],
  'respiratory': ['cough', 'breathing', 'shortness of breath', 'asthma', 'wheezing'],
  'stomach': ['stomach', 'abdominal', 'nausea', 'vomiting', 'pain'],
  'fever': ['fever', 'temperature', 'chills', 'hot'],
  'allergy': ['allergy', 'allergic', 'itch', 'rash', 'rhinitis'],
}

const TEST_KEYWORDS: Record<string, string[]> = {
  'mri': ['mri', 'magnetic resonance', 'scan', 'imaging'],
  'xray': ['x-ray', 'xray', 'radiograph', 'chest x'],
  'bloodwork': ['blood', 'cbc', 'complete blood count', 'lipid', 'glucose test'],
  'ekg': ['ekg', 'ecg', 'electrocardiogram', 'heart rhythm'],
  'ct': ['ct scan', 'computed tomography', 'cat scan'],
  'ultrasound': ['ultrasound', 'sonogram', 'echo'],
}

const INTENT_KEYWORDS = [
  'show',
  'see',
  'check',
  'look at',
  'pull up',
  'display',
  'get',
  'fetch',
  'retrieve',
  'review',
  'examine',
]

/**
 * Stage 1: Extract clinical context from transcript in real-time
 */
export function extractClinicalContext(transcriptText: string): ClinicalTag[] {
  const tags: ClinicalTag[] = []
  const lowerText = transcriptText.toLowerCase()

  // Extract symptoms
  for (const [symptom, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        const existingTag = tags.find(t => t.value === symptom)
        if (!existingTag) {
          tags.push({
            category: 'symptom',
            value: symptom,
            confidence: 0.85,
          })
        }
      }
    }
  }

  // Extract test types
  for (const [testType, keywords] of Object.entries(TEST_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        const existingTag = tags.find(t => t.value === testType)
        if (!existingTag) {
          tags.push({
            category: 'test',
            value: testType,
            confidence: 0.85,
          })
        }
      }
    }
  }

  return tags
}

/**
 * Stage 1: Build clinical context frame (runs constantly in background)
 */
export function buildContextFrame(transcript: TranscriptEntry[]): ContextFrame {
  const allText = transcript.map(e => e.text).join(' ')
  const tags = extractClinicalContext(allText)

  // Extract dominant context (most mentioned topics)
  const tagCounts: Record<string, number> = {}
  tags.forEach(tag => {
    tagCounts[tag.value] = (tagCounts[tag.value] || 0) + 1
  })

  const dominantContext = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag)

  return {
    timestamp: new Date().toISOString(),
    tags,
    dominantContext,
    raw: allText,
  }
}

/**
 * Stage 1: Autonomously pre-fetch reports based on context
 * This queries the mock EHR database
 */
export async function prefetchReportsForContext(
  _patientId: string,
  clinicalTags: string[],
): Promise<PreFetchedReport[]> {
  // Mock EHR database of patient reports
  // In production, this would query the actual EHR database using patientId
  const mockEHRDatabase: PreFetchedReport[] = [
    {
      id: 'report_789',
      filename: 'report_789_mri_brain.pdf',
      title: 'Brain MRI Scan',
      type: 'mri',
      date: '2025-10-15',
      tags: ['headache', 'migraine', 'brain', 'neuroimaging'],
      relevanceScore: 0,
      imagePath: '/assets/reports/brain_mri.jpg',
    },
    {
      id: 'report_755',
      filename: 'report_755_bp_log.csv',
      title: 'Blood Pressure Log',
      type: 'report',
      date: '2025-11-01',
      tags: ['blood_pressure', 'hypertension', 'vital'],
      relevanceScore: 0,
      imagePath: '/assets/reports/bp_log.jpg',
    },
    {
      id: 'report_722',
      filename: 'report_722_chest_xray.pdf',
      title: 'Chest X-Ray',
      type: 'xray',
      date: '2025-10-20',
      tags: ['chest_pain', 'respiratory', 'heart'],
      relevanceScore: 0,
      imagePath: '/assets/reports/chest_xray.jpg',
    },
    {
      id: 'report_650',
      filename: 'report_650_bloodwork.pdf',
      title: 'Complete Blood Count',
      type: 'bloodwork',
      date: '2025-10-25',
      tags: ['bloodwork', 'diabetes', 'glucose', 'fever'],
      relevanceScore: 0,
      imagePath: '/assets/reports/bloodwork.jpg',
    },
    {
      id: 'report_600',
      filename: 'report_600_ekg.pdf',
      title: 'ECG Report',
      type: 'ekg',
      date: '2025-09-30',
      tags: ['chest_pain', 'heart', 'ekg'],
      relevanceScore: 0,
      imagePath: '/assets/reports/ekg.jpg',
    },
    {
      id: 'report_500',
      filename: 'report_500_ct_abdomen.pdf',
      title: 'CT Scan - Abdomen',
      type: 'ct',
      date: '2025-09-15',
      tags: ['stomach', 'abdominal', 'ct'],
      relevanceScore: 0,
      imagePath: '/assets/reports/ct_abdomen.jpg',
    },
  ]

  // Score each report based on tag matches
  const scoredReports = mockEHRDatabase.map(report => ({
    ...report,
    relevanceScore: calculateRelevanceScore(report.tags, clinicalTags),
  }))

  // Return reports sorted by relevance (highest first)
  return scoredReports
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}

/**
 * Calculate how relevant a report is to current clinical context
 */
function calculateRelevanceScore(reportTags: string[], clinicalTags: string[]): number {
  let score = 0
  const reportTagsLower = reportTags.map(t => t.toLowerCase())
  const clinicalTagsLower = clinicalTags.map(t => t.toLowerCase())

  for (const tag of clinicalTagsLower) {
    for (const reportTag of reportTagsLower) {
      if (reportTag.includes(tag) || tag.includes(reportTag)) {
        score += 1
      }
    }
  }

  return score
}

/**
 * Stage 2: Detect if the doctor is asking for a report
 */
export function detectReportIntent(text: string): boolean {
  const lowerText = text.toLowerCase()
  return INTENT_KEYWORDS.some(keyword => lowerText.includes(keyword))
}

/**
 * Stage 2: Resolve vague requests to specific reports
 * This is the "reasoning" stage
 */
export function resolveReportRequest(
  _doctorRequest: string,
  availableReports: PreFetchedReport[],
  clinicalContext: string[],
): PreFetchedReport | null {
  // If doctor says vague things like "show me the reports", "let's see"
  // Use the clinical context to determine which report they probably mean
  // The actual request text is not needed since we resolve via context

  if (availableReports.length === 0) return null

  // If there's only one relevant report, that's the answer
  if (availableReports.length === 1) {
    return availableReports[0]
  }

  // If multiple reports are relevant, pick the most recent OR most relevant
  // Primary strategy: use clinical context
  const contextBased = availableReports.find(r =>
    clinicalContext.some(tag =>
      r.tags.some(rTag => rTag.toLowerCase().includes(tag.toLowerCase())),
    ),
  )

  if (contextBased) {
    return contextBased
  }

  // Fallback: return most relevant (highest score)
  return availableReports[0]
}

/**
 * Main Agent Loop - Continuous background processing
 */
export function runProactiveAgentLoop(
  transcript: TranscriptEntry[],
  previousState: AgentState,
): AgentState {
  // Stage 1: Build current context frame
  const contextFrame = buildContextFrame(transcript)
  
  console.log('🧠 Context Frame Built:', {
    tags: contextFrame.tags.map(t => t.value),
    dominantContext: contextFrame.dominantContext,
    rawLength: contextFrame.raw.length,
  })

  // Update agent state with new context
  const newState: AgentState = {
    ...previousState,
    contextFrames: [...previousState.contextFrames, contextFrame],
    currentDominantTags: contextFrame.dominantContext,
  }

  return newState
}

/**
 * Execute action on doctor's command
 */
export async function executeReportDisplay(
  doctorSpeech: string,
  agentState: AgentState,
  patientId: string,
): Promise<PreFetchedReport | null> {
  // Stage 2: Perceive - Did the doctor ask for a report?
  if (!detectReportIntent(doctorSpeech)) {
    return null
  }

  // Stage 2: Pre-fetch if not already done
  let reports = agentState.prefetchedReports
  if (reports.length === 0) {
    reports = await prefetchReportsForContext(patientId, agentState.currentDominantTags)
  }

  // Stage 2: Reason - Which report does the doctor want?
  const reportToShow = resolveReportRequest(
    doctorSpeech,
    reports,
    agentState.currentDominantTags,
  )

  return reportToShow || null
}

/**
 * Initialize agent state
 */
export function initializeAgentState(): AgentState {
  return {
    contextFrames: [],
    prefetchedReports: [],
    currentDominantTags: [],
    mostLikelyReport: undefined,
    lastIntent: undefined,
  }
}
