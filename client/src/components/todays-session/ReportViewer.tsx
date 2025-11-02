import { useState } from 'react';
import { X, FileText, Calendar, User, Download, Printer, Activity, ChevronDown, ChevronUp } from 'lucide-react';

// Sample report data with actual medical report formats
const sampleReports = [
    {
        id: 1,
        date: '2024-10-28',
        type: 'Complete Blood Count (CBC)',
        doctor: 'Dr. Rajesh Mehta',
        patient: 'Priya Sharma',
        labName: 'Apollo Diagnostics',
        labLogo: '/assets/lab-logos/apollo.png', // Store logo locally in public/assets/lab-logos/
        referenceId: 'CBC2024102801',
        details: [
            { test: 'Hemoglobin', value: '12.5', unit: 'g/dL', range: '12.0 - 15.5', status: 'normal' },
            { test: 'RBC Count', value: '4.5', unit: 'million/µL', range: '4.0 - 5.5', status: 'normal' },
            { test: 'WBC Count', value: '7,500', unit: 'cells/µL', range: '4,000 - 11,000', status: 'normal' },
            { test: 'Platelet Count', value: '250,000', unit: '/µL', range: '150,000 - 450,000', status: 'normal' },
            { test: 'Hematocrit', value: '38', unit: '%', range: '36 - 46', status: 'normal' },
            { test: 'MCV', value: '88', unit: 'fL', range: '80 - 100', status: 'normal' },
            { test: 'MCH', value: '28', unit: 'pg', range: '27 - 32', status: 'normal' },
            { test: 'MCHC', value: '33', unit: 'g/dL', range: '32 - 36', status: 'normal' },
        ],
        summary: 'All blood parameters are within normal range. Hemoglobin levels are adequate. No signs of anemia or infection.',
    },
    {
        id: 2,
        date: '2024-10-20',
        type: 'Lipid Profile',
        doctor: 'Dr. Anita Kumar',
        patient: 'Priya Sharma',
        labName: 'PathLab Diagnostics',
        labLogo: '/assets/lab-logos/pathlab.png',
        referenceId: 'LP2024102001',
        details: [
            { test: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: '< 200', status: 'normal' },
            { test: 'LDL Cholesterol', value: '110', unit: 'mg/dL', range: '< 130', status: 'normal' },
            { test: 'HDL Cholesterol', value: '55', unit: 'mg/dL', range: '> 40', status: 'normal' },
            { test: 'Triglycerides', value: '100', unit: 'mg/dL', range: '< 150', status: 'normal' },
            { test: 'VLDL Cholesterol', value: '20', unit: 'mg/dL', range: '5 - 40', status: 'normal' },
            { test: 'TC/HDL Ratio', value: '3.4', unit: '', range: '< 5.0', status: 'normal' },
            { test: 'LDL/HDL Ratio', value: '2.0', unit: '', range: '< 3.0', status: 'normal' },
        ],
        summary: 'Lipid profile shows healthy cholesterol levels. HDL (good cholesterol) is adequate. Continue balanced diet and regular exercise.',
    },
    {
        id: 3,
        date: '2024-10-15',
        type: 'Kidney Function Test (KFT)',
        doctor: 'Dr. Suresh Patel',
        patient: 'Priya Sharma',
        labName: 'Metropolis Healthcare',
        labLogo: '/assets/lab-logos/metropolis.png',
        referenceId: 'KFT2024101501',
        details: [
            { test: 'Blood Urea', value: '28', unit: 'mg/dL', range: '15 - 40', status: 'normal' },
            { test: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6 - 1.2', status: 'normal' },
            { test: 'Uric Acid', value: '5.2', unit: 'mg/dL', range: '2.4 - 6.0', status: 'normal' },
            { test: 'Blood Urea Nitrogen', value: '13', unit: 'mg/dL', range: '7 - 20', status: 'normal' },
            { test: 'BUN/Creatinine Ratio', value: '14.4', unit: '', range: '10 - 20', status: 'normal' },
            { test: 'Sodium', value: '140', unit: 'mmol/L', range: '135 - 145', status: 'normal' },
            { test: 'Potassium', value: '4.2', unit: 'mmol/L', range: '3.5 - 5.0', status: 'normal' },
            { test: 'Chloride', value: '102', unit: 'mmol/L', range: '96 - 106', status: 'normal' },
        ],
        summary: 'Kidney function parameters are all within normal limits. Electrolyte balance is maintained. Kidney health is good.',
    },
    {
        id: 4,
        date: '2024-10-10',
        type: 'Liver Function Test (LFT)',
        doctor: 'Dr. Vikram Singh',
        patient: 'Priya Sharma',
        labName: 'Dr. Lal PathLabs',
        labLogo: '/assets/lab-logos/lal-pathlab.png',
        referenceId: 'LFT2024101001',
        details: [
            { test: 'Bilirubin (Total)', value: '0.8', unit: 'mg/dL', range: '0.3 - 1.2', status: 'normal' },
            { test: 'Bilirubin (Direct)', value: '0.2', unit: 'mg/dL', range: '0.0 - 0.3', status: 'normal' },
            { test: 'Bilirubin (Indirect)', value: '0.6', unit: 'mg/dL', range: '0.2 - 0.9', status: 'normal' },
            { test: 'SGOT/AST', value: '28', unit: 'U/L', range: '5 - 40', status: 'normal' },
            { test: 'SGPT/ALT', value: '32', unit: 'U/L', range: '5 - 40', status: 'normal' },
            { test: 'Alkaline Phosphatase', value: '85', unit: 'U/L', range: '30 - 120', status: 'normal' },
            { test: 'Total Protein', value: '7.2', unit: 'g/dL', range: '6.0 - 8.3', status: 'normal' },
            { test: 'Albumin', value: '4.5', unit: 'g/dL', range: '3.5 - 5.5', status: 'normal' },
            { test: 'Globulin', value: '2.7', unit: 'g/dL', range: '2.0 - 3.5', status: 'normal' },
        ],
        summary: 'Liver enzymes and bilirubin levels are normal. No signs of liver dysfunction. Protein levels are adequate.',
    },
    {
        id: 5,
        date: '2024-10-05',
        type: 'Thyroid Function Test',
        doctor: 'Dr. Meera Desai',
        patient: 'Priya Sharma',
        labName: 'SRL Diagnostics',
        labLogo: '/assets/lab-logos/srl.png',
        referenceId: 'TFT2024100501',
        details: [
            { test: 'TSH', value: '2.8', unit: 'µIU/mL', range: '0.5 - 5.0', status: 'normal' },
            { test: 'T3 (Total)', value: '1.2', unit: 'ng/mL', range: '0.8 - 2.0', status: 'normal' },
            { test: 'T4 (Total)', value: '8.5', unit: 'µg/dL', range: '5.0 - 12.0', status: 'normal' },
            { test: 'Free T3', value: '3.1', unit: 'pg/mL', range: '2.0 - 4.4', status: 'normal' },
            { test: 'Free T4', value: '1.3', unit: 'ng/dL', range: '0.8 - 1.8', status: 'normal' },
        ],
        summary: 'Thyroid hormone levels are within normal range. No evidence of hypothyroidism or hyperthyroidism.',
    },
];

interface ReportViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReportViewer = ({ isOpen, onClose }: ReportViewerProps) => {
    const [selectedReport, setSelectedReport] = useState(sampleReports[0]);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Create a formatted report content
        const reportContent = `
MEDICAL LABORATORY REPORT
${'='.repeat(80)}

Laboratory: ${selectedReport.labName}
Report ID: ${selectedReport.referenceId}
Test Type: ${selectedReport.type}

Patient Information:
- Name: ${selectedReport.patient}
- Age/Sex: 38Y / F
- Date: ${selectedReport.date}
- Referred by: ${selectedReport.doctor}

${'='.repeat(80)}

TEST RESULTS:
${'-'.repeat(80)}

${selectedReport.details.map(item => 
    `${item.test.padEnd(30)} ${item.value.padStart(10)} ${item.unit.padEnd(12)} [${item.range}]`
).join('\n')}

${'='.repeat(80)}

CLINICAL SUMMARY:
${selectedReport.summary}

${'='.repeat(80)}

Report generated on: ${new Date().toLocaleString()}
Lab Technician: Verified by Dr. Pathologist

This is a computer-generated report.
        `.trim();

        // Create blob and download
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport.type.replace(/\s+/g, '_')}_${selectedReport.patient.replace(/\s+/g, '_')}_${selectedReport.date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex backdrop-blur-md items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-[75%] h-[90%] flex flex-col animate-[slideInUp_0.2s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="w-6 h-6" />
                            Medical Reports
                        </h2>
                        <p className="text-xs text-white/90 mt-0.5">{selectedReport.patient}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                            aria-label="Download"
                            title="Download Report"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                            aria-label="Print"
                            title="Print Report"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Three Column Layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Column 1: Reports List */}
                    <div className="w-1/4 border-r border-gray-200 overflow-y-auto bg-gradient-to-br from-[#fafbfa] to-[#f5f7f5]">
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-[#5a7a5a] mb-3 uppercase tracking-wide flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Recent Reports
                            </h3>
                            <div className="space-y-2">
                                {sampleReports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                                            selectedReport.id === report.id
                                                ? 'bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white shadow-md'
                                                : 'bg-white border-2 border-[#7a9a7a]/20 hover:border-[#7a9a7a]/40'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className={`font-semibold text-sm ${selectedReport.id === report.id ? 'text-white' : 'text-gray-800'}`}>
                                                {report.type}
                                            </h4>
                                            <FileText className={`w-4 h-4 shrink-0 ${selectedReport.id === report.id ? 'text-white' : 'text-[#7a9a7a]'}`} />
                                        </div>
                                        <div className={`space-y-1 text-xs ${selectedReport.id === report.id ? 'text-white/90' : 'text-gray-600'}`}>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{report.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3" />
                                                <span>{report.doctor}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Report Details (Actual Medical Report Format) */}
                    <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
                        <div className="p-6">
                            {/* Lab Report Header */}
                            <div className="bg-gradient-to-r from-[#5a7a5a]/5 to-[#7a9a7a]/5 rounded-xl p-4 mb-4 border-2 border-[#7a9a7a]/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-sm border border-gray-200 flex items-center justify-center">
                                            <img 
                                                src={selectedReport.labLogo} 
                                                alt={selectedReport.labName}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                                }}
                                            />
                                            <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                                                <Activity className="w-8 h-8 text-[#7a9a7a]" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#5a7a5a]">{selectedReport.labName}</h4>
                                            <p className="text-xs text-gray-600">Accredited Laboratory</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600">Report ID</p>
                                        <p className="text-sm font-bold text-[#5a7a5a]">{selectedReport.referenceId}</p>
                                    </div>
                                </div>
                                <div className="border-t-2 border-[#7a9a7a]/20 pt-3 grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-gray-600">Patient:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedReport.patient}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Ref. by:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedReport.doctor}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-semibold text-gray-800 ml-2">{selectedReport.date}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Age/Sex:</span>
                                        <span className="font-semibold text-gray-800 ml-2">38Y / F</span>
                                    </div>
                                </div>
                            </div>

                            {/* Test Name Header */}
                            <div className="bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] rounded-lg px-4 py-3 mb-3">
                                <h3 className="text-base font-bold text-white">{selectedReport.type}</h3>
                            </div>

                            {/* Medical Report Table */}
                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                {/* Table Header */}
                                <div className="bg-gray-100 grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold text-gray-700 border-b-2 border-gray-200">
                                    <div className="col-span-4">TEST NAME</div>
                                    <div className="col-span-2 text-center">RESULT</div>
                                    <div className="col-span-2 text-center">UNIT</div>
                                    <div className="col-span-4 text-center">REFERENCE RANGE</div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200">
                                    {selectedReport.details.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-12 gap-2 px-4 py-3 text-xs ${
                                                item.status === 'high' ? 'bg-red-50' : 
                                                item.status === 'low' ? 'bg-yellow-50' : 
                                                'bg-white hover:bg-gray-50'
                                            } transition-colors`}
                                        >
                                            <div className="col-span-4 font-medium text-gray-800">{item.test}</div>
                                            <div className={`col-span-2 text-center font-bold ${
                                                item.status === 'high' ? 'text-red-600' :
                                                item.status === 'low' ? 'text-yellow-600' :
                                                'text-[#5a7a5a]'
                                            }`}>
                                                {item.value}
                                            </div>
                                            <div className="col-span-2 text-center text-gray-600">{item.unit}</div>
                                            <div className="col-span-4 text-center text-gray-600">{item.range}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Report Footer */}
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-600 border-t-2 border-gray-200 pt-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span>Normal</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                                        <span>High</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                        <span>Low</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[#5a7a5a]">Lab Technician</p>
                                    <p className="text-gray-500">Verified by Dr. Pathologist</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Summary & Analysis */}
                    <div className="w-1/4 overflow-y-auto bg-gradient-to-br from-[#fafbfa] to-[#f5f7f5]">
                        <div className="p-4">
                            {/* Collapsible Summary Section */}
                            <div className="bg-white rounded-xl shadow-sm border-2 border-[#7a9a7a]/20 mb-3 overflow-hidden">
                                <button
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-[#f5f7f5] transition-colors"
                                >
                                    <h3 className="text-xs font-bold text-[#5a7a5a] uppercase tracking-wide">
                                        Clinical Summary
                                    </h3>
                                    {isSummaryExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-[#5a7a5a]" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-[#5a7a5a]" />
                                    )}
                                </button>
                                
                                {isSummaryExpanded && (
                                    <div className="px-3 pb-3">
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className="w-1 h-10 bg-gradient-to-b from-[#5a7a5a] to-[#7a9a7a] rounded-full shrink-0"></div>
                                            <div>
                                                <h4 className="font-bold text-xs text-gray-800 mb-1">Report Analysis</h4>
                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                    {selectedReport.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-bold text-xs text-green-800">Overall Status</h5>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-green-700">All Parameters Normal</p>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-[#7a9a7a]/20">
                                <h5 className="font-bold text-xs text-[#5a7a5a] mb-3 uppercase tracking-wide">Recommendations</h5>
                                <ul className="space-y-2 text-xs text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7a9a7a] mt-0.5">✓</span>
                                        <span>Maintain current lifestyle and diet</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7a9a7a] mt-0.5">✓</span>
                                        <span>Follow-up test in 3-6 months</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7a9a7a] mt-0.5">✓</span>
                                        <span>Continue prescribed medications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7a9a7a] mt-0.5">✓</span>
                                        <span>Regular exercise recommended</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
