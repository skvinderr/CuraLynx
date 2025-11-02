import React from 'react';

// Define the Patient type
interface Patient {
    id: number;
    name: string;
    time: string;
    status: 'active' | 'waiting';
    age: number;
    pastDiseases: string;
    weight: string;
    bp: string;
    sugarLevel: string;
}

interface PatientVitalsCardProps {
    activePatient: Patient | undefined;
}

const PatientVitalsCard: React.FC<PatientVitalsCardProps> = ({ activePatient }) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Active Patient Vitals</h3>
            {activePatient ? (
                <div className="space-y-3 text-sm">
                    <div>
                        <span className="font-semibold text-gray-600">Patient: </span>
                        {activePatient.name}
                    </div>
                    <div className="flex justify-between">
                        <div><span className="font-semibold text-gray-600">Age:</span> {activePatient.age}</div>
                        <div><span className="font-semibold text-gray-600">Weight:</span> {activePatient.weight}</div>
                    </div>
                    <div className="flex justify-between">
                        <div><span className="font-semibold text-gray-600">Blood Pressure:</span> {activePatient.bp}</div>
                        <div><span className="font-semibold text-gray-600">Glucose:</span> {activePatient.sugarLevel}</div>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Medical History: </span>
                        {activePatient.pastDiseases}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No active patient selected.</p>
            )}
        </div>
    );
};

export default PatientVitalsCard;
