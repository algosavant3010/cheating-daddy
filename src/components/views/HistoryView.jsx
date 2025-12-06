import React, { useState, useEffect } from 'react';

const HistoryView = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        // Load sessions from IndexedDB or localStorage
        try {
            const storedSessions = localStorage.getItem('sessions');
            if (storedSessions) {
                setSessions(JSON.parse(storedSessions));
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }, []);

    const handleDeleteSession = (sessionId) => {
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        setSessions(updatedSessions);
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
        if (selectedSession?.id === sessionId) {
            setSelectedSession(null);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (sessions.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <h2 className="text-lg font-semibold text-white mb-2">No Session History</h2>
                    <p className="text-gray-400">Your conversation history will appear here after you complete a session.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-5">
            <h2 className="text-2xl font-bold text-white mb-6">Session History</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sessions list */}
                <div className="md:col-span-1 space-y-2 max-h-96 overflow-y-auto">
                    {sessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                                selectedSession?.id === session.id
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            <div className="text-xs font-semibold uppercase tracking-wider">
                                {session.profile || 'Session'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {formatDate(session.timestamp)}
                            </div>
                            {session.duration && (
                                <div className="text-xs text-gray-500 mt-1">
                                    Duration: {session.duration}s
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Session details */}
                <div className="md:col-span-2">
                    {selectedSession ? (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {selectedSession.profile || 'Session'}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {formatDate(selectedSession.timestamp)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteSession(selectedSession.id)}
                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded text-xs font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {selectedSession.messages?.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg ${
                                            msg.role === 'user'
                                                ? 'bg-blue-500/10 border border-blue-500/20'
                                                : 'bg-gray-600/10 border border-gray-500/20'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold text-gray-300 mb-1 uppercase">
                                            {msg.role === 'user' ? 'You' : 'Assistant'}
                                        </div>
                                        <div className="text-sm text-gray-200 line-clamp-3">
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <p>Select a session to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { HistoryView };
