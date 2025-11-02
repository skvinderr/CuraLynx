/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useWebSpeechRecognition } from '../../hooks';
import { useSession } from '../../contexts/SessionContext';
import { Clock, User, Activity, Mic, MicOff, Heart, Droplet } from 'lucide-react';

const initialPatients = [
    { id: 1, name: 'Priya Sharma', time: '10:00 AM', status: 'active', age: 38, pastDiseases: 'Allergic Rhinitis', weight: '68 kg', bp: '118/75', sugarLevel: '92 mg/dL' },
    { id: 2, name: 'Rajesh Kumar', time: '10:30 AM', status: 'waiting', age: 55, pastDiseases: 'Type 2 Diabetes', weight: '95 kg', bp: '135/88', sugarLevel: '140 mg/dL' },
    { id: 3, name: 'Anita Patel', time: '11:00 AM', status: 'waiting', age: 29, pastDiseases: 'None', weight: '58 kg', bp: '110/70', sugarLevel: '85 mg/dL' },
    { id: 4, name: 'Suresh Gupta', time: '11:30 AM', status: 'waiting', age: 67, pastDiseases: 'Coronary Artery Disease', weight: '82 kg', bp: '145/92', sugarLevel: '105 mg/dL' },
    { id: 5, name: 'Meera Singh', time: '12:00 PM', status: 'waiting', age: 42, pastDiseases: 'Migraines', weight: '75 kg', bp: '125/80', sugarLevel: '98 mg/dL' },
];

const Sidebar = () => {
    const [patients] = useState(initialPatients);
    const [isHovered, setIsHovered] = useState(false);
    const activePatient = patients.find(p => p.status === 'active');
    const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
    const { addTranscript, setActivePatient } = useSession();
    const { interim, finals, isListening, error, start, stop } = useWebSpeechRecognition('en-US');

    useEffect(() => {
        if (activePatient) {
            setActivePatient(activePatient);
        }
    }, [activePatient, setActivePatient]);

    useEffect(() => {
        setTranscript([]);
    }, [activePatient]);

    // Auto-start listening when component mounts
    useEffect(() => {
        start();
        return () => {
            stop();
        };
    }, []);

    useEffect(() => {
        if (!finals || finals.length === 0) return;
        const last = finals[finals.length - 1];
        if (last?.text?.trim()) {
            setTranscript(prev => {
                const lastSpeaker = prev.length > 0 ? prev[prev.length - 1].speaker.toLowerCase() as 'doctor' | 'patient' : undefined;
                const detectedSpeaker = detectSpeaker(last.text.trim(), lastSpeaker);
                const speaker = detectedSpeaker === 'doctor' ? 'Doctor' : 'Patient';

                console.log(`Adding to transcript: ${speaker}: ${last.text.trim()}`);
                addTranscript(speaker, last.text.trim());

                return [...prev, { speaker, text: last.text.trim() }];
            });
        }
    }, [finals, addTranscript]);

    const detectSpeaker = (text: string, previousSpeaker?: 'doctor' | 'patient'): 'doctor' | 'patient' => {
        const lowerText = text.toLowerCase();

        const doctorPatterns = ['can you', 'how long', 'any pain', 'let me', 'show me', 'describe the',
            'i recommend', 'we need to', 'you should', 'prescription', 'medication', 'treatment',
            'diagnosis', 'symptoms', 'blood pressure', 'heart rate', 'x-ray', 'lab results'];

        const patientPatterns = ['i feel', "i'm feeling", 'it hurts', 'i have', "i've been",
            'my pain', 'my symptoms', "i can't", 'it started', "i'm worried", 'headache',
            'nausea', 'dizzy', 'what does this mean', 'is this serious', 'will i be okay'];

        const doctorScore = doctorPatterns.reduce((score, pattern) =>
            lowerText.includes(pattern) ? score + 1 : score, 0);
        const patientScore = patientPatterns.reduce((score, pattern) =>
            lowerText.includes(pattern) ? score + 1 : score, 0);

        if (lowerText.includes('diagnosis') || lowerText.includes('prescription') ||
            lowerText.includes('blood pressure')) {
            return 'doctor';
        }

        if ((lowerText.startsWith('i ') || lowerText.includes(' i ')) && patientScore > 0) {
            return 'patient';
        }

        if (doctorScore > patientScore) return 'doctor';
        if (patientScore > doctorScore) return 'patient';

        return previousSpeaker === 'doctor' ? 'patient' : 'doctor';
    };

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [transcript, interim]);

    const patientsToShow = isHovered ? patients : (activePatient ? [activePatient] : []);

    return (
        <div className="h-full bg-gradient-to-br from-[#f5f7f5] to-[#e8ede8] p-4">
            <div className="flex flex-col space-y-4">
                {/* Today's Patients Card */}
                <div
                    className="bg-white/90 backdrop-blur-sm px-4 py-4 rounded-xl shadow-sm border border-[#7a9a7a]/20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3.5 h-3.5 text-[#5a7a5a]" />
                        <h3 className="text-xs font-semibold text-[#5a7a5a]">Today's Appointments</h3>
                        <span className="ml-auto text-[10px] text-gray-500">{patients.length} patients</span>
                    </div>
                    <div className={`space-y-2 overflow-y-auto transition-all duration-500 ${isHovered ? 'h-64' : 'h-auto'}`}>
                        {patientsToShow.map((patient) => (
                            <div
                                key={patient.id}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${
                                    patient.status === 'active'
                                        ? 'bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white shadow-md'
                                        : 'bg-white hover:bg-[#f5f7f5] border border-gray-100 opacity-70 hover:opacity-100'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <p className="font-medium text-sm">{patient.name}</p>
                                    </div>
                                    <p className="text-xs">{patient.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Patient Details Card */}
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#7a9a7a]/20">
                                        {activePatient ? (
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 pb-2 border-b border-[#7a9a7a]/10">
                                <User className="w-4 h-4 text-[#7a9a7a]" />
                                <span className="font-semibold text-[#5a7a5a]">{activePatient.name}</span>
                                <span className="ml-auto text-gray-600 text-xs">{activePatient.age} years</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#f5f7f5] p-2 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Heart className="w-3 h-3 text-[#7a9a7a]" />
                                        <span className="text-xs text-gray-600">Blood Pressure</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#5a7a5a]">{activePatient.bp}</span>
                                </div>
                                
                                <div className="bg-[#f5f7f5] p-2 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Droplet className="w-3 h-3 text-[#7a9a7a]" />
                                        <span className="text-xs text-gray-600">Glucose</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#5a7a5a]">{activePatient.sugarLevel}</span>
                                </div>
                            </div>

                            <div className="bg-[#f5f7f5] p-2 rounded-lg">
                                <span className="text-xs text-gray-600">Weight: </span>
                                <span className="text-sm font-semibold text-[#5a7a5a]">{activePatient.weight}</span>
                            </div>

                            <div className="bg-red-50 p-2 rounded-lg border border-amber-200/50">
                                <span className="text-xs text-amber-700 font-medium">Medical History</span>
                                <p className="text-sm text-amber-900 mt-1">{activePatient.pastDiseases}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No active patient selected.</p>
                    )}
                </div>

                {/* Live Transcription Card */}
                <div className="live-transcription-card bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#7a9a7a]/20">
                    <div className="flex items-center mb-3">
                        <div className="flex items-center gap-2 flex-1">
                            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
                            <h3 className="font-semibold text-sm text-[#5a7a5a]">Live Transcription</h3>
                        </div>
                        <button
                            onClick={() => (isListening ? stop() : start())}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                                isListening 
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm' 
                                    : 'bg-[#5a7a5a] text-white hover:bg-[#4a6a4a]'
                            }`}
                            aria-pressed={isListening}
                            aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
                        >
                            {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                            {isListening ? 'Stop' : 'Start'}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5" aria-live="polite">
                            {error}
                        </div>
                    )}
                    
                    <div
                        id="chat-container"
                        className="space-y-2 h-48 overflow-y-auto text-sm pr-2 scroll-smooth scrollbar-hide"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {transcript.map((line, index) => {
                            const isLatestMessage = index === transcript.length - 1;
                            return (
                                <div
                                    key={`final-${index}`}
                                    className={`flex transition-all duration-300 ease-in-out ${
                                        line.speaker === 'Doctor' ? 'justify-start' : 'justify-end'
                                    } ${isLatestMessage ? 'animate-[slideInUp_0.4s_ease-out]' : ''}`}
                                >
                                    <div className={`p-2.5 rounded-lg max-w-[85%] shadow-sm ${
                                        line.speaker === 'Doctor' 
                                            ? 'bg-gradient-to-br from-[#5a7a5a] to-[#6a8a6a] text-white' 
                                            : 'bg-gradient-to-br from-[#7a9a7a] to-[#8aaa8a] text-white'
                                    }`}>
                                        <p className="text-xs leading-relaxed">{line.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {interim && (
                            <div className="flex justify-end opacity-80">
                                <div className="p-2.5 rounded-lg max-w-[85%] bg-[#e8ede8] text-gray-700 border border-[#7a9a7a]/30">
                                    <p className="text-xs italic">{interim}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
