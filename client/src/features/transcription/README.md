# CuralynX - Real-Time Transcription Feature

## Overview

This transcription module is the core of CuralynX, an AI-powered ambient scribe that automatically transcribes doctor-patient conversations and generates SOAP notes.

## Architecture

```
features/transcription/
├── components/         # UI Components
│   ├── TranscriptionControls.tsx    # Recording controls (Start/Stop/Pause)
│   └── LiveTranscript.tsx           # Real-time transcript display
├── hooks/             # Custom React hooks
│   └── useTranscription.ts          # Transcription logic & state management
├── utils/             # Utilities
│   └── speaker-detection.ts         # AI speaker detection logic
├── pages/             # Page-level components
│   └── TranscriptionPage.tsx        # Full transcription page
├── types.ts           # TypeScript interfaces
└── index.ts           # Public exports
```

## Components

### TranscriptionPage
Main page component that orchestrates the transcription interface.

**Features:**
- Real-time audio recording with visualization
- Automatic speaker detection (doctor/patient)
- Live transcript display
- Session management and timing
- SOAP note generation trigger

### TranscriptionControls
Sidebar component with recording controls and session statistics.

**Props:**
```tsx
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
```

### LiveTranscript
Main content area showing real-time transcription with speaker and confidence indicators.

## Hooks

### useTranscription
Core hook managing all transcription logic.

**Returns:**
```tsx
{
  isRecording: boolean
  isPaused: boolean
  transcript: TranscriptEntry[]
  interimTranscript: string
  sessionDuration: number
  audioLevel: number
  isProcessing: boolean
  sessionId: string
  startRecording: () => Promise<void>
  stopRecording: () => void
  togglePause: () => void
  setTranscript: (entries: TranscriptEntry[]) => void
  formatDuration: (seconds: number) => string
}
```

## Utilities

### Speaker Detection Algorithm

The `detectSpeaker` function uses a pattern-matching AI approach to determine whether speaker input is from a doctor or patient.

**Doctor Patterns:**
- Medical terminology (diagnosis, prescription, blood pressure, etc.)
- Professional language ("I recommend", "we should", "follow up")
- Examination commands ("take a deep breath", "open your mouth")
- Question structures typical of clinical assessments

**Patient Patterns:**
- Personal experiences ("I feel", "I have", "I've been")
- Symptom descriptions ("sharp pain", "dull ache", "numbness")
- Personal context ("at work", "my family", "I work")
- Personal questions ("what does this mean", "will I be okay")

**Scoring System:**
1. Count pattern matches for both speaker types
2. Apply multipliers for medical terminology (doctors +2) and personal pronouns (patients +1.5)
3. Analyze question structure
4. Consider text length
5. Use previous speaker context for flow analysis
6. Fallback to alternating speakers or personal pronouns

## Types

```tsx
interface TranscriptEntry {
  id: string
  timestamp: string
  speaker: 'doctor' | 'patient'
  text: string
  confidence: number
}

interface PreFetchedReport {
  id: string
  filename: string
  type: string
  date: string
  tags: string[]
  relevanceScore: number
}

interface ClinicalContext {
  allTags: string[]
  symptoms: string[]
  conditions: string[]
}
```

## Web APIs Used

### Web Speech API
- Real-time speech-to-text transcription
- Continuous recognition mode
- Interim results for live updates
- Automatic language detection and restoration

### Web Audio API
- Audio context for frequency analysis
- Real-time audio level visualization
- Stream processing for live monitoring

### Media Recorder API
- Audio stream recording
- 2-second chunks for processing
- Pause/resume capability

## Integration Points

### localStorage
- Persists current transcript
- Maintains session metadata
- Enables recovery from interrupted sessions

### SOAP Note Generation
- Transcript data passed to `/notes` route
- Session metadata preserved
- Manual review before finalization

## Error Handling

- Graceful fallback when Speech Recognition unavailable
- Microphone permission denial detection
- Browser compatibility checking
- Automatic recognition restart on connection loss

## Performance Considerations

1. **Audio Processing**: Uses requestAnimationFrame for smooth visualization
2. **Transcript Rendering**: AnimatePresence for efficient list updates
3. **State Updates**: Batched updates to prevent re-renders
4. **Memory**: localStorage used instead of state for large datasets

## Future Enhancements

1. **Multi-language Support**: Extend language detection beyond en-US
2. **Custom Speaker Names**: Allow users to set specific speaker IDs
3. **Real-time SOAP Generation**: Generate SOAP note as conversation progresses
4. **Speaker Separation**: Distinguish between multiple doctors or patients
5. **Audio Quality Metrics**: Advanced noise analysis and quality scoring
6. **Export Options**: Multiple format support (PDF, DOCX, JSON)

## Browser Support

- Chrome/Edge 25+ (full support)
- Firefox 25+ (full support)
- Safari 11+ (with webkit prefix)
- Opera 12+ (full support)

## Theme Integration

Uses Tailwind CSS with the project's color scheme:
- **Primary**: Emerald (recording, patient)
- **Secondary**: Blue (doctor)
- **Accent**: Purple (actions)
- **Status**: Red (recording), Amber (paused), Gray (stopped)
