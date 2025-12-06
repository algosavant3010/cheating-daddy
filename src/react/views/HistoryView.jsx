import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { resizeLayout } from '../../utils/windowResize';

const HistoryShell = styled.div`
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        cursor: default;
        user-select: none;
    }

    & {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .history-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .tabs-container {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--button-border);
        padding-bottom: 8px;
    }

    .tab {
        background: transparent;
        color: var(--description-color);
        border: none;
        padding: 8px 16px;
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .tab:hover {
        background: var(--hover-background);
        color: var(--text-color);
    }

    .tab.active {
        background: var(--focus-box-shadow);
        color: var(--text-color);
        border-bottom: 2px solid var(--focus-border-color);
    }

    .sessions-list {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 16px;
        padding-bottom: 20px;
    }

    .session-item {
        background: var(--input-background);
        border: 1px solid var(--button-border);
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .session-item:hover {
        background: var(--hover-background);
        border-color: var(--focus-border-color);
    }

    .session-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }

    .session-date {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-color);
    }

    .session-time {
        font-size: 11px;
        color: var(--description-color);
    }

    .session-preview {
        font-size: 11px;
        color: var(--description-color);
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .conversation-view {
        flex: 1;
        overflow-y: auto;
        background: var(--main-content-background);
        border: 1px solid var(--button-border);
        border-radius: 6px;
        padding: 12px;
        padding-bottom: 20px;
        user-select: text;
        cursor: text;
    }

    .message {
        margin-bottom: 6px;
        padding: 6px 10px;
        border-left: 3px solid transparent;
        font-size: 12px;
        line-height: 1.4;
        background: var(--input-background);
        border-radius: 0 4px 4px 0;
        user-select: text;
        cursor: text;
    }

    .message.user {
        border-left-color: #5865f2;
    }

    .message.ai {
        border-left-color: #ed4245;
    }

    .back-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .back-button {
        background: var(--button-background);
        color: var(--text-color);
        border: 1px solid var(--button-border);
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s ease;
    }

    .back-button:hover {
        background: var(--hover-background);
    }

    .legend {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--description-color);
    }

    .legend-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .legend-dot.user {
        background-color: #5865f2;
    }

    .legend-dot.ai {
        background-color: #ed4245;
    }

    .empty-state {
        text-align: center;
        color: var(--description-color);
        font-size: 12px;
        margin-top: 32px;
    }

    .empty-state-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
        color: var(--text-color);
    }

    .loading {
        text-align: center;
        color: var(--description-color);
        font-size: 12px;
        margin-top: 32px;
    }

    .saved-response-item {
        background: var(--input-background);
        border: 1px solid var(--button-border);
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        transition: all 0.15s ease;
    }

    .saved-response-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
    }

    .saved-response-profile {
        font-size: 11px;
        font-weight: 600;
        color: var(--focus-border-color);
        text-transform: capitalize;
    }

    .saved-response-date {
        font-size: 10px;
        color: var(--description-color);
    }

    .saved-response-content {
        font-size: 12px;
        color: var(--text-color);
        line-height: 1.4;
        user-select: text;
        cursor: text;
    }

    .delete-button {
        background: transparent;
        color: var(--description-color);
        border: none;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .delete-button:hover {
        background: rgba(255, 0, 0, 0.1);
        color: #ff4444;
    }
`;

const profileNames = {
    interview: 'Job Interview',
    sales: 'Sales Call',
    meeting: 'Business Meeting',
    presentation: 'Presentation',
    negotiation: 'Negotiation',
    exam: 'Exam Assistant',
};

const HistoryView = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sessions');
    const [savedResponses, setSavedResponses] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedResponses') || '[]');
        } catch (error) {
            console.error('Failed to parse saved responses:', error);
            return [];
        }
    });

    useEffect(() => {
        resizeLayout();
    }, []);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                setLoading(true);
                const allSessions = (await window.cheddar?.getAllConversationSessions?.()) || [];
                setSessions(allSessions);
            } catch (error) {
                console.error('Error loading conversation sessions:', error);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };
        loadSessions();
    }, []);

    const handleSessionClick = session => {
        setSelectedSession(session);
    };

    const handleBackClick = () => {
        setSelectedSession(null);
    };

    const handleTabClick = tab => {
        setActiveTab(tab);
        if (tab === 'sessions') {
            setSelectedSession(null);
        }
    };

    const deleteSavedResponse = index => {
        setSavedResponses(prev => {
            const updated = prev.filter((_, idx) => idx !== index);
            localStorage.setItem('savedResponses', JSON.stringify(updated));
            return updated;
        });
    };

    const formatDate = timestamp => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = timestamp => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatTimestamp = timestamp => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getSessionPreview = session => {
        if (!session.conversationHistory || session.conversationHistory.length === 0) {
            return 'No conversation yet';
        }
        const firstTurn = session.conversationHistory[0];
        const preview = firstTurn.transcription || firstTurn.ai_response || 'Empty conversation';
        return preview.length > 100 ? `${preview.substring(0, 100)}...` : preview;
    };

    const conversationMessages = useMemo(() => {
        if (!selectedSession || !selectedSession.conversationHistory) {
            return [];
        }
        return selectedSession.conversationHistory.flatMap(turn => {
            const messages = [];
            if (turn.transcription) {
                messages.push({ type: 'user', text: turn.transcription, timestamp: turn.timestamp });
            }
            if (turn.ai_response) {
                messages.push({ type: 'ai', text: turn.ai_response, timestamp: turn.timestamp });
            }
            return messages;
        });
    }, [selectedSession]);

    const renderSessionsList = () => {
        if (loading) {
            return <div className="loading">Loading conversation history...</div>;
        }
        if (sessions.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-title">No conversations yet</div>
                    <div>Start a session to see your conversation history here</div>
                </div>
            );
        }
        return (
            <div className="sessions-list">
                {sessions.map(session => (
                    <div key={session.sessionId} className="session-item" onClick={() => handleSessionClick(session)}>
                        <div className="session-header">
                            <div className="session-date">{formatDate(session.timestamp)}</div>
                            <div className="session-time">{formatTime(session.timestamp)}</div>
                        </div>
                        <div className="session-preview">{getSessionPreview(session)}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderSavedResponses = () => {
        if (savedResponses.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-title">No saved responses</div>
                    <div>Use the save button during conversations to save important responses</div>
                </div>
            );
        }
        return (
            <div className="sessions-list">
                {savedResponses.map((saved, index) => (
                    <div key={`${saved.timestamp}-${index}`} className="saved-response-item">
                        <div className="saved-response-header">
                            <div>
                                <div className="saved-response-profile">{profileNames[saved.profile] || saved.profile}</div>
                                <div className="saved-response-date">{formatTimestamp(saved.timestamp)}</div>
                            </div>
                            <button className="delete-button" type="button" onClick={() => deleteSavedResponse(index)} title="Delete saved response">
                                <svg width="16px" height="16px" strokeWidth="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="saved-response-content">{saved.response}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <HistoryShell>
            <div className="history-container">
                <div className="tabs-container">
                    <button className={`tab${activeTab === 'sessions' ? ' active' : ''}`} onClick={() => handleTabClick('sessions')} type="button">
                        Sessions
                    </button>
                    <button className={`tab${activeTab === 'saved' ? ' active' : ''}`} onClick={() => handleTabClick('saved')} type="button">
                        Saved Responses
                    </button>
                </div>

                {selectedSession ? (
                    <div className="conversation-view">
                        <div className="back-header">
                            <button className="back-button" onClick={handleBackClick} type="button">
                                ← Back to Sessions
                            </button>
                            <div className="legend">
                                <span className="legend-item">
                                    <span className="legend-dot user"></span>Interviewee
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot ai"></span>AI Response
                                </span>
                            </div>
                        </div>
                        {conversationMessages.length === 0 ? (
                            <div className="empty-state">
                                <div>No conversation turns recorded yet.</div>
                            </div>
                        ) : (
                            conversationMessages.map((message, idx) => (
                                <div key={`${message.timestamp}-${idx}`} className={`message ${message.type}`}>
                                    {message.text}
                                </div>
                            ))
                        )}
                    </div>
                ) : activeTab === 'sessions' ? (
                    renderSessionsList()
                ) : (
                    renderSavedResponses()
                )}
            </div>
        </HistoryShell>
    );
};

export default HistoryView;
