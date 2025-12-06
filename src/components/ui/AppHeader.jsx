import React, { useState, useEffect } from 'react';

const AppHeader = ({
    currentView,
    statusText,
    startTime,
    advancedMode,
    onCustomizeClick,
    onHelpClick,
    onHistoryClick,
    onAdvancedClick,
    onCloseClick,
    onBackClick,
    onHideToggleClick,
    isClickThrough,
}) => {
    const [elapsedTime, setElapsedTime] = useState('0:00');

    useEffect(() => {
        if (!startTime || currentView !== 'assistant') {
            setElapsedTime('0:00');
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, currentView]);

    const renderLeftContent = () => {
        if (currentView === 'onboarding') return null;
        if (currentView === 'assistant') {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Session: {elapsedTime}</span>
                </div>
            );
        }
        return (
            <h1 className="text-lg font-semibold">Cheating Daddy</h1>
        );
    };

    const renderMiddleContent = () => {
        if (currentView === 'onboarding') return null;
        if (currentView === 'assistant') {
            return (
                <div className="flex-1 px-4 text-center">
                    <span className="text-sm text-muted">{statusText}</span>
                </div>
            );
        }
        return null;
    };

    const renderRightContent = () => {
        if (currentView === 'onboarding') return null;
        if (currentView === 'main') {
            return (
                <div className="flex gap-2 items-center">
                    <button
                        onClick={onCustomizeClick}
                        className="px-3 py-1.5 text-xs font-medium bg-button-background hover:bg-hover-background rounded border border-button-border transition-colors"
                        title="Customize settings"
                    >
                        ⚙️ Settings
                    </button>
                    <button
                        onClick={onHelpClick}
                        className="px-3 py-1.5 text-xs font-medium bg-button-background hover:bg-hover-background rounded border border-button-border transition-colors"
                        title="Get help"
                    >
                        ❓ Help
                    </button>
                    <button
                        onClick={onHistoryClick}
                        className="px-3 py-1.5 text-xs font-medium bg-button-background hover:bg-hover-background rounded border border-button-border transition-colors"
                        title="View history"
                    >
                        📋 History
                    </button>
                    {advancedMode && (
                        <button
                            onClick={onAdvancedClick}
                            className="px-3 py-1.5 text-xs font-medium bg-button-background hover:bg-hover-background rounded border border-button-border transition-colors"
                            title="Advanced settings"
                        >
                            🔧 Advanced
                        </button>
                    )}
                    <button
                        onClick={onCloseClick}
                        className="px-2 py-1.5 text-lg text-icon-button-color hover:text-white transition-colors"
                        title="Close application"
                    >
                        ✕
                    </button>
                </div>
            );
        }
        if (currentView === 'assistant') {
            return (
                <div className="flex gap-2 items-center">
                    <button
                        onClick={onHideToggleClick}
                        className="px-2 py-1.5 text-sm font-medium hover:opacity-75 transition-opacity"
                        title={isClickThrough ? 'Enable clicks' : 'Disable clicks'}
                    >
                        {isClickThrough ? '🔓' : '🔒'}
                    </button>
                    <button
                        onClick={onCloseClick}
                        className="px-2 py-1.5 text-lg text-icon-button-color hover:text-white transition-colors"
                        title="Stop session"
                    >
                        ✕
                    </button>
                </div>
            );
        }
        return (
            <button
                onClick={onBackClick}
                className="px-3 py-1.5 text-xs font-medium bg-button-background hover:bg-hover-background rounded border border-button-border transition-colors"
                title="Go back"
            >
                ← Back
            </button>
        );
    };

    if (currentView === 'onboarding') return null;

    return (
        <div className="w-full bg-header-background border-b border-dim px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center flex-1 min-w-0">
                {renderLeftContent()}
            </div>
            <div className="flex-1 flex items-center justify-center min-w-0">
                {renderMiddleContent()}
            </div>
            <div className="flex items-center gap-3">
                {renderRightContent()}
            </div>
        </div>
    );
};

export { AppHeader };
