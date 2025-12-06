import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppHeader } from './components/ui/AppHeader';
import { MainView } from './components/views/MainView';
import { CustomizeView } from './components/views/CustomizeView';
import { HelpView } from './components/views/HelpView';
import { HistoryView } from './components/views/HistoryView';
import { AssistantView } from './components/views/AssistantView';
import { OnboardingView } from './components/views/OnboardingView';
import { AdvancedView } from './components/views/AdvancedView';
import './App.css';

const App = () => {
    const [currentView, setCurrentView] = useState(
        localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding'
    );
    const [statusText, setStatusText] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(localStorage.getItem('selectedProfile') || 'interview');
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en-US');
    const [selectedScreenshotInterval, setSelectedScreenshotInterval] = useState(
        localStorage.getItem('selectedScreenshotInterval') || '5'
    );
    const [selectedImageQuality, setSelectedImageQuality] = useState(
        localStorage.getItem('selectedImageQuality') || 'medium'
    );
    const [layoutMode, setLayoutMode] = useState(localStorage.getItem('layoutMode') || 'normal');
    const [advancedMode, setAdvancedMode] = useState(localStorage.getItem('advancedMode') === 'true');
    const [responses, setResponses] = useState([]);
    const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);
    const [isClickThrough, setIsClickThrough] = useState(false);
    const [awaitingNewResponse, setAwaitingNewResponse] = useState(false);
    const [currentResponseIsComplete, setCurrentResponseIsComplete] = useState(true);
    const [shouldAnimateResponse, setShouldAnimateResponse] = useState(false);

    const ipcRendererRef = useRef(null);

    useEffect(() => {
        try {
            const { ipcRenderer } = window.require('electron');
            ipcRendererRef.current = ipcRenderer;

            const handleUpdateResponse = (_, response) => {
                setResponse(response);
            };

            const handleUpdateStatus = (_, status) => {
                setStatus(status);
            };

            const handleClickThroughToggled = (_, isEnabled) => {
                setIsClickThrough(isEnabled);
            };

            ipcRendererRef.current.on('update-response', handleUpdateResponse);
            ipcRendererRef.current.on('update-status', handleUpdateStatus);
            ipcRendererRef.current.on('click-through-toggled', handleClickThroughToggled);

            return () => {
                if (ipcRendererRef.current) {
                    ipcRendererRef.current.removeAllListeners('update-response');
                    ipcRendererRef.current.removeAllListeners('update-status');
                    ipcRendererRef.current.removeAllListeners('click-through-toggled');
                }
            };
        } catch (error) {
            console.error('IPC setup error:', error);
        }
    }, []);

    const setStatus = useCallback((text) => {
        setStatusText(text);
        if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
            setCurrentResponseIsComplete(true);
        }
    }, []);

    const setResponse = useCallback((response) => {
        const isFillerResponse =
            response.length < 30 &&
            (response.toLowerCase().includes('hmm') ||
                response.toLowerCase().includes('okay') ||
                response.toLowerCase().includes('next') ||
                response.toLowerCase().includes('go on') ||
                response.toLowerCase().includes('continue'));

        setResponses(prevResponses => {
            if (awaitingNewResponse || prevResponses.length === 0) {
                const newResponses = [...prevResponses, response];
                setCurrentResponseIndex(newResponses.length - 1);
                setAwaitingNewResponse(false);
                setCurrentResponseIsComplete(false);
                return newResponses;
            } else if (!currentResponseIsComplete && !isFillerResponse && prevResponses.length > 0) {
                return [...prevResponses.slice(0, prevResponses.length - 1), response];
            } else {
                const newResponses = [...prevResponses, response];
                setCurrentResponseIndex(newResponses.length - 1);
                setCurrentResponseIsComplete(false);
                return newResponses;
            }
        });
        setShouldAnimateResponse(true);
    }, [awaitingNewResponse, currentResponseIsComplete]);

    const handleCustomizeClick = () => setCurrentView('customize');
    const handleHelpClick = () => setCurrentView('help');
    const handleHistoryClick = () => setCurrentView('history');
    const handleAdvancedClick = () => setCurrentView('advanced');
    const handleBackClick = () => setCurrentView('main');

    const handleClose = async () => {
        if (['customize', 'help', 'history'].includes(currentView)) {
            setCurrentView('main');
        } else if (currentView === 'assistant') {
            window.cheddar?.stopCapture?.();
            if (ipcRendererRef.current) {
                try {
                    await ipcRendererRef.current.invoke('close-session');
                } catch (error) {
                    console.error('Error closing session:', error);
                }
            }
            setSessionActive(false);
            setCurrentView('main');
        } else {
            if (ipcRendererRef.current) {
                try {
                    await ipcRendererRef.current.invoke('quit-application');
                } catch (error) {
                    console.error('Error quitting:', error);
                }
            }
        }
    };

    const handleHideToggle = async () => {
        if (ipcRendererRef.current) {
            try {
                await ipcRendererRef.current.invoke('toggle-window-visibility');
            } catch (error) {
                console.error('Error toggling visibility:', error);
            }
        }
    };

    const handleStart = async () => {
        const apiKey = localStorage.getItem('apiKey')?.trim();
        if (!apiKey || apiKey === '') {
            console.log('API key is empty');
            return;
        }

        await window.cheddar?.initializeGemini?.(selectedProfile, selectedLanguage);
        window.cheddar?.startCapture?.(selectedScreenshotInterval, selectedImageQuality);
        setResponses([]);
        setCurrentResponseIndex(-1);
        setStartTime(Date.now());
        setCurrentView('assistant');
    };

    const handleAPIKeyHelp = async () => {
        if (ipcRendererRef.current) {
            try {
                await ipcRendererRef.current.invoke('open-external', 'https://cheatingdaddy.com/help/api-key');
            } catch (error) {
                console.error('Error opening URL:', error);
            }
        }
    };

    const handleSendText = async (message) => {
        const result = await window.cheddar?.sendTextMessage?.(message);
        if (!result?.success) {
            console.error('Failed to send message:', result?.error);
            setStatusText('Error sending message: ' + result?.error);
        } else {
            setStatusText('Message sent...');
            setAwaitingNewResponse(true);
        }
    };

    const handleOnboardingComplete = () => {
        setCurrentView('main');
    };

    // Update localStorage when state changes
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
        localStorage.setItem('layoutMode', layoutMode);
        if (layoutMode === 'compact') {
            document.documentElement.classList.add('compact-layout');
        } else {
            document.documentElement.classList.remove('compact-layout');
        }
    }, [layoutMode]);

    useEffect(() => {
        localStorage.setItem('advancedMode', advancedMode.toString());
    }, [advancedMode]);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'onboarding':
                return (
                    <OnboardingView
                        onComplete={handleOnboardingComplete}
                        onClose={handleClose}
                    />
                );
            case 'main':
                return (
                    <MainView
                        onStart={handleStart}
                        onAPIKeyHelp={handleAPIKeyHelp}
                        onLayoutModeChange={setLayoutMode}
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
                        onProfileChange={setSelectedProfile}
                        onLanguageChange={setSelectedLanguage}
                        onScreenshotIntervalChange={setSelectedScreenshotInterval}
                        onImageQualityChange={setSelectedImageQuality}
                        onLayoutModeChange={setLayoutMode}
                        onAdvancedModeChange={setAdvancedMode}
                    />
                );
            case 'help':
                return (
                    <HelpView
                        onExternalLinkClick={handleAPIKeyHelp}
                    />
                );
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
                        onResponseIndexChanged={(index) => {
                            setCurrentResponseIndex(index);
                            setShouldAnimateResponse(false);
                        }}
                        onResponseAnimationComplete={() => {
                            setShouldAnimateResponse(false);
                            setCurrentResponseIsComplete(true);
                        }}
                    />
                );
            default:
                return <div>Unknown view: {currentView}</div>;
        }
    };

    const mainContentClass = currentView === 'assistant' 
        ? 'bg-overlay-light' 
        : currentView === 'onboarding' 
        ? 'bg-transparent' 
        : 'bg-overlay-light border border-dim';

    return (
        <div className="w-screen h-screen flex flex-col bg-transparent overflow-hidden">
            <AppHeader
                currentView={currentView}
                statusText={statusText}
                startTime={startTime}
                advancedMode={advancedMode}
                onCustomizeClick={handleCustomizeClick}
                onHelpClick={handleHelpClick}
                onHistoryClick={handleHistoryClick}
                onAdvancedClick={handleAdvancedClick}
                onCloseClick={handleClose}
                onBackClick={handleBackClick}
                onHideToggleClick={handleHideToggle}
                isClickThrough={isClickThrough}
            />
            <div className={`flex-1 overflow-y-auto rounded-lg transition-all duration-150 ${mainContentClass}`}
                style={{
                    padding: layoutMode === 'compact' ? '10px' : '20px',
                    marginTop: layoutMode === 'compact' ? '2px' : '10px',
                }}>
                <div className="opacity-100 transform translate-y-0 transition-all duration-150 h-full">
                    {renderCurrentView()}
                </div>
            </div>
        </div>
    );
};

export default App;
