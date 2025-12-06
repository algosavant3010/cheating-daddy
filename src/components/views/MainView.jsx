import React, { useState, useEffect, useRef } from 'react';

const MainView = ({ onStart, onAPIKeyHelp, onLayoutModeChange }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
    const [isInitializing, setIsInitializing] = useState(false);
    const [showApiKeyError, setShowApiKeyError] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleSessionInitializing = (isInitializing) => {
            setIsInitializing(isInitializing);
        };

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.on('session-initializing', (_, isInitializing) => {
                    handleSessionInitializing(isInitializing);
                });

                return () => {
                    ipcRenderer.removeAllListeners('session-initializing');
                };
            } catch (error) {
                console.error('IPC setup error:', error);
            }
        }

        // Load layout mode on startup
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            onLayoutModeChange(savedLayoutMode);
        }
    }, [onLayoutModeChange]);

    useEffect(() => {
        const handleKeydown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isStartShortcut = isMac ? e.metaKey && e.key === 'Enter' : e.ctrlKey && e.key === 'Enter';

            if (isStartShortcut) {
                e.preventDefault();
                handleStartClick();
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [isInitializing]);

    const handleInput = (e) => {
        const value = e.target.value;
        setApiKey(value);
        localStorage.setItem('apiKey', value);
        if (showApiKeyError) {
            setShowApiKeyError(false);
        }
    };

    const handleStartClick = () => {
        if (isInitializing) return;
        onStart();
    };

    const triggerApiKeyError = () => {
        setShowApiKeyError(true);
        setTimeout(() => {
            setShowApiKeyError(false);
        }, 1000);
    };

    const getStartButtonIcon = () => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        return isMac ? '⌘ + Enter' : 'Ctrl + Enter';
    };

    return (
        <div className="h-full flex flex-col w-full max-w-md">
            <div className="text-2xl font-semibold mb-2 mt-auto">Welcome</div>

            <div className="flex gap-3 mb-5">
                <input
                    ref={inputRef}
                    type="password"
                    placeholder="Enter your Gemini API Key"
                    value={apiKey}
                    onChange={handleInput}
                    className={`flex-1 bg-input-background text-text-color border border-button-border px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-focus-border-color focus:bg-input-focus-background focus:ring-3 focus:ring-focus-box-shadow placeholder:text-placeholder-color ${
                        showApiKeyError ? 'api-key-error' : ''
                    }`}
                />
                <button
                    onClick={handleStartClick}
                    disabled={isInitializing}
                    className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 bg-start-button-background text-start-button-color border border-start-button-border rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-start-button-hover-background hover:border-start-button-hover-border disabled:opacity-50 disabled:hover:bg-start-button-background disabled:hover:border-start-button-border disabled:hover:text-start-button-color ${
                        isInitializing ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    Start
                </button>
            </div>

            <p className="text-description-color text-sm mb-6 leading-relaxed">
                don't have an api key?{' '}
                <button
                    onClick={onAPIKeyHelp}
                    className="text-link-color underline hover:opacity-80 transition-opacity bg-transparent border-0 p-0 cursor-pointer"
                >
                    get one here
                </button>
            </p>

            <div className="text-description-color text-xs opacity-75 mt-auto pb-2">
                Press {getStartButtonIcon()} to start session
            </div>
        </div>
    );
};

export { MainView };
