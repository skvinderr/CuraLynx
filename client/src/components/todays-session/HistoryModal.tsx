import { X, Calendar, Pill, FileText, Activity, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientInfo?: {
        name: string;
        age: number;
        pastDiseases: string;
    };
}

// Sample patient history data
const historyData = [
    {
        date: '15 Oct 2024',
        complaint: 'Seasonal Flu',
        diagnosis: 'Upper Respiratory Tract Infection',
        medications: ['Tab. Paracetamol 500mg', 'Syp. Cough Relief'],
        tests: ['Complete Blood Count (CBC)'],
        notes: 'Patient responded well to treatment. Advised rest and hydration.'
    },
    {
        date: '02 Sep 2024',
        complaint: 'Routine Checkup',
        diagnosis: 'General Health Assessment',
        medications: ['Tab. Vitamin B-Complex', 'Tab. Calcium 500mg'],
        tests: ['Lipid Profile', 'Fasting Blood Sugar'],
        notes: 'All vitals normal. Continue with healthy lifestyle.'
    },
    {
        date: '18 Jul 2024',
        complaint: 'Headache and Fatigue',
        diagnosis: 'Stress-related symptoms',
        medications: ['Tab. Paracetamol 500mg', 'Tab. Multivitamin'],
        tests: ['Blood Pressure Monitoring'],
        notes: 'Recommended stress management techniques and regular exercise.'
    },
];

const HistoryModal = ({ isOpen, onClose, patientInfo }: HistoryModalProps) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col m-4">
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Medical History</h2>
                        {patientInfo && (
                            <p className="text-xs text-white/90 mt-0.5">
                                {patientInfo.name} • {patientInfo.age} years
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/90 hover:bg-white/20 p-2 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Medical Conditions Banner - Compact */}
                {patientInfo && patientInfo.pastDiseases !== 'None' && (
                    <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 shrink-0">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-700" />
                            <div>
                                <p className="text-xs font-semibold text-amber-800">Known Conditions:</p>
                                <p className="text-xs text-amber-900">{patientInfo.pastDiseases}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-br from-[#fafbfa] to-[#f5f7f5]">
                    <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7a9a7a] to-[#7a9a7a]/20"></div>
                        
                        <div className="space-y-3">
                            {historyData.map((visit, index) => {
                                const isExpanded = expandedIndex === index;
                                
                                return (
                                    <div key={index} className="relative pl-12">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 top-3 w-8 h-8 bg-gradient-to-br from-[#5a7a5a] to-[#7a9a7a] rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                            <Calendar className="w-3 h-3 text-white" />
                                        </div>
                                        
                                        {/* Visit Card */}
                                        <div className="bg-white rounded-xl border-2 border-[#7a9a7a]/20 hover:border-[#7a9a7a]/40 transition-all shadow-sm">
                                            {/* Clickable Header */}
                                            <button
                                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#f5f7f5]/50 rounded-t-xl transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="text-sm font-bold text-[#5a7a5a] text-left">{visit.date}</p>
                                                        <p className="text-xs text-gray-600 text-left">{visit.complaint}</p>
                                                    </div>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-[#5a7a5a] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Expandable Content */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 space-y-3 border-t border-[#7a9a7a]/10">
                                                    {/* Diagnosis */}
                                                    <div className="pt-3">
                                                        <p className="text-xs font-semibold text-gray-700 mb-1">Diagnosis:</p>
                                                        <p className="text-xs text-gray-900 bg-purple-50 px-2 py-1.5 rounded-lg border border-purple-100">{visit.diagnosis}</p>
                                                    </div>

                                                    {/* Medications */}
                                                    <div>
                                                        <div className="flex items-center gap-1 mb-1.5">
                                                            <Pill className="w-3 h-3 text-[#7a9a7a]" />
                                                            <p className="text-xs font-semibold text-gray-700">Medications:</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {visit.medications.map((med, medIndex) => (
                                                                <span
                                                                    key={medIndex}
                                                                    className="text-xs bg-[#f5f7f5] text-gray-800 px-2 py-1 rounded-md border border-[#7a9a7a]/20"
                                                                >
                                                                    {med}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Tests */}
                                                    <div>
                                                        <div className="flex items-center gap-1 mb-1.5">
                                                            <FileText className="w-3 h-3 text-[#7a9a7a]" />
                                                            <p className="text-xs font-semibold text-gray-700">Tests:</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {visit.tests.map((test, testIndex) => (
                                                                <span
                                                                    key={testIndex}
                                                                    className="text-xs bg-[#f5f7f5] text-gray-800 px-2 py-1 rounded-md border border-[#7a9a7a]/20"
                                                                >
                                                                    {test}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                                                        <p className="text-xs font-semibold text-blue-700 mb-1">Notes:</p>
                                                        <p className="text-xs text-blue-900 leading-relaxed">{visit.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Compact Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white font-semibold rounded-lg hover:from-[#4a6a4a] hover:to-[#6a8a6a] transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
