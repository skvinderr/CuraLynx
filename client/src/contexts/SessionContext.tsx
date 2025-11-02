/* eslint-disable */
// @ts-nocheck
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getRealtimeRecommendations } from '../services/geminiService';
import type { GeminiRecommendations } from '../services/geminiService';
import type { WorkflowPlan, WorkflowExecutionState } from '../services/clinicalWorkflowAgent';

interface TranscriptEntry {
    speaker: string;
    text: string;
    timestamp: number;
}

interface SessionContextType {
    transcript: TranscriptEntry[];
    addTranscript: (speaker: string, text: string) => void;
    recommendations: GeminiRecommendations;
    isLoadingRecommendations: boolean;
    activePatient: any;
    setActivePatient: (patient: any) => void;
    workflowPlan: WorkflowPlan | null;
    setWorkflowPlan: (plan: WorkflowPlan | null) => void;
    workflowExecutionState: WorkflowExecutionState | null;
    setWorkflowExecutionState: (state: WorkflowExecutionState | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [recommendations, setRecommendations] = useState<GeminiRecommendations>({
        medications: [],
        tests: []
    });
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
    const [activePatient, setActivePatient] = useState<any>(null);
    const [lastProcessedIndex, setLastProcessedIndex] = useState(0);
    const [workflowPlan, setWorkflowPlan] = useState<WorkflowPlan | null>(null);
    const [workflowExecutionState, setWorkflowExecutionState] = useState<WorkflowExecutionState | null>(null);

    const addTranscript = useCallback((speaker: string, text: string) => {
        setTranscript(prev => [...prev, { speaker, text, timestamp: Date.now() }]);
    }, []);

    // Process transcript in chunks every 5-10 seconds
    useEffect(() => {
        if (transcript.length === 0 || transcript.length <= lastProcessedIndex) return;

        const timer = setTimeout(async () => {
            // Get the last 5-10 seconds of conversation
            const recentTranscripts = transcript.slice(lastProcessedIndex);
            const transcriptText = recentTranscripts
                .map(t => `${t.speaker}: ${t.text}`)
                .join('\n');

            if (transcriptText.trim().length > 20) { // Only process if there's meaningful content
                setIsLoadingRecommendations(true);

                console.log('=== SessionContext: Sending to Gemini ===');
                console.log('Transcript Text:', transcriptText);
                console.log('Transcript Length:', transcriptText.length);
                console.log('Active Patient:', activePatient);
                console.log('API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
                console.log('======================================');

                try {
                    const newRecommendations = await getRealtimeRecommendations(
                        transcriptText,
                        activePatient ? {
                            age: activePatient.age,
                            pastDiseases: activePatient.pastDiseases,
                            vitals: {
                                bp: activePatient.bp,
                                sugarLevel: activePatient.sugarLevel,
                                weight: activePatient.weight
                            }
                        } : undefined
                    );

                    // Merge new recommendations with existing ones (avoid duplicates)
                    setRecommendations(prev => {
                        const existingMedNames = new Set(prev.medications.map(m => m.name.toLowerCase()));
                        const existingTestNames = new Set(prev.tests.map(t => t.name.toLowerCase()));

                        const newMeds = newRecommendations.medications.filter(
                            m => !existingMedNames.has(m.name.toLowerCase())
                        );
                        const newTests = newRecommendations.tests.filter(
                            t => !existingTestNames.has(t.name.toLowerCase())
                        );

                        return {
                            medications: [...prev.medications, ...newMeds],
                            tests: [...prev.tests, ...newTests]
                        };
                    });

                    setLastProcessedIndex(transcript.length);
                } catch (error) {
                    console.error('Error getting recommendations:', error);
                } finally {
                    setIsLoadingRecommendations(false);
                }
            }
        }, 8000); // Wait 8 seconds before processing

        return () => clearTimeout(timer);
    }, [transcript, lastProcessedIndex, activePatient]);

    // Reset when active patient changes
    useEffect(() => {
        setTranscript([]);
        setRecommendations({ medications: [], tests: [] });
        setLastProcessedIndex(0);
    }, [activePatient]);

    return (
        <SessionContext.Provider
            value={{
                transcript,
                addTranscript,
                recommendations,
                isLoadingRecommendations,
                activePatient,
                setActivePatient,
                workflowPlan,
                setWorkflowPlan,
                workflowExecutionState,
                setWorkflowExecutionState
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
