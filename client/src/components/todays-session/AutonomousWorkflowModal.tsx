import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader, AlertCircle, X, Brain } from 'lucide-react';
import type { WorkflowExecutionState, WorkflowTask } from '../../services/clinicalWorkflowAgent';

interface AutonomousWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    executionState: WorkflowExecutionState | null;
    isAnalyzing: boolean;
}

const AutonomousWorkflowModal: React.FC<AutonomousWorkflowModalProps> = ({
    isOpen,
    onClose,
    executionState,
    isAnalyzing
}) => {
    const [displayedTasks, setDisplayedTasks] = useState<WorkflowTask[]>([]);

    useEffect(() => {
        if (executionState) {
            setDisplayedTasks(executionState.tasks);
        }
    }, [executionState]);

    if (!isOpen) return null;

    const getTaskIcon = (task: WorkflowTask) => {
        switch (task.status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'executing':
                return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
        }
    };

    const getTaskLabel = (task: WorkflowTask): string => {
        const typeLabels: Record<string, string> = {
            'prescription': '💊 E-Prescription',
            'referral': '📋 Referral Generation',
            'lab_order': '🧪 Lab Orders',
            'pharmacy_order': '🏥 Pharmacy Order',
            'scheduling': '📅 Schedule Follow-up'
        };
        return typeLabels[task.type] || task.type;
    };

    const totalTasks = displayedTasks.length;
    const completedTasks = displayedTasks.filter(t => t.status === 'completed').length;
    const failedTasks = displayedTasks.filter(t => t.status === 'failed').length;
    const isComplete = executionState && !executionState.isExecuting;
    const allSuccess = isComplete && failedTasks === 0;

    // Calculate execution time
    const executionTime = executionState?.endTime
        ? ((executionState.endTime - executionState.startTime) / 1000).toFixed(1)
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Clinical Agent: Executing Tasks</h2>
                            <p className="text-sm text-gray-600 mt-0.5">Autonomous workflow engine processing</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={!isComplete}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Analysis Phase */}
                    {isAnalyzing && (
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                                <div>
                                    <p className="font-semibold text-blue-900">Agent Reasoning...</p>
                                    <p className="text-sm text-blue-700 mt-1">Analyzing clinical plan and determining optimal workflow sequence</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Summary */}
                    {executionState && (
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                <p className="text-3xl font-bold text-blue-600">{completedTasks}</p>
                                <p className="text-sm text-blue-700 mt-1">Completed</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                <p className="text-3xl font-bold text-gray-600">{totalTasks - completedTasks - failedTasks}</p>
                                <p className="text-sm text-gray-700 mt-1">Remaining</p>
                            </div>
                            <div className={`p-4 rounded-lg border ${failedTasks > 0 ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
                                <p className={`text-3xl font-bold ${failedTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>{failedTasks}</p>
                                <p className={`text-sm mt-1 ${failedTasks > 0 ? 'text-red-700' : 'text-green-700'}`}>Failed</p>
                            </div>
                        </div>
                    )}

                    {/* Task Execution List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-4">Task Execution Queue</h3>

                        {displayedTasks.map((task, index) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg border transition-all duration-300 ${
                                    task.status === 'completed'
                                        ? 'bg-green-50 border-green-200'
                                        : task.status === 'executing'
                                            ? 'bg-blue-50 border-blue-300 shadow-md'
                                            : task.status === 'failed'
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getTaskIcon(task)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-800">
                                                <span className="text-gray-500 mr-2">{index + 1}.</span>
                                                {getTaskLabel(task)}
                                            </p>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                task.status === 'completed'
                                                    ? 'bg-green-200 text-green-800'
                                                    : task.status === 'executing'
                                                        ? 'bg-blue-200 text-blue-800'
                                                        : task.status === 'failed'
                                                            ? 'bg-red-200 text-red-800'
                                                            : 'bg-gray-200 text-gray-800'
                                            }`}>
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{task.description}</p>

                                        {/* Task Details */}
                                        {task.details && (
                                            <div className="mt-2 text-xs text-gray-500 bg-white/50 rounded p-2">
                                                {Object.entries(task.details).map(([key, value]) => {
                                                    if (Array.isArray(value)) {
                                                        return (
                                                            <p key={key}>
                                                                <span className="font-semibold">{key}:</span> {value.join(', ')}
                                                            </p>
                                                        );
                                                    }
                                                    return (
                                                        <p key={key}>
                                                            <span className="font-semibold">{key}:</span> {String(value)}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Result or Error Message */}
                                        {task.result && task.status === 'completed' && (
                                            <div className="mt-3 p-2 bg-green-100 rounded border border-green-300 text-xs text-green-800">
                                                <p className="font-semibold mb-1">✓ Success</p>
                                                <p>{task.result}</p>
                                            </div>
                                        )}

                                        {task.error && task.status === 'failed' && (
                                            <div className="mt-3 p-2 bg-red-100 rounded border border-red-300 text-xs text-red-800">
                                                <p className="font-semibold mb-1">✗ Error</p>
                                                <p>{task.error}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Completion Message */}
                    {isComplete && (
                        <div className={`mt-6 p-4 rounded-lg border ${
                            allSuccess
                                ? 'bg-green-50 border-green-300'
                                : 'bg-amber-50 border-amber-300'
                        }`}>
                            <div className="flex items-start gap-3">
                                {allSuccess ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <p className={`font-bold ${allSuccess ? 'text-green-900' : 'text-amber-900'}`}>
                                        {allSuccess ? '✓ Workflow Completed Successfully!' : '⚠ Workflow Completed with Issues'}
                                    </p>
                                    <p className={`text-sm mt-1 ${allSuccess ? 'text-green-800' : 'text-amber-800'}`}>
                                        {completedTasks} of {totalTasks} tasks completed
                                        {executionTime && ` in ${executionTime}s`}
                                    </p>
                                    <p className="text-xs mt-2 opacity-75">
                                        All clinical orders have been processed and are being handled by the respective systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        {isAnalyzing ? 'Agent analyzing clinical plan...' : isComplete ? 'Workflow execution complete' : 'Processing...'}
                    </p>
                    <button
                        onClick={onClose}
                        disabled={!isComplete}
                        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                            isComplete
                                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg'
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {isComplete ? 'Close & Finish' : 'Processing...'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutonomousWorkflowModal;
