/* eslint-disable */
// @ts-nocheck

// Global type declarations to suppress TypeScript errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  class SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }
  
  interface SpeechRecognitionEvent {
    results: any;
    resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent {
    error: string;
  }
}

export {};