import { GoogleGenerativeAI } from "@google/generative-ai";

// Type definitions for the workflow
export interface WorkflowTask {
    id: string;
    type: 'prescription' | 'referral' | 'lab_order' | 'pharmacy_order' | 'scheduling';
    description: string;
    details: any;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    result?: string;
    error?: string;
}

export interface WorkflowPlan {
    reasoning: string;
    tasks: WorkflowTask[];
    estimatedDuration: number;
}

export interface WorkflowExecutionState {
    isExecuting: boolean;
    currentTaskIndex: number;
    tasks: WorkflowTask[];
    completedCount: number;
    failedCount: number;
    startTime: number;
    endTime?: number;
}

// Tool implementations (can be replaced with real API calls)
const tools = {
    ePrescribe: async (patientId: string, medication: string, dosage: string, duration: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            success: true,
            prescriptionId: `RX-${Date.now()}`,
            message: `Prescription for ${medication} ${dosage} sent to patient's pharmacy record. Duration: ${duration}`,
            timestamp: new Date().toISOString()
        };
    },

    generateReferral: async (patientId: string, referralDoctor: string, specialty: string, reason: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1800));
        return {
            success: true,
            referralId: `REF-${Date.now()}`,
            message: `Referral letter generated and faxed to Dr. ${referralDoctor} (${specialty}). Reason: ${reason}`,
            timestamp: new Date().toISOString()
        };
    },

    orderLabs: async (patientId: string, tests: string[], facility: string = 'Quest') => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            success: true,
            orderId: `LAB-${Date.now()}`,
            message: `Lab orders for ${tests.join(', ')} sent to ${facility}. Patient notified.`,
            timestamp: new Date().toISOString()
        };
    },

    sendPharmacyOrder: async (patientId: string, medications: string[], pharmacy: string = 'Default Pharmacy') => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1600));
        return {
            success: true,
            orderId: `PHARM-${Date.now()}`,
            message: `Pharmacy order for ${medications.join(', ')} sent to ${pharmacy}. Ready for pickup.`,
            timestamp: new Date().toISOString()
        };
    },

    scheduleFollowUp: async (patientId: string, followUpDate: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1400));
        return {
            success: true,
            appointmentId: `APT-${Date.now()}`,
            message: `Follow-up appointment scheduled for ${followUpDate}. Reminder sent to patient.`,
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Parse the Plan section from SOAP notes to extract clinical tasks
 */
export async function parsePlanToTasks(
    planText: string,
    medications: string[],
    tests: string[],
    patientInfo?: any
): Promise<WorkflowPlan> {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.warn('Gemini API key not found');
            return generateDefaultPlan(planText, medications, tests, patientInfo);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.3, // Lower temperature for structured output
                topP: 0.9,
            }
        });

        const prompt = `You are a clinical workflow analyzer. Parse this plan from a SOAP note and identify actionable tasks.

Plan Text:
${planText}

Selected Medications: ${medications.join(', ')}
Selected Tests: ${tests.join(', ')}

Based on this plan and selections, identify specific workflow tasks in JSON format. Return ONLY valid JSON:

{
    "reasoning": "Brief explanation of identified tasks",
    "tasks": [
        {
            "type": "prescription|referral|lab_order|pharmacy_order|scheduling",
            "description": "Clear description",
            "details": {
                "medication": "if prescription",
                "dosage": "if prescription",
                "duration": "if prescription",
                "doctor": "if referral",
                "specialty": "if referral",
                "tests": ["array of tests if lab order"],
                "date": "if scheduling"
            }
        }
    ]
}

IMPORTANT: Return ONLY the JSON object, no markdown or extra text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return generateDefaultPlan(planText, medications, tests, patientInfo);
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Convert parsed tasks to WorkflowTask format
        const tasks: WorkflowTask[] = parsed.tasks.map((task: any, index: number) => ({
            id: `task-${index + 1}`,
            type: task.type,
            description: task.description,
            details: task.details,
            status: 'pending' as const
        }));

        return {
            reasoning: parsed.reasoning || "Clinical workflow analysis",
            tasks,
            estimatedDuration: tasks.length * 2000 + 1000 // Rough estimate in ms
        };
    } catch (error) {
        console.error('Error parsing plan:', error);
        return generateDefaultPlan(planText, medications, tests, patientInfo);
    }
}

/**
 * Generate a default plan if AI fails
 */
function generateDefaultPlan(
    planText: string,
    medications: string[],
    tests: string[],
    patientInfo?: any
): WorkflowPlan {
    const tasks: WorkflowTask[] = [];

    // Add prescription tasks
    medications.forEach((med, index) => {
        tasks.push({
            id: `task-${tasks.length + 1}`,
            type: 'prescription',
            description: `Prescription for ${med}`,
            details: {
                medication: med,
                dosage: '1-0-1', // Default
                duration: '5 days' // Default
            },
            status: 'pending'
        });
    });

    // Add pharmacy order task
    if (medications.length > 0) {
        tasks.push({
            id: `task-${tasks.length + 1}`,
            type: 'pharmacy_order',
            description: `Send pharmacy order for ${medications.length} medication(s)`,
            details: {
                medications: medications,
                pharmacy: 'Default Pharmacy'
            },
            status: 'pending'
        });
    }

    // Add lab order task
    if (tests.length > 0) {
        tasks.push({
            id: `task-${tasks.length + 1}`,
            type: 'lab_order',
            description: `Order labs: ${tests.join(', ')}`,
            details: {
                tests: tests,
                facility: 'Quest'
            },
            status: 'pending'
        });
    }

    // Add follow-up scheduling
    tasks.push({
        id: `task-${tasks.length + 1}`,
        type: 'scheduling',
        description: 'Schedule follow-up appointment',
        details: {
            date: getFollowUpDate(7) // Default 1 week
        },
        status: 'pending'
    });

    return {
        reasoning: "Standard clinical workflow based on medications and tests",
        tasks,
        estimatedDuration: tasks.length * 2000
    };
}

function getFollowUpDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Execute the workflow tasks sequentially
 */
export async function executeWorkflow(
    plan: WorkflowPlan,
    patientId: string,
    onProgress: (state: WorkflowExecutionState) => void
): Promise<WorkflowExecutionState> {
    const startTime = Date.now();
    let executionState: WorkflowExecutionState = {
        isExecuting: true,
        currentTaskIndex: 0,
        tasks: plan.tasks.map(t => ({ ...t, status: 'pending' as const })),
        completedCount: 0,
        failedCount: 0,
        startTime
    };

    // Execute each task
    for (let i = 0; i < plan.tasks.length; i++) {
        const task = executionState.tasks[i];
        task.status = 'executing';
        executionState.currentTaskIndex = i;

        onProgress({ ...executionState });

        try {
            let result;

            // Execute based on task type
            switch (task.type) {
                case 'prescription':
                    result = await tools.ePrescribe(
                        patientId,
                        task.details.medication,
                        task.details.dosage,
                        task.details.duration
                    );
                    break;

                case 'referral':
                    result = await tools.generateReferral(
                        patientId,
                        task.details.doctor,
                        task.details.specialty,
                        task.details.reason
                    );
                    break;

                case 'lab_order':
                    result = await tools.orderLabs(
                        patientId,
                        task.details.tests,
                        task.details.facility
                    );
                    break;

                case 'pharmacy_order':
                    result = await tools.sendPharmacyOrder(
                        patientId,
                        task.details.medications,
                        task.details.pharmacy
                    );
                    break;

                case 'scheduling':
                    result = await tools.scheduleFollowUp(
                        patientId,
                        task.details.date
                    );
                    break;

                default:
                    throw new Error(`Unknown task type: ${task.type}`);
            }

            task.status = 'completed';
            task.result = result.message;
            executionState.completedCount++;
        } catch (error) {
            task.status = 'failed';
            task.error = error instanceof Error ? error.message : 'Unknown error';
            executionState.failedCount++;
        }

        onProgress({ ...executionState });
    }

    executionState.isExecuting = false;
    executionState.endTime = Date.now();

    return executionState;
}
