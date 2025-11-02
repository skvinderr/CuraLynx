/* eslint-disable */
// @ts-nocheck
import React from 'react';
import TestCard from './TestCard';
import { useSession } from '../../contexts/SessionContext';
import { Sparkles } from 'lucide-react';

interface TestsSectionProps {
    selectedTests: string[];
    onToggleTest: (test: string) => void;
}

const TestsSection: React.FC<TestsSectionProps> = ({
    selectedTests,
    onToggleTest
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<string[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const { recommendations, isLoadingRecommendations } = useSession();

    const tests = [
        'Complete Blood Count (CBC)',
        'Blood Sugar (Fasting)',
        'Lipid Profile',
        'Thyroid Function Test',
        'Chest X-Ray',
        'ECG'
    ];

    // Dummy database search function
    const searchTestsFromDB = React.useCallback((query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Simulate API call delay
        setTimeout(() => {
            // Dummy database with more tests
            const dummyDB = [
                ...tests,
                'Liver Function Test (LFT)',
                'Kidney Function Test (KFT)',
                'Hemoglobin A1c (HbA1c)',
                'Vitamin D Test',
                'Vitamin B12 Test',
                'Uric Acid Test',
                'ESR (Erythrocyte Sedimentation Rate)',
                'CRP (C-Reactive Protein)',
                'Ultrasound Abdomen',
                'MRI Brain',
                'CT Scan Chest',
                'Stress Test (TMT)',
                'Echocardiography',
                'Pulmonary Function Test',
                'Colonoscopy',
                'Mammography',
                'PSA (Prostate-Specific Antigen)',
                'Stool Culture',
                'Urine Culture',
                'Blood Culture',
                'HIV Test',
                'Hepatitis B Surface Antigen',
                'Hepatitis C Antibody'
            ];

            // Search in dummy DB
            const results = dummyDB.filter(test =>
                test.toLowerCase().includes(query.toLowerCase())
            );

            setSearchResults(results);
            setIsSearching(false);
        }, 500);
    }, [tests]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            searchTestsFromDB(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchTestsFromDB]);

    // Add AI recommended tests
    const aiTests = recommendations.tests.map(t => t.name);
    const allTests = [...aiTests, ...tests];
    const displayTests = searchQuery.trim() ? searchResults : allTests;

    // Show cards only when AI has recommendations or search is active
    const shouldShowCards = aiTests.length > 0 || searchQuery.trim();

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-base font-semibold text-gray-700">Recommended Tests</h3>
                {isLoadingRecommendations && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>AI analyzing...</span>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow border border-gray-200 overflow-y-auto">
                {/* Show loading state when no AI recommendations yet and no search query */}
                {aiTests.length === 0 && !searchQuery ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <div className="relative">
                            <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                            <div className="absolute inset-0 animate-ping">
                                <Sparkles className="w-12 h-12 text-blue-300 opacity-75" />
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">
                            AI is analyzing recommendations...
                        </p>
                        <div className="flex gap-1 mt-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="mb-3 sticky top-0 bg-white/90 backdrop-blur-sm z-10 pb-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tests from database..."
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
                                    Found {displayTests.length} result{displayTests.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* AI Recommendations Section */}
                        {aiTests.length > 0 && !searchQuery && (
                    <div className="mb-4 pb-4 border-b border-blue-200 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-600">AI Recommendations</h4>
                        </div>
                        <div className="space-y-2.5">
                            {recommendations.tests.map((test, index) => (
                                <div
                                    key={test.name}
                                    className="animate-in fade-in slide-in-from-left-4 duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <TestCard
                                        name={test.name}
                                        isSelected={selectedTests.includes(test.name)}
                                        onToggle={() => onToggleTest(test.name)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {shouldShowCards && (
                    <div className="space-y-2.5 pb-16">
                        {(searchQuery ? displayTests : tests).map((test) => (
                            <TestCard
                                key={test}
                                name={test}
                                isSelected={selectedTests.includes(test)}
                                onToggle={() => onToggleTest(test)}
                            />
                        ))}
                    </div>
                )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TestsSection;