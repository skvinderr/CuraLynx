/* eslint-disable */
// @ts-nocheck
import MainArea from '@/components/todays-session/MainArea'
import Sidebar from '@/components/todays-session/Sidebar'
import { SessionProvider } from '@/contexts/SessionContext'

const SessionPage = () => {
    return (
        <SessionProvider>
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