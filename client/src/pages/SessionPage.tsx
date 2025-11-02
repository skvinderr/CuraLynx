/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from 'react'
import MainArea from '@/components/todays-session/MainArea'
import Sidebar from '@/components/todays-session/Sidebar'
import { SessionProvider } from '@/contexts/SessionContext'
import Joyride, { STATUS } from 'react-joyride'

const SessionPage = () => {
    const [runTour, setRunTour] = useState(false);

    // Check if user has seen the tour before
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('sessionPageTourCompleted');
        if (!hasSeenTour) {
            // Start tour after a short delay
            setTimeout(() => setRunTour(true), 1500);
        }
    }, []);

    const tourSteps: any[] = [
        {
            target: 'body',
            content: (
                <div>
                    <h2 className="text-lg font-bold mb-2" style={{ color: '#5a7a5a' }}>Welcome to the Consultation Session! 🎙️</h2>
                    <p className="text-sm text-gray-600">
                        Our AI agent is ready to assist you during the patient consultation.
                    </p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '.live-transcription-card',
            content: (
                <div>
                    <h3 className="text-base font-bold mb-2" style={{ color: '#5a7a5a' }}>Start Talking! 💬</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        The microphone is already active and listening to your conversation.
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Act as a doctor or patient</strong> and start talking naturally. The AI will transcribe everything in real-time!
                    </p>
                </div>
            ),
            placement: 'right',
        },
        {
            target: '.recommendations-area',
            content: (
                <div>
                    <h3 className="text-base font-bold mb-2" style={{ color: '#5a7a5a' }}>AI Recommendations ✨</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Our AI agent is <strong>passively listening</strong> to your conversation.
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Based on the symptoms and discussion, it will automatically suggest:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 list-disc space-y-1">
                        <li>Relevant medications with dosages</li>
                        <li>Necessary diagnostic tests</li>
                        <li>Treatment recommendations</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                        The recommendations will appear here shortly after you start talking!
                    </p>
                </div>
            ),
            placement: 'left',
        },
    ];

    const handleJoyrideCallback = (data: any) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            localStorage.setItem('sessionPageTourCompleted', 'true');
        }
    };

    return (
        <SessionProvider>
            <Joyride
                steps={tourSteps}
                run={runTour}
                continuous
                showProgress
                showSkipButton
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        primaryColor: '#5a7a5a',
                        zIndex: 10000,
                    },
                    buttonNext: {
                        backgroundColor: '#6a8a6a',
                        borderRadius: '8px',
                        padding: '8px 16px',
                    },
                    buttonBack: {
                        color: '#5a7a5a',
                        marginRight: '10px',
                    },
                    buttonSkip: {
                        color: '#8a8a8a',
                    },
                }}
            />
            <div className="flex h-screen w-screen overflow-hidden">
                <div className="w-1/4 h-full overflow-y-auto">
                    <Sidebar />
                </div>
                <div className="flex-1 h-full overflow-y-auto">
                    <MainArea />
                </div>
            </div>
        </SessionProvider>
    )
}

export default SessionPage