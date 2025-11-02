/* eslint-disable */
// @ts-nocheck
import React from 'react';
import MedicationCard from './MedicationCard';
import { useSession } from '../../contexts/SessionContext';
import { Sparkles } from 'lucide-react';

interface MedicationData {
    id: string;
    name: string;
    dosageOptions: string[];
    frequencyOptions: { value: string; label: string }[];
    defaultDosage: string;
    defaultFrequency: string;
    isAIRecommended?: boolean;
    aiReason?: string;
}

interface MedicationsSectionProps {
    selectedMedications: string[];
    onToggleMedication: (medication: string) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({
    selectedMedications,
    onToggleMedication
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<MedicationData[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const { recommendations, isLoadingRecommendations } = useSession();

    const medications: MedicationData[] = [
        {
            id: 'Paracetamol 500mg',
            name: 'Paracetamol',
            dosageOptions: ['250mg', '500mg', '650mg'],
            frequencyOptions: [
                { value: 'once-daily', label: 'Once daily' },
                { value: 'twice-daily', label: 'Twice daily' },
                { value: 'thrice-daily', label: 'Thrice daily' },
                { value: 'as-needed', label: 'As needed' }
            ],
            defaultDosage: '500mg',
            defaultFrequency: 'twice-daily'
        },
        {
            id: 'Ibuprofen 400mg',
            name: 'Ibuprofen',
            dosageOptions: ['200mg', '400mg', '600mg'],
            frequencyOptions: [
                { value: 'once-daily', label: 'Once daily' },
                { value: 'twice-daily', label: 'Twice daily' },
                { value: 'thrice-daily', label: 'Thrice daily' },
                { value: 'as-needed', label: 'As needed' },
                { value: 'every-6-hours', label: 'Every 6 hours' }
            ],
            defaultDosage: '400mg',
            defaultFrequency: 'as-needed'
        },
        {
            id: 'Vitamin D3',
            name: 'Vitamin D3',
            dosageOptions: ['400 IU', '1000 IU', '2000 IU'],
            frequencyOptions: [
                { value: 'once-daily', label: 'Once daily' },
                { value: 'twice-daily', label: 'Twice daily' },
                { value: 'weekly', label: 'Once weekly' }
            ],
            defaultDosage: '1000IU',
            defaultFrequency: 'once-daily'
        },
        {
            id: 'Omeprazole 20mg',
            name: 'Omeprazole',
            dosageOptions: ['10mg', '20mg', '40mg'],
            frequencyOptions: [
                { value: 'once-daily', label: 'Once daily' },
                { value: 'twice-daily', label: 'Twice daily' },
                { value: 'before-meals', label: 'Before meals' },
                { value: 'after-meals', label: 'After meals' },
                { value: 'empty-stomach', label: 'Empty stomach' }
            ],
            defaultDosage: '20mg',
            defaultFrequency: 'before-meals'
        },
        {
            id: 'Cetirizine 10mg',
            name: 'Cetirizine',
            dosageOptions: ['5mg', '10mg'],
            frequencyOptions: [
                { value: 'once-daily', label: 'Once daily' },
                { value: 'twice-daily', label: 'Twice daily' },
                { value: 'as-needed', label: 'As needed' },
                { value: 'at-bedtime', label: 'At bedtime' }
            ],
            defaultDosage: '10mg',
            defaultFrequency: 'once-daily'
        }
    ];

    // Dummy database search function
    const searchMedicationsFromDB = React.useCallback((query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Simulate API call delay
        setTimeout(() => {
            // Dummy database with more medications
            const dummyDB: MedicationData[] = [
                ...medications,
                {
                    id: 'Amoxicillin 500mg',
                    name: 'Amoxicillin',
                    dosageOptions: ['250mg', '500mg', '875mg'],
                    frequencyOptions: [
                        { value: 'twice-daily', label: 'Twice daily' },
                        { value: 'thrice-daily', label: 'Thrice daily' }
                    ],
                    defaultDosage: '500mg',
                    defaultFrequency: 'thrice-daily'
                },
                {
                    id: 'Metformin 500mg',
                    name: 'Metformin',
                    dosageOptions: ['500mg', '850mg', '1000mg'],
                    frequencyOptions: [
                        { value: 'once-daily', label: 'Once daily' },
                        { value: 'twice-daily', label: 'Twice daily' },
                        { value: 'with-meals', label: 'With meals' }
                    ],
                    defaultDosage: '500mg',
                    defaultFrequency: 'twice-daily'
                },
                {
                    id: 'Aspirin 75mg',
                    name: 'Aspirin',
                    dosageOptions: ['75mg', '100mg', '325mg'],
                    frequencyOptions: [
                        { value: 'once-daily', label: 'Once daily' },
                        { value: 'twice-daily', label: 'Twice daily' }
                    ],
                    defaultDosage: '75mg',
                    defaultFrequency: 'once-daily'
                },
                {
                    id: 'Losartan 50mg',
                    name: 'Losartan',
                    dosageOptions: ['25mg', '50mg', '100mg'],
                    frequencyOptions: [
                        { value: 'once-daily', label: 'Once daily' },
                        { value: 'twice-daily', label: 'Twice daily' }
                    ],
                    defaultDosage: '50mg',
                    defaultFrequency: 'once-daily'
                },
                {
                    id: 'Atorvastatin 10mg',
                    name: 'Atorvastatin',
                    dosageOptions: ['10mg', '20mg', '40mg', '80mg'],
                    frequencyOptions: [
                        { value: 'once-daily', label: 'Once daily' },
                        { value: 'at-bedtime', label: 'At bedtime' }
                    ],
                    defaultDosage: '10mg',
                    defaultFrequency: 'at-bedtime'
                },
                {
                    id: 'Azithromycin 250mg',
                    name: 'Azithromycin',
                    dosageOptions: ['250mg', '500mg'],
                    frequencyOptions: [
                        { value: 'once-daily', label: 'Once daily' },
                        { value: 'course', label: '3-5 day course' }
                    ],
                    defaultDosage: '250mg',
                    defaultFrequency: 'once-daily'
                }
            ];

            // Search in dummy DB
            const results = dummyDB.filter(med =>
                med.name.toLowerCase().includes(query.toLowerCase())
            );

            setSearchResults(results);
            setIsSearching(false);
        }, 500);
    }, [medications]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            searchMedicationsFromDB(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchMedicationsFromDB]);

    // Merge AI recommendations with static medications
    const aiMedications: MedicationData[] = React.useMemo(() => {
        return recommendations.medications.map(med => ({
            id: `${med.name} ${med.dosage}`,
            name: med.name,
            dosageOptions: [med.dosage],
            frequencyOptions: [{ value: med.frequency, label: med.frequency }],
            defaultDosage: med.dosage,
            defaultFrequency: med.frequency,
            isAIRecommended: true,
            aiReason: med.reason
        }));
    }, [recommendations.medications]);

    const allMedications = [...aiMedications, ...medications];
    const displayMedications = searchQuery.trim() ? searchResults : allMedications;

    // Show cards only when AI has recommendations or search is active
    const shouldShowCards = aiMedications.length > 0 || searchQuery.trim();

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-base font-semibold text-gray-700">Recommended Medications</h3>
                {isLoadingRecommendations && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>AI analyzing...</span>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200 overflow-y-auto">
                {/* Search Bar */}
                <div className="mb-3 sticky top-0 bg-white/90 backdrop-blur-sm z-10 pb-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search medications from database..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-xs text-gray-500 mt-1">
                            Found {displayMedications.length} result{displayMedications.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* AI Recommendations Section */}
                {aiMedications.length > 0 && !searchQuery && (
                    <div className="mb-4 pb-4 border-b border-blue-200 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-600">AI Recommendations</h4>
                        </div>
                        <div className="space-y-2.5">
                            {aiMedications.map((medication, index) => (
                                <div
                                    key={medication.id}
                                    className="animate-in fade-in slide-in-from-left-4 duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <MedicationCard
                                        name={medication.name}
                                        dosageOptions={medication.dosageOptions}
                                        frequencyOptions={medication.frequencyOptions}
                                        defaultDosage={medication.defaultDosage}
                                        defaultFrequency={medication.defaultFrequency}
                                        isSelected={selectedMedications.includes(medication.id)}
                                        onToggle={() => onToggleMedication(medication.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Static Medications - Only show when AI has recommendations or search is active */}
                {shouldShowCards && (
                    <div className="space-y-2.5 pb-16">
                        {(searchQuery ? displayMedications : medications).map((medication) => (
                            <MedicationCard
                                key={medication.id}
                                name={medication.name}
                                dosageOptions={medication.dosageOptions}
                                frequencyOptions={medication.frequencyOptions}
                                defaultDosage={medication.defaultDosage}
                                defaultFrequency={medication.defaultFrequency}
                                isSelected={selectedMedications.includes(medication.id)}
                                onToggle={() => onToggleMedication(medication.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicationsSection;