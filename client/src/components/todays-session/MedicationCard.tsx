import React from 'react';

interface MedicationCardProps {
    name: string;
    dosageOptions: string[];
    frequencyOptions: { value: string; label: string }[];
    defaultDosage: string;
    defaultFrequency: string;
    isSelected: boolean;
    onToggle: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
    name,
    dosageOptions,
    frequencyOptions,
    defaultDosage,
    defaultFrequency,
    isSelected,
    onToggle,
}) => {
    return (
        <div
            onClick={onToggle}
            className={`p-3 h-12 rounded-md cursor-pointer border transition-colors duration-150 flex items-center justify-between gap-2 ${
                isSelected
                    ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300/40 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
        >
            <div className="flex items-center gap-2 min-w-0">
                {isSelected ? (
                    <svg className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 flex-shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-800 truncate">{name}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <select
                    className="text-[11px] border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    onClick={(e) => e.stopPropagation()}
                    defaultValue={defaultDosage}
                >
                    {dosageOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    className="text-[11px] border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    onClick={(e) => e.stopPropagation()}
                    defaultValue={defaultFrequency}
                >
                    {frequencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MedicationCard;