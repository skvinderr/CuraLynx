import { GoogleGenerativeAI } from "@google/generative-ai";

// Type definitions
export type MedicationRecommendation = {
    name: string;
    dosage: string;
    frequency: string;
    reason: string;
}

export type TestRecommendation = {
    name: string;
    reason: string;
}

export type GeminiRecommendations = {
    medications: MedicationRecommendation[];
    tests: TestRecommendation[];
}

export async function getRealtimeRecommendations(
    transcriptChunk: string,
    patientInfo?: {
        age?: number;
        pastDiseases?: string;
        vitals?: {
            bp?: string;
            sugarLevel?: string;
            weight?: string;
        };
    }
): Promise<GeminiRecommendations> {
    try {
        // Initialize the Gemini API with the key
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env file');
            return { medications: [], tests: [] };
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use the latest model name
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });

        console.log('=== Gemini API Request ===');
        console.log('Transcript Chunk:', transcriptChunk);
        console.log('Patient Info:', patientInfo);
        console.log('========================');

        const prompt = `You are a medical reference database assisting with clinical documentation. Based on the conversation transcript, identify commonly prescribed medications and standard diagnostic tests that medical practitioners typically use for the discussed symptoms. This is for educational and documentation purposes only.

Patient Profile:
${patientInfo ? `
- Age: ${patientInfo.age || 'Unknown'}
- Medical History: ${patientInfo.pastDiseases || 'None'}
- Blood Pressure: ${patientInfo.vitals?.bp || 'Unknown'}
- Blood Sugar: ${patientInfo.vitals?.sugarLevel || 'Unknown'}
- Weight: ${patientInfo.vitals?.weight || 'Unknown'}
` : 'Not provided'}

Clinical Conversation:
${transcriptChunk}

Based on the symptoms mentioned in the conversation, list commonly used medications and standard diagnostic tests from medical literature and clinical guidelines:

REFERENCE EXAMPLES (adjust based on actual symptoms):
- For fever/headache symptoms: Paracetamol 500mg twice-daily, Ibuprofen 400mg as-needed
- For respiratory symptoms: Cetirizine 10mg once-daily, Ambroxol syrup thrice-daily
- For pain: Paracetamol, NSAIDs, topical analgesics
- For allergic rhinitis: Antihistamines, nasal corticosteroids
- For diabetes management: Metformin (if relevant to history)
- For hypertension: Losartan, Amlodipine (if relevant to vitals)

Standard Tests:
- CBC (Complete Blood Count) for infections/general health
- Blood Sugar (Fasting/Random) for diabetes screening
- Lipid Profile for cardiovascular health
- Thyroid tests for metabolic issues
- Chest X-Ray for respiratory complaints
- ECG for cardiac symptoms

Provide the information in this JSON format:
{
    "medications": [
        {
            "name": "Generic medication name",
            "dosage": "Standard dosage (e.g., 500mg)",
            "frequency": "Common frequency (e.g., twice-daily)",
            "reason": "Clinical indication"
        }
    ],
    "tests": [
        {
            "name": "Standard diagnostic test",
            "reason": "Clinical purpose"
        }
    ]
}

IMPORTANT: List the medications and tests that are COMMONLY DOCUMENTED in medical records for the symptoms discussed. This is for clinical documentation and educational reference, not direct medical advice.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log('Gemini API Response:', text);

        // Try to extract JSON from the response (handle markdown code blocks)
        let jsonText = text;

        // Remove markdown code blocks if present
        const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
            console.log('Found JSON in code block');
            jsonText = codeBlockMatch[1];
        } else {
            // Try to find JSON object
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                console.log('Found JSON without code block');
                jsonText = jsonMatch[0];
            }
        }

        console.log('Extracted JSON text:', jsonText);

        try {
            const recommendations = JSON.parse(jsonText);

            console.log('Parsed recommendations:', recommendations);
            console.log('Medications count:', recommendations.medications?.length || 0);
            console.log('Tests count:', recommendations.tests?.length || 0);

            // Validate the structure
            if (!recommendations.medications || !recommendations.tests) {
                console.warn('Invalid recommendation structure:', recommendations);
                return { medications: [], tests: [] };
            }

            return recommendations;
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            console.error('Response text:', text);
            return { medications: [], tests: [] };
        }
    } catch (error) {
        console.error('Error getting Gemini recommendations:', error);
        return { medications: [], tests: [] };
    }
}
