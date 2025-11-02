export const detectSpeaker = (
  text: string,
  previousSpeaker?: 'doctor' | 'patient'
): 'doctor' | 'patient' => {
  const lowerText = text.toLowerCase()

  // Enhanced doctor phrases/patterns with medical terminology
  const doctorPatterns = [
    // Questions and examinations
    'can you',
    'how long',
    'any pain',
    'let me',
    'show me',
    'describe the',
    'rate your pain',
    'when did',
    'have you ever',
    'family history',
    'take a deep breath',
    'open your mouth',

    // Medical decisions and advice
    "i recommend",
    'we need to',
    "i'd like to",
    'i want to',
    'we should',
    'you should',
    'prescription',
    'medication',
    'treatment',
    'therapy',
    'surgery',

    // Medical terminology
    'diagnosis',
    'prognosis',
    'examination',
    'symptoms',
    'condition',
    'disease',
    'blood pressure',
    'heart rate',
    'temperature',
    'pulse',
    'blood test',
    'x-ray',
    'mri',
    'ct scan',
    'ultrasound',
    'lab results',
    'vital signs',

    // Professional language
    'based on your',
    'according to',
    'medical history',
    'clinical',
    'patient',
    'follow up',
    'appointment',
    'referral',
    'specialist',
  ]

  // Enhanced patient phrases with personal experiences
  const patientPatterns = [
    // Personal experiences and feelings
    'i feel',
    "i'm feeling",
    'it hurts',
    'i have',
    "i've been",
    "i've had",
    'my pain',
    'my symptoms',
    "i can't",
    "i couldn't",
    "i'm unable",
    'it started',
    'since yesterday',
    'for the past',
    "i'm worried",
    "i'm concerned",

    // Pain and symptom descriptions
    'sharp pain',
    'dull pain',
    'burning',
    'tingling',
    'numbness',
    'swelling',
    'headache',
    'nausea',
    'dizzy',
    'tired',
    'weak',
    'sore',
    'ache',

    // Personal context
    'at home',
    'at work',
    'when i',
    'i noticed',
    'i think',
    'i believe',
    'my family',
    'my job',
    'i work',
    'i live',
    'i usually',

    // Questions about condition
    'what does this mean',
    'is this serious',
    'will i be okay',
    'how long',
    'what should i do',
    'can i',
    'is it normal',
    'what causes',
  ]

  // Calculate pattern scores
  const doctorScore = doctorPatterns.reduce(
    (score, pattern) => (lowerText.includes(pattern) ? score + 1 : score),
    0
  )

  const patientScore = patientPatterns.reduce(
    (score, pattern) => (lowerText.includes(pattern) ? score + 1 : score),
    0
  )

  // Enhanced scoring with length and context considerations
  let adjustedDoctorScore = doctorScore
  let adjustedPatientScore = patientScore

  // Medical terminology bonus for doctors
  const medicalTerms = [
    'diagnosis',
    'prescription',
    'medication',
    'blood pressure',
    'heart rate',
  ]
  const medicalTermBonus = medicalTerms.reduce(
    (bonus, term) => (lowerText.includes(term) ? bonus + 2 : bonus),
    0
  )
  adjustedDoctorScore += medicalTermBonus

  // Personal pronouns bonus for patients
  const personalPronouns = ['i feel', 'i have', "i'm", 'my', 'me']
  const personalBonus = personalPronouns.reduce(
    (bonus, pronoun) => (lowerText.includes(pronoun) ? bonus + 1.5 : bonus),
    0
  )
  adjustedPatientScore += personalBonus

  // Question pattern analysis
  if (lowerText.includes('?')) {
    if (
      lowerText.match(
        /^(how|when|where|what|why|can you|have you|do you|are you)/
      )
    ) {
      adjustedDoctorScore += 2 // Doctor asking questions
    } else if (lowerText.match(/(what does|is this|will i|should i|can i)/)) {
      adjustedPatientScore += 2 // Patient asking about their condition
    }
  }

  // Length consideration (doctors often give longer explanations)
  if (text.length > 100) {
    adjustedDoctorScore += 1
  }

  // Context-based adjustment using previous speaker
  if (previousSpeaker) {
    // If scores are close, consider conversation flow
    if (Math.abs(adjustedDoctorScore - adjustedPatientScore) <= 1) {
      // Slight bias toward alternating speakers in conversation
      if (previousSpeaker === 'doctor') {
        adjustedPatientScore += 0.5
      } else {
        adjustedDoctorScore += 0.5
      }
    }
  }

  console.log(`Speaker Detection Analysis:
    Text: "${text.substring(0, 50)}..."
    Doctor Score: ${adjustedDoctorScore}
    Patient Score: ${adjustedPatientScore}
    Previous: ${previousSpeaker || 'none'}
  `)

  // Determine speaker based on adjusted scores
  if (adjustedDoctorScore > adjustedPatientScore) return 'doctor'
  if (adjustedPatientScore > adjustedDoctorScore) return 'patient'

  // Enhanced fallback logic
  if (previousSpeaker) {
    // If unclear, alternate from previous speaker
    return previousSpeaker === 'doctor' ? 'patient' : 'doctor'
  }

  // Final fallback: analyze sentence structure
  if (lowerText.startsWith('i ') || lowerText.includes(' i ')) {
    return 'patient' // First person usually indicates patient
  }

  return 'doctor' // Default to doctor for medical context
}

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
