import { useState, useEffect } from 'react';
import { Pill, Loader2, Sparkles } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';

interface MedicationsSectionProps {
    selectedMedications: string[];
    onToggleMedication: (medication: string) => void;
}

// Sample medications that could be recommended based on common conditions
const medicationDatabase = {
    fever: ['Tab. Paracetamol 500mg - 1-0-1 after meals', 'Tab. Ibuprofen 400mg - 1-0-1 with food'],
    pain: ['Tab. Paracetamol 500mg - 1-0-1 after meals', 'Tab. Diclofenac 50mg - 1-0-1 after meals'],
    cough: ['Syp. Cough Relief - 10ml TDS', 'Tab. Cetirizine 10mg - 0-0-1'],
    cold: ['Tab. Cetirizine 10mg - 0-0-1', 'Syp. Cough Relief - 10ml TDS'],
    headache: ['Tab. Paracetamol 500mg - 1-0-1', 'Tab. Aspirin 75mg - 1-0-0'],
    diabetes: ['Tab. Metformin 500mg - 1-0-1 after meals', 'Tab. Glimepiride 1mg - 1-0-0 before breakfast'],
    hypertension: ['Tab. Amlodipine 5mg - 1-0-0', 'Tab. Telmisartan 40mg - 1-0-0'],
    infection: ['Tab. Amoxicillin 500mg - 1-0-1 after meals', 'Tab. Azithromycin 500mg - 1-0-0'],
    acidity: ['Tab. Pantoprazole 40mg - 1-0-0 before breakfast', 'Syp. Antacid - 10ml TDS'],
    allergy: ['Tab. Cetirizine 10mg - 0-0-1', 'Tab. Montelukast 10mg - 0-0-1'],
};

const MedicationsSection = ({ selectedMedications, onToggleMedication }: MedicationsSectionProps) => {
    const { transcript } = useSession();
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (!transcript || transcript.length === 0) {
            setRecommendations([]);
            return;
        }

        setIsAnalyzing(true);
        
        // Simulate AI processing delay
        const timer = setTimeout(() => {
            const fullTranscript = transcript.map(t => t.text.toLowerCase()).join(' ');
            const foundMedications = new Set<string>();

            // Analyze transcript for keywords
            Object.entries(medicationDatabase).forEach(([keyword, meds]) => {
                if (fullTranscript.includes(keyword)) {
                    meds.forEach(med => foundMedications.add(med));
                }
            });

            // If no specific symptoms found, suggest general medications
            if (foundMedications.size === 0 && transcript.length > 0) {
                foundMedications.add('Tab. Paracetamol 500mg - 1-0-1 after meals');
                foundMedications.add('Tab. Vitamin B-Complex - 1-0-0 after breakfast');
            }

            setRecommendations(Array.from(foundMedications).slice(0, 5));
            setIsAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [transcript]);

    return (
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#7a9a7a]/20 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <Pill className="w-4 h-4 text-[#5a7a5a]" />
                <h3 className="text-sm font-semibold text-[#5a7a5a]">Recommended Medications</h3>
                {isAnalyzing && <Loader2 className="w-3 h-3 text-[#7a9a7a] animate-spin ml-auto" />}
                {!isAnalyzing && recommendations.length > 0 && (
                    <span className="ml-auto text-xs text-gray-500">{recommendations.length} items</span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5a7a5a]/10 to-[#7a9a7a]/10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-[#5a7a5a] animate-pulse" />
                        </div>
                        <p className="text-xs text-gray-600">Analyzing consultation...</p>
                    </div>
                ) : recommendations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5a7a5a]/10 to-[#7a9a7a]/10 flex items-center justify-center">
                            <Pill className="w-6 h-6 text-[#5a7a5a]/50" />
                        </div>
                        <p className="text-xs text-gray-500 text-center px-4">
                            Listening to conversation...
                            <br />
                            <span className="text-[10px]">Medications will appear based on symptoms discussed</span>
                        </p>
                    </div>
                ) : (
                    recommendations.map((medication, index) => (
                        <div
                            key={index}
                            onClick={() => onToggleMedication(medication)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                selectedMedications.includes(medication)
                                    ? 'bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white border-[#7a9a7a] shadow-md'
                                    : 'bg-white hover:bg-[#f5f7f5] border-gray-200 hover:border-[#7a9a7a]/40'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                                    selectedMedications.includes(medication)
                                        ? 'bg-white border-white'
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {selectedMedications.includes(medication) && (
                                        <svg className="w-3 h-3 text-[#5a7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-xs font-medium ${
                                        selectedMedications.includes(medication) ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {medication.split(' - ')[0]}
                                    </p>
                                    {medication.includes(' - ') && (
                                        <p className={`text-[10px] mt-0.5 ${
                                            selectedMedications.includes(medication) ? 'text-white/90' : 'text-gray-600'
                                        }`}>
                                            {medication.split(' - ')[1]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicationsSection;
