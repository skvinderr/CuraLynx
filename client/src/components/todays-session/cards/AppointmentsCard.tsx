import React from 'react';

// Define the Patient type right in your component file or a types.ts file
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

interface AppointmentsCardProps {
    patients: Patient[];
    isHovered: boolean;
    setIsHovered: (isHovered: boolean) => void;
    activePatient: Patient | undefined;
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ patients, isHovered, setIsHovered, activePatient }) => {
    const patientsToShow = isHovered ? patients : (activePatient ? [activePatient] : []);

    return (
        <div
            className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h3 className="text-lg font-bold text-gray-700 mb-4">Today's Appointments</h3>
            <div className={`space-y-3 overflow-y-auto transition-all duration-300 ${isHovered ? 'h-64' : 'h-20'}`}>
                {patientsToShow.map((patient) => (
                    <div
                        key={patient.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${patient.status === 'active'
                            ? 'bg-white text-gray-800 shadow-md'
                            : 'bg-white hover:bg-gray-50 opacity-60 hover:opacity-100'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{patient.name}</p>
                            <p className="text-sm">{patient.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentsCard;
