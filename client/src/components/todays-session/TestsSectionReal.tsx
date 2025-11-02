import { useState, useEffect } from 'react';
import { FlaskConical, Loader2, Sparkles } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';

interface TestsSectionProps {
    selectedTests: string[];
    onToggleTest: (test: string) => void;
}

// Sample tests that could be recommended based on common conditions
const testDatabase = {
    fever: ['Complete Blood Count (CBC)', 'C-Reactive Protein (CRP)'],
    diabetes: ['Fasting Blood Sugar (FBS)', 'HbA1c Test', 'Lipid Profile'],
    hypertension: ['ECG', 'Lipid Profile', 'Kidney Function Test'],
    pain: ['X-Ray', 'Complete Blood Count (CBC)'],
    chest: ['Chest X-Ray', 'ECG'],
    kidney: ['Kidney Function Test', 'Urine Routine'],
    liver: ['Liver Function Test (LFT)', 'Ultrasound Abdomen'],
    thyroid: ['Thyroid Function Test (TFT)', 'TSH Test'],
    infection: ['Complete Blood Count (CBC)', 'Urine Culture', 'Blood Culture'],
    heart: ['ECG', 'Echocardiography', '2D Echo'],
    sugar: ['Fasting Blood Sugar (FBS)', 'HbA1c Test', 'Random Blood Sugar'],
    cholesterol: ['Lipid Profile', 'Total Cholesterol'],
    anemia: ['Complete Blood Count (CBC)', 'Hemoglobin Test', 'Iron Studies'],
};

const TestsSection = ({ selectedTests, onToggleTest }: TestsSectionProps) => {
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
            const foundTests = new Set<string>();

            // Analyze transcript for keywords
            Object.entries(testDatabase).forEach(([keyword, tests]) => {
                if (fullTranscript.includes(keyword)) {
                    tests.forEach(test => foundTests.add(test));
                }
            });

            // If no specific conditions found, suggest general tests
            if (foundTests.size === 0 && transcript.length > 0) {
                foundTests.add('Complete Blood Count (CBC)');
                foundTests.add('Blood Pressure Monitoring');
            }

            setRecommendations(Array.from(foundTests).slice(0, 5));
            setIsAnalyzing(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [transcript]);

    return (
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#7a9a7a]/20 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <FlaskConical className="w-4 h-4 text-[#5a7a5a]" />
                <h3 className="text-sm font-semibold text-[#5a7a5a]">Recommended Tests</h3>
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
                            <FlaskConical className="w-6 h-6 text-[#5a7a5a]/50" />
                        </div>
                        <p className="text-xs text-gray-500 text-center px-4">
                            Listening to conversation...
                            <br />
                            <span className="text-[10px]">Tests will be suggested based on symptoms discussed</span>
                        </p>
                    </div>
                ) : (
                    recommendations.map((test, index) => (
                        <div
                            key={index}
                            onClick={() => onToggleTest(test)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                selectedTests.includes(test)
                                    ? 'bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white border-[#7a9a7a] shadow-md'
                                    : 'bg-white hover:bg-[#f5f7f5] border-gray-200 hover:border-[#7a9a7a]/40'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                                    selectedTests.includes(test)
                                        ? 'bg-white border-white'
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {selectedTests.includes(test) && (
                                        <svg className="w-3 h-3 text-[#5a7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-xs font-medium ${
                                        selectedTests.includes(test) ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {test}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TestsSection;
