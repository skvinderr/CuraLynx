import { useState, useEffect } from 'react';
import TopActionButtons from './TopActionButtons';
import MedicationsSection from './MedicationsSection'; // Make sure this file exists
import TestsSection from './TestsSection'; // Make sure this file exists
import { FileText, Sparkles } from 'lucide-react';
import ReportViewer from './ReportViewer';
import PrescriptionModal from './PrescriptionModal';
import AutonomousWorkflowModal from './AutonomousWorkflowModal';
import { useSession } from '../../contexts/SessionContext';
import HistoryModal from './HistoryModal';
import { parsePlanToTasks, executeWorkflow } from '../../services/clinicalWorkflowAgent';
import type { WorkflowPlan } from '../../services/clinicalWorkflowAgent';

const MainArea = () => {
    const [isReportViewerOpen, setIsReportViewerOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
    const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [isTranscriptionStarted, setIsTranscriptionStarted] = useState(false);
    const [isAnalyzingWorkflow, setIsAnalyzingWorkflow] = useState(false);
    const { 
        transcript, 
        activePatient, 
        workflowExecutionState, 
        setWorkflowExecutionState,
        setWorkflowPlan 
    } = useSession();

    // Automatically show recommendations when transcript has content
    useEffect(() => {
        if (transcript && transcript.length > 0) {
            setIsTranscriptionStarted(true);
        }
    }, [transcript]);

    const toggleMedication = (medication: string) => {
        setSelectedMedications(prev =>
            prev.includes(medication)
                ? prev.filter(m => m !== medication)
                : [...prev, medication]
        );
    };

    const toggleTest = (test: string) => {
        setSelectedTests(prev =>
            prev.includes(test)
                ? prev.filter(t => t !== test)
                : [...prev, test]
        );
    };

    const handleApproveWorkflow = async () => {
        setIsAnalyzingWorkflow(true);
        setIsWorkflowModalOpen(true);
        setIsPrescriptionModalOpen(false); // Close prescription modal

        try {
            // Parse the plan from current selections
            const generatedPlan = await parsePlanToTasks(
                'Clinical workflow execution',
                selectedMedications,
                selectedTests,
                activePatient
            );

            setWorkflowPlan(generatedPlan);
            setIsAnalyzingWorkflow(false); // Analysis complete

            // Execute the workflow
            const finalState = await executeWorkflow(
                generatedPlan,
                activePatient?.id || 'patient-' + Date.now(),
                (state) => {
                    setWorkflowExecutionState(state);
                }
            );

            // Ensure final state is set
            setWorkflowExecutionState(finalState);
        } catch (error) {
            console.error('Error executing workflow:', error);
            setIsAnalyzingWorkflow(false);
        }
    };


    return (
        <div className="h-full w-full bg-gradient-to-br from-[#fafbfa] to-[#f0f4f0] p-6 flex flex-col overflow-hidden">
            <TopActionButtons />

            <div className="recommendations-area flex-1 flex flex-col min-h-0 mt-4">
                {!isTranscriptionStarted ? (
                    // Show placeholder before transcription starts
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-4 max-w-md">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a7a5a]/10 to-[#7a9a7a]/10 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-[#5a7a5a]" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-[#5a7a5a]">
                                Waiting for Consultation
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Start the live transcription to begin receiving AI-powered medication and test recommendations based on the patient conversation.
                            </p>
                            <div className="pt-2">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5a7a5a]/5 rounded-full border border-[#7a9a7a]/20">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span className="text-xs text-gray-600">Click "Start" in Live Transcription</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Show recommendations after transcription starts
                    <div className="flex gap-6 flex-1 min-h-0">
                        <MedicationsSection
                            selectedMedications={selectedMedications}
                            onToggleMedication={toggleMedication}
                        />
                        <TestsSection
                            selectedTests={selectedTests}
                            onToggleTest={toggleTest}
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-4 mt-6 shrink-0">
                <button
                    onClick={() => setIsReportViewerOpen(true)}
                    className="flex items-center gap-3 px-8 py-3.5 bg-white border-2 border-[#7a9a7a] text-[#5a7a5a] font-semibold rounded-xl hover:bg-[#f5f7f5] transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#7a9a7a] focus:ring-offset-2"
                >
                    <FileText className="w-5 h-5" />
                    Reports
                </button>

                <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    disabled={!isTranscriptionStarted}
                    className={`flex items-center gap-3 px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#7a9a7a] focus:ring-offset-2 ${isTranscriptionStarted
                        ? 'bg-gradient-to-r from-[#5a7a5a] to-[#7a9a7a] text-white hover:from-[#4a6a4a] hover:to-[#6a8a6a] hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    Generate Prescription
                </button>

                <button
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-3.5 bg-white border-2 border-[#7a9a7a] text-[#5a7a5a] font-semibold rounded-xl hover:bg-[#f5f7f5] transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#7a9a7a] focus:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                </button>
            </div>

            <PrescriptionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                selectedMedications={selectedMedications}
                selectedTests={selectedTests}
                patientInfo={activePatient ? {
                    name: activePatient.name,
                    age: activePatient.age,
                    weight: activePatient.weight,
                    bp: activePatient.bp,
                    sugarLevel: activePatient.sugarLevel,
                    pastDiseases: activePatient.pastDiseases
                } : undefined}
                transcript={transcript}
                onApproveWorkflow={handleApproveWorkflow}
            />

            <AutonomousWorkflowModal
                isOpen={isWorkflowModalOpen}
                onClose={() => setIsWorkflowModalOpen(false)}
                executionState={workflowExecutionState}
                isAnalyzing={isAnalyzingWorkflow}
            />

            <ReportViewer
                isOpen={isReportViewerOpen}
                onClose={() => setIsReportViewerOpen(false)}
            />

            {/* History Modal */}
            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                patientInfo={activePatient}
            />
        </div>
    );
};

export default MainArea;