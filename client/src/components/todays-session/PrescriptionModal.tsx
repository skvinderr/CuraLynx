import React from 'react';
import { X, Download, Printer, Zap } from 'lucide-react';

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedMedications: string[];
    selectedTests: string[];
    patientInfo?: {
        name: string;
        age: number;
        weight: string;
        bp: string;
        sugarLevel: string;
        pastDiseases: string;
    };
    transcript: { speaker: string; text: string }[];
    onApproveWorkflow?: () => Promise<void>;
}

// Print-specific styles
const printStyles = `
@media print {
    body * {
        visibility: hidden;
    }
    
    .print-prescription-only, 
    .print-prescription-only * {
        visibility: visible;
    }
    
    .print-prescription-only {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: white;
        padding: 0;
        margin: 0;
    }
    
    .no-print,
    .print-hide {
        display: none !important;
    }
    
    @page {
        margin: 0.75in 0.5in;
        size: A4 portrait;
    }
    
    .print-prescription-only {
        page-break-after: auto;
    }
    
    .print-prescription-only table {
        page-break-inside: avoid;
    }
}

@media screen {
    .print-prescription-only {
        display: none;
    }
}
`;

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
    isOpen,
    onClose,
    selectedMedications,
    selectedTests,
    patientInfo,
    transcript,
    onApproveWorkflow
}) => {
    if (!isOpen) return null;

    // SOAP Components
    // Subjective - Patient's statements
    const subjective = transcript
        .filter(t => t.speaker.toLowerCase() === 'patient')
        .map(t => t.text)
        .join(' ');

    // Objective - Vitals and observations
    const objective = {
        vitals: {
            bp: patientInfo?.bp || 'Not recorded',
            weight: patientInfo?.weight || 'Not recorded',
            sugar: patientInfo?.sugarLevel || 'Not recorded',
        },
        pastHistory: patientInfo?.pastDiseases || 'None reported'
    };

    // Assessment - Doctor's diagnosis
    const assessment = transcript
        .filter(t => t.speaker.toLowerCase() === 'doctor')
        .slice(-3)
        .map(t => t.text)
        .join('. ');

    // Plan - Medications and tests
    const plan = {
        medications: selectedMedications,
        investigations: selectedTests
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const soapText = `
MEDICAL CONSULTATION NOTE - SOAP FORMAT
========================================

Date: ${currentDate}
Patient: ${patientInfo?.name || 'N/A'}
Age: ${patientInfo?.age || 'N/A'} years

SUBJECTIVE (Chief Complaint & History):
${subjective || 'Not documented'}

OBJECTIVE (Clinical Findings):
Vitals:
- Blood Pressure: ${objective.vitals.bp}
- Weight: ${objective.vitals.weight}
- Blood Sugar: ${objective.vitals.sugar}

Past Medical History: ${objective.pastHistory}

ASSESSMENT (Diagnosis):
${assessment || 'Clinical assessment pending'}

PLAN (Treatment & Management):

Medications Prescribed:
${plan.medications.map((med, i) => `${i + 1}. ${med}`).join('\n')}

Investigations Ordered:
${plan.investigations.map((test, i) => `${i + 1}. ${test}`).join('\n')}

General Advice:
- Take medicines after meals
- Drink plenty of water (8-10 glasses per day)
- Complete the full course of prescribed medicines
- Follow up if symptoms persist or worsen

========================================
Generated: ${new Date().toLocaleString()}
        `.trim();

        const blob = new Blob([soapText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SOAP_Note_${patientInfo?.name || 'Patient'}_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleApproveWorkflow = async () => {
        if (onApproveWorkflow) {
            await onApproveWorkflow();
        }
    };

    return (
        <>
            <style>{printStyles}</style>

            {/* Print-Only Prescription (Original Format - Hidden on Screen) */}
            <div className="print-prescription-only">
                <div className="max-w-[8.5in] mx-auto bg-white p-8">
                    {/* Doctor's Letterhead */}
                    <div className="border-b-4 border-blue-700 pb-6 mb-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-blue-900 mb-2 tracking-wide">Dr. Curalynx</h1>
                            <p className="text-base text-gray-700 font-medium">MBBS, MD (General Medicine)</p>
                            <p className="text-sm text-gray-600 mt-1">Reg. No: MCI/[Registration Number]</p>
                            <div className="mt-3 text-sm text-gray-600">
                                <p className="font-medium">[Clinic/Hospital Name]</p>
                                <p>[Complete Address] | Phone: [Contact Number] | Email: [Email]</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="mb-8">
                        <div className="space-y-3">
                            <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                <span className="font-bold text-gray-800 w-32">Patient Name:</span>
                                <span className="text-gray-900 text-lg">{patientInfo?.name || '___________________________'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">Age:</span>
                                    <span className="text-gray-900">{patientInfo?.age ? `${patientInfo.age} Years` : '______'}</span>
                                </div>
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">Sex:</span>
                                    <span className="text-gray-900">M/F</span>
                                </div>
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">Date:</span>
                                    <span className="text-gray-900">{currentDate}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">Weight:</span>
                                    <span className="text-gray-900">{patientInfo?.weight || '______'}</span>
                                </div>
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">BP:</span>
                                    <span className="text-gray-900">{patientInfo?.bp || '______'}</span>
                                </div>
                                <div className="flex items-center border-b border-dotted border-gray-400 pb-1">
                                    <span className="font-bold text-gray-800 w-20">Sugar:</span>
                                    <span className="text-gray-900">{patientInfo?.sugarLevel || '______'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chief Complaints */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900 text-base mb-2 uppercase tracking-wide">Chief Complaints:</h3>
                        <div className="pl-6 text-gray-800 leading-relaxed">
                            {subjective || 'As per clinical examination'}
                        </div>
                    </div>

                    {/* Diagnosis/Assessment */}
                    {assessment && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 text-base mb-2 uppercase tracking-wide">Diagnosis:</h3>
                            <div className="pl-6 text-gray-800 leading-relaxed">
                                {assessment}
                            </div>
                        </div>
                    )}

                    {/* Rx Symbol and Medicines */}
                    <div className="mb-8">
                        <div className="flex items-start mb-4">
                            <div className="text-7xl font-bold text-blue-700 mr-6 leading-none" style={{ fontFamily: 'Georgia, serif' }}>℞</div>
                            <div className="flex-1">
                                {selectedMedications.length > 0 ? (
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-800">
                                                <th className="text-left py-2 font-bold text-gray-900">Medicine Name</th>
                                                <th className="text-center py-2 font-bold text-gray-900 w-32">Dosage</th>
                                                <th className="text-center py-2 font-bold text-gray-900 w-32">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedMedications.map((med, index) => (
                                                <tr key={index} className="border-b border-gray-300">
                                                    <td className="py-3 text-gray-800">
                                                        <span className="font-semibold">{index + 1}.</span> {med}
                                                    </td>
                                                    <td className="text-center py-3 font-mono font-semibold text-gray-800">1-0-1</td>
                                                    <td className="text-center py-3 text-gray-800">5 days</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-600 italic">No medications prescribed</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Investigations */}
                    {selectedTests.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-base mb-3 uppercase tracking-wide">Investigations Advised:</h3>
                            <div className="pl-6">
                                <ul className="space-y-2">
                                    {selectedTests.map((test, index) => (
                                        <li key={index} className="text-gray-800">
                                            <span className="font-semibold">{index + 1}.</span> {test}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* General Advice */}
                    <div className="mb-12">
                        <h3 className="font-bold text-gray-900 text-base mb-3 uppercase tracking-wide">General Advice:</h3>
                        <div className="pl-6">
                            <ul className="space-y-2 text-gray-800">
                                <li>• Take medicines after meals</li>
                                <li>• Drink plenty of water (8-10 glasses per day)</li>
                                <li>• Complete the full course of prescribed medicines</li>
                                <li>• Follow up if symptoms persist or worsen</li>
                                <li>• Avoid self-medication</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-16 pt-6 border-t-2 border-gray-300">
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-gray-700">
                                <p className="mb-2"><span className="font-bold">Next Visit:</span> ____________________</p>
                                <p><span className="font-bold">Follow-up Date:</span> _______________</p>
                            </div>
                            <div className="text-right">
                                <div className="mb-16"></div>
                                <div className="border-t-2 border-gray-800 pt-2 w-48">
                                    <p className="font-bold text-gray-900">Doctor's Signature</p>
                                    <p className="text-xs text-gray-600 mt-1">Dr. [Doctor Name]</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500 border-t pt-3">
                        <p>This is a computer-generated prescription and is valid only with doctor's signature</p>
                        <p className="mt-1">For any queries, please contact: [Contact Number]</p>
                    </div>
                </div>
            </div>

            {/* Screen Modal - SOAP Format */}
            <div className="print-hide fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] no-print">
                        <div>
                            <h2 className="text-xl font-bold text-white">Medical Consultation Note</h2>
                            <p className="text-xs text-white/90 mt-0.5">SOAP Format Documentation</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                title="Download SOAP Note"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                title="Print Prescription"
                            >
                                <Printer className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* SOAP Format Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#fafbfa] to-[#f5f7f5]">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {/* Patient Header */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#7a9a7a]/20">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-[#5a7a5a]">Patient Information</h3>
                                    <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{currentDate}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-semibold text-gray-800">{patientInfo?.name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Age:</span>
                                        <span className="ml-2 font-semibold text-gray-800">{patientInfo?.age || 'N/A'} years</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Past History:</span>
                                        <span className="ml-2 font-semibold text-gray-800">{objective.pastHistory}</span>
                                    </div>
                                </div>
                            </div>

                            {/* S - Subjective */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#7a9a7a]/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">S</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-[#4a5a4a]">Subjective</h3>
                                        <p className="text-xs text-[#5a7a5a]">Chief Complaint & Patient's History</p>
                                    </div>
                                </div>
                                <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                    <p className="text-sm text-[#3a4a3a] leading-relaxed">
                                        {subjective || 'No subjective information documented'}
                                    </p>
                                </div>
                            </div>

                            {/* O - Objective */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#7a9a7a]/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#5a7a5a] to-[#7a9a7a] rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">O</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-[#4a5a4a]">Objective</h3>
                                        <p className="text-xs text-[#5a7a5a]">Clinical Findings & Vital Signs</p>
                                    </div>
                                </div>
                                <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white rounded-lg p-3 border border-[#7a9a7a]/20">
                                            <p className="text-xs text-[#5a7a5a] font-semibold mb-1">Blood Pressure</p>
                                            <p className="text-base font-bold text-[#4a5a4a]">{objective.vitals.bp}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-[#7a9a7a]/20">
                                            <p className="text-xs text-[#5a7a5a] font-semibold mb-1">Weight</p>
                                            <p className="text-base font-bold text-[#4a5a4a]">{objective.vitals.weight}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-[#7a9a7a]/20">
                                            <p className="text-xs text-[#5a7a5a] font-semibold mb-1">Blood Sugar</p>
                                            <p className="text-base font-bold text-[#4a5a4a]">{objective.vitals.sugar}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* A - Assessment */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#7a9a7a]/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#5a7a5a] to-[#7a9a7a] rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">A</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-[#4a5a4a]">Assessment</h3>
                                        <p className="text-xs text-[#5a7a5a]">Clinical Diagnosis</p>
                                    </div>
                                </div>
                                <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                    <p className="text-sm text-[#3a4a3a] leading-relaxed">
                                        {assessment || 'Clinical assessment pending'}
                                    </p>
                                </div>
                            </div>

                            {/* P - Plan */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#7a9a7a]/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#5a7a5a] to-[#7a9a7a] rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">P</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-[#4a5a4a]">Plan</h3>
                                        <p className="text-xs text-[#5a7a5a]">Treatment & Management Strategy</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Medications */}
                                    {plan.medications.length > 0 && (
                                        <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                            <h4 className="text-xs font-bold text-[#5a7a5a] mb-3 uppercase tracking-wide">Prescribed Medications</h4>
                                            <div className="space-y-2">
                                                {plan.medications.map((med, index) => (
                                                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-2 border border-[#7a9a7a]/20">
                                                        <span className="flex items-center justify-center w-6 h-6 bg-[#7a9a7a]/20 rounded-full text-[#5a7a5a] text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm text-[#3a4a3a] font-medium">{med}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Investigations */}
                                    {plan.investigations.length > 0 && (
                                        <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                            <h4 className="text-xs font-bold text-[#5a7a5a] mb-3 uppercase tracking-wide">Investigations Ordered</h4>
                                            <div className="space-y-2">
                                                {plan.investigations.map((test, index) => (
                                                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-2 border border-[#7a9a7a]/20">
                                                        <span className="flex items-center justify-center w-6 h-6 bg-[#7a9a7a]/20 rounded-full text-[#5a7a5a] text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm text-[#3a4a3a] font-medium">{test}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* General Advice */}
                                    <div className="bg-[#f5f7f5] rounded-lg p-4 border border-[#7a9a7a]/20">
                                        <h4 className="text-xs font-bold text-[#5a7a5a] mb-3 uppercase tracking-wide">General Advice</h4>
                                        <ul className="space-y-2 text-sm text-[#3a4a3a]">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#5a7a5a] mt-0.5">•</span>
                                                <span>Take medicines after meals</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#5a7a5a] mt-0.5">•</span>
                                                <span>Drink plenty of water (8-10 glasses per day)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#5a7a5a] mt-0.5">•</span>
                                                <span>Complete the full course of prescribed medicines</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#5a7a5a] mt-0.5">•</span>
                                                <span>Follow up if symptoms persist or worsen</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Empty State */}
                                {plan.medications.length === 0 && plan.investigations.length === 0 && (
                                    <div className="bg-[#f5f7f5] rounded-lg p-8 text-center border border-[#7a9a7a]/20">
                                        <p className="text-sm text-[#5a7a5a]">No treatment plan documented</p>
                                        <p className="text-xs text-[#6a7a6a] mt-1">Select medications and tests to create a treatment plan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="no-print flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 bg-white">
                        <p className="text-xs text-gray-600">
                            <span className="font-semibold">Note:</span> Print button generates traditional prescription format
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white rounded-xl hover:from-[#4a6a4a] hover:to-[#6a8a6a] transition-all shadow-md font-semibold"
                            >
                                Print Prescription
                            </button>
                            {onApproveWorkflow && (
                                <button
                                    onClick={handleApproveWorkflow}
                                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md font-semibold flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    Approve & Run Workflow
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrescriptionModal;
