export interface TranscriptEntry {
  id: string
  timestamp: string
  speaker: 'doctor' | 'patient'
  text: string
  confidence: number
}

export interface PreFetchedReport {
  id: string
  filename: string
  type: string
  date: string
  tags: string[]
  relevanceScore: number
}

export interface ClinicalContext {
  allTags: string[]
  symptoms: string[]
  conditions: string[]
}
