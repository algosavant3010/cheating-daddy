import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import AppHeader from './components/AppHeader';
import MainView from './views/MainView';
import CustomizeView from './views/CustomizeView';
import HelpView from './views/HelpView';
import HistoryView from './views/HistoryView';
import AssistantView from './views/AssistantView';
import OnboardingView from './views/OnboardingView';
import AdvancedView from './views/AdvancedView';

const AppShell = styled.div`
    & * {
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0;
        padding: 0;
        cursor: default;
        user-select: none;
    }

    & {
        display: block;
        width: 100%;
        height: 100vh;
        background-color: var(--background-transparent);
        color: var(--text-color);
    }

    .window-container {
        height: 100vh;
        border-radius: 7px;
        overflow: hidden;
    }

    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .main-content {
        flex: 1;
        padding: var(--main-content-padding);
        overflow-y: auto;
        margin-top: var(--main-content-margin-top);
        border-radius: var(--content-border-radius);
        transition: all 0.15s ease-out;
        background: var(--main-content-background);
    }

    .main-content.with-border {
        border: 1px solid var(--border-color);
    }

    .main-content.assistant-view {
        padding: 10px;
        border: none;
    }

    .main-content.onboarding-view {
        padding: 0;
        border: none;
        background: transparent;
    }

    .view-container {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.15s ease-out, transform 0.15s ease-out;
        height: 100%;
    }

    .view-container.entering {
        opacity: 0;
        transform: translateY(10px);
    }

    & ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    & ::-webkit-scrollbar-track {
        background: var(--scrollbar-background);
        border-radius: 3px;
    }

    & ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 3px;
    }

    & ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-hover);
    }
`;

const apiKeyHelpUrl = 'https://cheatingdaddy.com/help/api-key';

const App = () => {
    const [currentView, setCurrentView] = useState(() => (localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding'));
    const [statusText, setStatusText] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(() => localStorage.getItem('selectedProfile') || 'interview');
    const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('selectedLanguage') || 'en-US');
    const [selectedScreenshotInterval, setSelectedScreenshotInterval] = useState(() => localStorage.getItem('selectedScreenshotInterval') || '5');
    const [selectedImageQuality, setSelectedImageQuality] = useState(() => localStorage.getItem('selectedImageQuality') || 'medium');
    const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem('layoutMode') || 'normal');
    const [advancedMode, setAdvancedMode] = useState(() => localStorage.getItem('advancedMode') === 'true');
    const [responses, setResponses] = useState([]);
    const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);
    const [shouldAnimateResponse, setShouldAnimateResponse] = useState(false);
    const [isClickThrough, setIsClickThrough] = useState(false);
    const [isSessionInitializing, setIsSessionInitializing] = useState(false);
    const [showApiKeyError, setShowApiKeyError] = useState(false);

    const awaitingNewResponseRef = useRef(false);
    const currentResponseIsCompleteRef = useRef(true);
    const responsesRef = useRef(responses);
    const currentResponseIndexRef = useRef(currentResponseIndex);
    const currentViewRef = useRef(currentView);
    const layoutModeRef = useRef(layoutMode);

    useEffect(() => {
        responsesRef.current = responses;
    }, [responses]);

    useEffect(() => {
        currentResponseIndexRef.current = currentResponseIndex;
    }, [currentResponseIndex]);

    useEffect(() => {
        currentViewRef.current = currentView;
    }, [currentView]);

    useEffect(() => {
        layoutModeRef.current = layoutMode;
    }, [layoutMode]);

    useEffect(() => {
        if (!showApiKeyError) {
            return undefined;
        }
        const timeout = setTimeout(() => setShowApiKeyError(false), 1000);
        return () => clearTimeout(timeout);
    }, [showApiKeyError]);

    const updateLayoutModeClass = useCallback(mode => {
        const root = document.documentElement;
        if (mode === 'compact') {
            root.classList.add('compact-layout');
        } else {
            root.classList.remove('compact-layout');
        }
    }, []);

    useEffect(() => {
        updateLayoutModeClass(layoutMode);
    }, [layoutMode, updateLayoutModeClass]);

    const handleStatusUpdate = useCallback(text => {
        setStatusText(text);
        if (text && (text.includes('Ready') || text.includes('Listening') || text.includes('Error'))) {
            currentResponseIsCompleteRef.current = true;
        }
    }, []);

    const handleIncomingResponse = useCallback(response => {
        const responseLower = response?.toLowerCase?.() || '';
        const isFiller =
            responseLower.length < 30 &&
            (responseLower.includes('hmm') ||
                responseLower.includes('okay') ||
                responseLower.includes('next') ||
                responseLower.includes('go on') ||
                responseLower.includes('continue'));

        let nextIndex = currentResponseIndexRef.current;

        setResponses(prevResponses => {
            let updated = prevResponses;
            if (awaitingNewResponseRef.current || prevResponses.length === 0) {
                updated = [...prevResponses, response];
                nextIndex = updated.length - 1;
                awaitingNewResponseRef.current = false;
                currentResponseIsCompleteRef.current = false;
            } else if (!currentResponseIsCompleteRef.current && !isFiller && prevResponses.length > 0) {
                updated = [...prevResponses.slice(0, prevResponses.length - 1), response];
            } else {
                updated = [...prevResponses, response];
                nextIndex = updated.length - 1;
                currentResponseIsCompleteRef.current = false;
            }
            return updated;
        });

        if (nextIndex !== currentResponseIndexRef.current) {
            setCurrentResponseIndex(nextIndex);
        }
        setShouldAnimateResponse(true);
    }, []);

    const handleStart = useCallback(async () => {
        const apiKey = localStorage.getItem('apiKey')?.trim();
        if (!apiKey) {
            setShowApiKeyError(true);
            return;
        }

        try {
            if (window.cheddar?.initializeGemini) {
                await window.cheddar.initializeGemini(selectedProfile, selectedLanguage);
            }
            if (window.cheddar?.startCapture) {
                window.cheddar.startCapture(selectedScreenshotInterval, selectedImageQuality);
            }
            awaitingNewResponseRef.current = false;
            currentResponseIsCompleteRef.current = true;
            setResponses([]);
            setCurrentResponseIndex(-1);
            setStartTime(Date.now());
            setShouldAnimateResponse(false);
            setCurrentView('assistant');
        } catch (error) {
            console.error('Failed to start session:', error);
            setStatusText('Failed to start session');
        }
    }, [selectedProfile, selectedLanguage, selectedScreenshotInterval, selectedImageQuality]);

    useEffect(() => {
        if (window.cheddar && typeof window.cheddar.registerUIHooks === 'function') {
            window.cheddar.registerUIHooks({
                setStatus: handleStatusUpdate,
                setResponse: handleIncomingResponse,
                getCurrentView: () => currentViewRef.current,
                getLayoutMode: () => layoutModeRef.current,
                startSession: () => handleStart(),
            });
        }
    }, [handleIncomingResponse, handleStatusUpdate, handleStart]);

    useEffect(() => {
        if (!window.require) {
            return undefined;
        }
        const { ipcRenderer } = window.require('electron');

        const statusHandler = (_, status) => handleStatusUpdate(status);
        const responseHandler = (_, response) => handleIncomingResponse(response);
        const clickThroughHandler = (_, enabled) => setIsClickThrough(Boolean(enabled));
        const initializingHandler = (_, value) => setIsSessionInitializing(Boolean(value));

        ipcRenderer.on('update-status', statusHandler);
        ipcRenderer.on('update-response', responseHandler);
        ipcRenderer.on('click-through-toggled', clickThroughHandler);
        ipcRenderer.on('session-initializing', initializingHandler);

        return () => {
            ipcRenderer.removeListener('update-status', statusHandler);
            ipcRenderer.removeListener('update-response', responseHandler);
            ipcRenderer.removeListener('click-through-toggled', clickThroughHandler);
            ipcRenderer.removeListener('session-initializing', initializingHandler);
        };
    }, [handleIncomingResponse, handleStatusUpdate]);

    useEffect(() => {
        if (!window.require) {
            return undefined;
        }
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('view-changed', currentView);
        return undefined;
    }, [currentView]);

    const [isEnteringView, setIsEnteringView] = useState(false);
    useEffect(() => {
        setIsEnteringView(true);
        const frame = requestAnimationFrame(() => setIsEnteringView(false));
        return () => cancelAnimationFrame(frame);
    }, [currentView]);

    useEffect(() => {
        localStorage.setItem('selectedProfile', selectedProfile);
    }, [selectedProfile]);

    useEffect(() => {
        localStorage.setItem('selectedLanguage', selectedLanguage);
    }, [selectedLanguage]);

    useEffect(() => {
        localStorage.setItem('selectedScreenshotInterval', selectedScreenshotInterval);
    }, [selectedScreenshotInterval]);

    useEffect(() => {
        localStorage.setItem('selectedImageQuality', selectedImageQuality);
    }, [selectedImageQuality]);

    useEffect(() => {
        localStorage.setItem('advancedMode', advancedMode.toString());
    }, [advancedMode]);

    const handleClose = useCallback(async () => {
        if (['customize', 'help', 'history', 'advanced'].includes(currentView)) {
            setCurrentView('main');
            return;
        }

        if (currentView === 'assistant') {
            try {
                window.cheddar?.stopCapture?.();
                if (window.require) {
                    const { ipcRenderer } = window.require('electron');
                    await ipcRenderer.invoke('close-session');
                }
            } catch (error) {
                console.error('Failed to close session:', error);
            } finally {
                setStartTime(null);
                setCurrentView('main');
            }
            return;
        }

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');
        }
    }, [currentView]);

    const handleHideToggle = useCallback(async () => {
        if (!window.require) {
            return;
        }
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('toggle-window-visibility');
    }, []);

    const handleAPIKeyHelp = useCallback(async () => {
        if (!window.require) {
            return;
        }
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('open-external', apiKeyHelpUrl);
    }, []);

    const handleExternalLinkClick = useCallback(async url => {
        if (!window.require) {
            return;
        }
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('open-external', url);
    }, []);

    const handleProfileChange = useCallback(profile => {
        setSelectedProfile(profile);
    }, []);

    const handleLanguageChange = useCallback(language => {
        setSelectedLanguage(language);
    }, []);

    const handleScreenshotIntervalChange = useCallback(interval => {
        setSelectedScreenshotInterval(interval);
    }, []);

    const handleImageQualityChange = useCallback(quality => {
        setSelectedImageQuality(quality);
    }, []);

    const handleLayoutModeChange = useCallback(
        async mode => {
            setLayoutMode(mode);
            localStorage.setItem('layoutMode', mode);
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    await ipcRenderer.invoke('update-sizes');
                } catch (error) {
                    console.error('Failed to update sizes:', error);
                }
            }
        },
        []
    );

    const handleAdvancedModeChange = useCallback(value => {
        setAdvancedMode(value);
    }, []);

    const handleSendText = useCallback(async message => {
        if (!message || !message.trim()) {
            return;
        }
        try {
            const result = await window.cheddar?.sendTextMessage?.(message.trim());
            if (!result?.success) {
                console.error('Failed to send message:', result?.error);
                setStatusText(`Error sending message: ${result?.error || 'Unknown error'}`);
            } else {
                setStatusText('Message sent...');
                awaitingNewResponseRef.current = true;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setStatusText('Error sending message');
        }
    }, []);

    const handleResponseIndexChanged = useCallback(index => {
        setCurrentResponseIndex(index);
        setShouldAnimateResponse(false);
    }, []);

    const handleResponseAnimationComplete = useCallback(() => {
        setShouldAnimateResponse(false);
        currentResponseIsCompleteRef.current = true;
    }, []);

    const handleOnboardingComplete = useCallback(() => {
        localStorage.setItem('onboardingCompleted', 'true');
        setCurrentView('main');
    }, []);

    const mainContentClassName = useMemo(() => {
        if (currentView === 'assistant') {
            return 'main-content assistant-view';
        }
        if (currentView === 'onboarding') {
            return 'main-content onboarding-view';
        }
        return 'main-content with-border';
    }, [currentView]);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'onboarding':
                return <OnboardingView onComplete={handleOnboardingComplete} />;
            case 'main':
                return (
                    <MainView
                        onStart={handleStart}
                        onAPIKeyHelp={handleAPIKeyHelp}
                        onLayoutModeChange={handleLayoutModeChange}
                        isInitializing={isSessionInitializing}
                        showApiKeyError={showApiKeyError}
                        onDismissApiKeyError={() => setShowApiKeyError(false)}
                    />
                );
            case 'customize':
                return (
                    <CustomizeView
                        selectedProfile={selectedProfile}
                        selectedLanguage={selectedLanguage}
                        selectedScreenshotInterval={selectedScreenshotInterval}
                        selectedImageQuality={selectedImageQuality}
                        layoutMode={layoutMode}
                        advancedMode={advancedMode}
                        onProfileChange={handleProfileChange}
                        onLanguageChange={handleLanguageChange}
                        onScreenshotIntervalChange={handleScreenshotIntervalChange}
                        onImageQualityChange={handleImageQualityChange}
                        onLayoutModeChange={handleLayoutModeChange}
                        onAdvancedModeChange={handleAdvancedModeChange}
                    />
                );
            case 'help':
                return <HelpView onExternalLinkClick={handleExternalLinkClick} />;
            case 'history':
                return <HistoryView />;
            case 'advanced':
                return <AdvancedView />;
            case 'assistant':
                return (
                    <AssistantView
                        responses={responses}
                        currentResponseIndex={currentResponseIndex}
                        selectedProfile={selectedProfile}
                        onSendText={handleSendText}
                        shouldAnimateResponse={shouldAnimateResponse}
                        onResponseIndexChanged={handleResponseIndexChanged}
                        onResponseAnimationComplete={handleResponseAnimationComplete}
                    />
                );
            default:
                return <div>Unknown view: {currentView}</div>;
        }
    };

    return (
        <AppShell>
            <div className="window-container">
                <div className="container">
                    <AppHeader
                        currentView={currentView}
                        statusText={statusText}
                        startTime={startTime}
                        advancedMode={advancedMode}
                        onCustomizeClick={() => setCurrentView('customize')}
                        onHelpClick={() => setCurrentView('help')}
                        onHistoryClick={() => setCurrentView('history')}
                        onAdvancedClick={() => setCurrentView('advanced')}
                        onCloseClick={handleClose}
                        onBackClick={() => setCurrentView('main')}
                        onHideToggleClick={handleHideToggle}
                        isClickThrough={isClickThrough}
                    />
                    <div className={mainContentClassName}>
                        <div className={`view-container${isEnteringView ? ' entering' : ''}`}>{renderCurrentView()}</div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default App;
