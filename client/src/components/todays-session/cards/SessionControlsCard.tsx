/* eslint-disable */
// @ts-nocheck

const SessionControlsCard = () => {
    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-md mb-3">Session Controls</h3>
            <div className="flex flex-col space-y-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Start Session</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">End Session</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Add Note</button>
            </div>
        </div>
    );
};

export default SessionControlsCard;
