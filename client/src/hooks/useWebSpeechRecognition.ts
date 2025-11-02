/* eslint-disable */
// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';

interface FinalSegment {
    text: string;
}

interface UseWebSpeechRecognition {
    interim: string;
    finals: FinalSegment[];
    isListening: boolean;
    error: string | null;
    start: () => void;
    stop: () => void;
}

// Extend Window interface for webkit prefix
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function useWebSpeechRecognition(language: string = 'en-US'): UseWebSpeechRecognition {
    const [interim, setInterim] = useState('');
    const [finals, setFinals] = useState<FinalSegment[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef<boolean>(false);

    const stop = useCallback(() => {
        if (recognitionRef.current) {
            isListeningRef.current = false;
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const start = useCallback(() => {
        try {
            setError(null);

            // Check if browser supports Speech Recognition
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognitionAPI) {
                throw new Error('Speech Recognition API not supported in this browser');
            }

            // Create recognition instance
            const recognition = new SpeechRecognitionAPI();
            recognitionRef.current = recognition;

            // Configure recognition
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;
            recognition.maxAlternatives = 1;

            // Handle results
            recognition.onresult = (event: any) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        // Add to finals
                        setFinals(prev => [...prev, { text: transcript }]);
                        setInterim('');
                    } else {
                        // Update interim
                        interimTranscript += transcript;
                    }
                }

                if (interimTranscript) {
                    setInterim(interimTranscript);
                }
            };

            // Handle errors
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                
                // Don't show error for aborted (happens when user stops manually)
                if (event.error !== 'aborted') {
                    setError(`Recognition error: ${event.error}`);
                }

                // Try to restart on certain errors
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    setTimeout(() => {
                        if (recognitionRef.current && isListeningRef.current) {
                            try {
                                recognitionRef.current.start();
                            } catch (err) {
                                console.error('Failed to restart after error:', err);
                            }
                        }
                    }, 1000);
                }
            };

            // Handle end
            recognition.onend = () => {
                console.log('Recognition ended, isListening:', isListeningRef.current);
                // Auto-restart if still supposed to be listening
                if (isListeningRef.current && recognitionRef.current) {
                    try {
                        console.log('Auto-restarting recognition...');
                        recognitionRef.current.start();
                    } catch (err) {
                        console.error('Failed to restart recognition:', err);
                        // If restart fails, try again after a short delay
                        setTimeout(() => {
                            if (isListeningRef.current && recognitionRef.current) {
                                try {
                                    recognitionRef.current.start();
                                } catch (e) {
                                    console.error('Failed to restart recognition after delay:', e);
                                }
                            }
                        }, 500);
                    }
                }
            };

            // Start recognition
            recognition.start();
            setIsListening(true);
            isListeningRef.current = true;

        } catch (err) {
            const error = err as Error;
            setError(error?.message || String(err));
            console.error('Failed to start speech recognition:', err);
            isListeningRef.current = false;
        }
    }, [language]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return { interim, finals, isListening, error, start, stop };
}

export default useWebSpeechRecognition;
