import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { resizeLayout } from '../../utils/windowResize';

const CustomizeShell = styled.div`
    * {
        font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        cursor: default;
        user-select: none;
    }

    & {
        display: block;
        padding: 12px;
        margin: 0 auto;
        max-width: 700px;
    }

    .settings-container {
        display: grid;
        gap: 12px;
        padding-bottom: 20px;
    }

    .settings-section {
        background: var(--card-background, rgba(255, 255, 255, 0.04));
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
        border-radius: 6px;
        padding: 16px;
        backdrop-filter: blur(10px);
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .section-title::before {
        content: '';
        width: 3px;
        height: 14px;
        background: var(--accent-color, #007aff);
        border-radius: 1.5px;
    }

    .form-grid {
        display: grid;
        gap: 12px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        align-items: start;
    }

    @media (max-width: 600px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-label {
        font-weight: 500;
        font-size: 12px;
        color: var(--label-color, rgba(255, 255, 255, 0.9));
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .form-description {
        font-size: 11px;
        color: var(--description-color, rgba(255, 255, 255, 0.5));
        line-height: 1.3;
        margin-top: 2px;
    }

    .form-control {
        background: var(--input-background, rgba(0, 0, 0, 0.3));
        color: var(--text-color);
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.15));
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 12px;
        transition: all 0.15s ease;
        min-height: 16px;
        font-weight: 400;
    }

    .form-control:focus {
        outline: none;
        border-color: var(--focus-border-color, #007aff);
        box-shadow: 0 0 0 2px var(--focus-shadow, rgba(0, 122, 255, 0.1));
        background: var(--input-focus-background, rgba(0, 0, 0, 0.4));
    }

    .form-control:hover:not(:focus) {
        border-color: var(--input-hover-border, rgba(255, 255, 255, 0.2));
        background: var(--input-hover-background, rgba(0, 0, 0, 0.35));
    }

    select.form-control {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 12px;
        padding-right: 28px;
    }

    textarea.form-control {
        resize: vertical;
        min-height: 60px;
        line-height: 1.4;
        font-family: inherit;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        padding: 8px;
        background: var(--checkbox-background, rgba(255, 255, 255, 0.02));
        border-radius: 4px;
        border: 1px solid var(--checkbox-border, rgba(255, 255, 255, 0.06));
    }

    .checkbox-input {
        width: 14px;
        height: 14px;
        accent-color: var(--focus-border-color, #007aff);
        cursor: pointer;
    }

    .checkbox-label {
        font-weight: 500;
        font-size: 12px;
        color: var(--label-color, rgba(255, 255, 255, 0.9));
        cursor: pointer;
        user-select: none;
    }

    .profile-option {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .current-selection {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: var(--success-color, #34d399);
        background: var(--success-background, rgba(52, 211, 153, 0.1));
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: 500;
        border: 1px solid var(--success-border, rgba(52, 211, 153, 0.2));
    }

    .current-selection::before {
        content: '✓';
        font-weight: 600;
    }

    .keybind-input {
        cursor: pointer;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
        text-align: center;
        letter-spacing: 0.5px;
        font-weight: 500;
    }

    .keybind-input:focus {
        cursor: text;
        background: var(--input-focus-background, rgba(0, 122, 255, 0.1));
    }

    .keybind-input::placeholder {
        color: var(--placeholder-color, rgba(255, 255, 255, 0.4));
        font-style: italic;
    }

    .reset-keybinds-button {
        background: var(--button-background, rgba(255, 255, 255, 0.1));
        color: var(--text-color);
        border: 1px solid var(--button-border, rgba(255, 255, 255, 0.15));
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .reset-keybinds-button:hover {
        background: var(--button-hover-background, rgba(255, 255, 255, 0.15));
        border-color: var(--button-hover-border, rgba(255, 255, 255, 0.25));
    }

    .keybinds-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        border-radius: 4px;
        overflow: hidden;
    }

    .keybinds-table th,
    .keybinds-table td {
        padding: 8px 10px;
        text-align: left;
        border-bottom: 1px solid var(--table-border, rgba(255, 255, 255, 0.08));
    }

    .keybinds-table th {
        background: var(--table-header-background, rgba(255, 255, 255, 0.04));
        font-weight: 600;
        font-size: 11px;
        color: var(--label-color, rgba(255, 255, 255, 0.8));
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .keybinds-table .action-name {
        font-weight: 500;
        color: var(--text-color);
        font-size: 12px;
    }

    .keybinds-table .action-description {
        font-size: 10px;
        color: var(--description-color, rgba(255, 255, 255, 0.5));
        margin-top: 1px;
    }

    .keybinds-table tr:hover {
        background: var(--table-row-hover, rgba(255, 255, 255, 0.02));
    }

    .table-reset-row {
        border-top: 1px solid var(--table-border, rgba(255, 255, 255, 0.08));
    }

    .table-reset-row td {
        padding-top: 10px;
        padding-bottom: 8px;
        border-bottom: none;
    }

    .settings-note {
        font-size: 10px;
        color: var(--note-color, rgba(255, 255, 255, 0.4));
        font-style: italic;
        text-align: center;
        margin-top: 10px;
        padding: 8px;
        background: var(--note-background, rgba(255, 255, 255, 0.02));
        border-radius: 4px;
        border: 1px solid var(--note-border, rgba(255, 255, 255, 0.08));
    }

    .slider-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .slider-value {
        font-size: 11px;
        color: var(--success-color, #34d399);
        background: var(--success-background, rgba(52, 211, 153, 0.1));
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: 500;
        border: 1px solid var(--success-border, rgba(52, 211, 153, 0.2));
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    }

    .slider-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: var(--input-background, rgba(0, 0, 0, 0.3));
        outline: none;
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.15));
        cursor: pointer;
    }

    .slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--focus-border-color, #007aff);
        cursor: pointer;
        border: 2px solid var(--text-color, white);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
        font-size: 10px;
        color: var(--description-color, rgba(255, 255, 255, 0.5));
    }
`;

const profiles = [
    { value: 'interview', name: 'Job Interview', description: 'Get help with answering interview questions' },
    { value: 'sales', name: 'Sales Call', description: 'Assist with sales conversations and objection handling' },
    { value: 'meeting', name: 'Business Meeting', description: 'Support for professional meetings and discussions' },
    { value: 'presentation', name: 'Presentation', description: 'Help with presentations and public speaking' },
    { value: 'negotiation', name: 'Negotiation', description: 'Guidance for business negotiations and deals' },
    { value: 'exam', name: 'Exam Assistant', description: 'Academic assistance for test-taking and exam questions' },
];

const languages = [
    { value: 'en-US', name: 'English (US)' },
    { value: 'en-GB', name: 'English (UK)' },
    { value: 'en-AU', name: 'English (Australia)' },
    { value: 'en-IN', name: 'English (India)' },
    { value: 'de-DE', name: 'German (Germany)' },
    { value: 'es-US', name: 'Spanish (United States)' },
    { value: 'es-ES', name: 'Spanish (Spain)' },
    { value: 'fr-FR', name: 'French (France)' },
    { value: 'fr-CA', name: 'French (Canada)' },
    { value: 'hi-IN', name: 'Hindi (India)' },
    { value: 'pt-BR', name: 'Portuguese (Brazil)' },
    { value: 'ar-XA', name: 'Arabic (Generic)' },
    { value: 'id-ID', name: 'Indonesian (Indonesia)' },
    { value: 'it-IT', name: 'Italian (Italy)' },
    { value: 'ja-JP', name: 'Japanese (Japan)' },
    { value: 'tr-TR', name: 'Turkish (Turkey)' },
    { value: 'vi-VN', name: 'Vietnamese (Vietnam)' },
    { value: 'bn-IN', name: 'Bengali (India)' },
    { value: 'gu-IN', name: 'Gujarati (India)' },
    { value: 'kn-IN', name: 'Kannada (India)' },
    { value: 'ml-IN', name: 'Malayalam (India)' },
    { value: 'mr-IN', name: 'Marathi (India)' },
];

const keybindActions = [
    { key: 'moveUp', name: 'Move Window Up', description: 'Move the application window up' },
    { key: 'moveDown', name: 'Move Window Down', description: 'Move the application window down' },
    { key: 'moveLeft', name: 'Move Window Left', description: 'Move the application window left' },
    { key: 'moveRight', name: 'Move Window Right', description: 'Move the application window right' },
    { key: 'toggleVisibility', name: 'Toggle Window Visibility', description: 'Show/hide the application window' },
    { key: 'toggleClickThrough', name: 'Toggle Click-through Mode', description: 'Enable/disable click-through functionality' },
    { key: 'nextStep', name: 'Ask Next Step', description: 'Take screenshot and ask AI for the next step suggestion' },
    { key: 'previousResponse', name: 'Previous Response', description: 'Navigate to the previous AI response' },
    { key: 'nextResponse', name: 'Next Response', description: 'Navigate to the next AI response' },
    { key: 'scrollUp', name: 'Scroll Response Up', description: 'Scroll the AI response content up' },
    { key: 'scrollDown', name: 'Scroll Response Down', description: 'Scroll the AI response content down' },
];

const getDefaultKeybinds = () => {
    const isMac = window.cheddar?.isMacOS || navigator.platform.toUpperCase().includes('MAC');
    return {
        moveUp: isMac ? 'Alt+Up' : 'Ctrl+Up',
        moveDown: isMac ? 'Alt+Down' : 'Ctrl+Down',
        moveLeft: isMac ? 'Alt+Left' : 'Ctrl+Left',
        moveRight: isMac ? 'Alt+Right' : 'Ctrl+Right',
        toggleVisibility: isMac ? 'Cmd+\\' : 'Ctrl+\\',
        toggleClickThrough: isMac ? 'Cmd+M' : 'Ctrl+M',
        nextStep: isMac ? 'Cmd+Enter' : 'Ctrl+Enter',
        previousResponse: isMac ? 'Cmd+[' : 'Ctrl+[',
        nextResponse: isMac ? 'Cmd+]' : 'Ctrl+]',
        scrollUp: isMac ? 'Cmd+Shift+Up' : 'Ctrl+Shift+Up',
        scrollDown: isMac ? 'Cmd+Shift+Down' : 'Ctrl+Shift+Down',
    };
};

const mergeSavedKeybinds = saved => {
    const defaults = getDefaultKeybinds();
    if (!saved) {
        return defaults;
    }
    try {
        return { ...defaults, ...JSON.parse(saved) };
    } catch (error) {
        console.error('Failed to parse saved keybinds:', error);
        return defaults;
    }
};

const CustomizeView = ({
    selectedProfile,
    selectedLanguage,
    selectedScreenshotInterval,
    selectedImageQuality,
    layoutMode,
    advancedMode,
    onProfileChange,
    onLanguageChange,
    onScreenshotIntervalChange,
    onImageQualityChange,
    onLayoutModeChange,
    onAdvancedModeChange,
}) => {
    const [keybinds, setKeybinds] = useState(() => mergeSavedKeybinds(localStorage.getItem('customKeybinds')));
    const [googleSearchEnabled, setGoogleSearchEnabled] = useState(() => {
        const stored = localStorage.getItem('googleSearchEnabled');
        return stored !== null ? stored === 'true' : true;
    });
    const [backgroundTransparency, setBackgroundTransparency] = useState(() => {
        const stored = parseFloat(localStorage.getItem('backgroundTransparency'));
        return Number.isFinite(stored) ? stored : 0.8;
    });
    const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize'), 10) || 20);
    const [customPrompt, setCustomPrompt] = useState(() => localStorage.getItem('customPrompt') || '');
    const [audioMode, setAudioMode] = useState(() => localStorage.getItem('audioMode') || 'speaker_only');
    const [stealthProfile, setStealthProfile] = useState(() => localStorage.getItem('stealthProfile') || 'balanced');

    useEffect(() => {
        resizeLayout();
    }, []);

    useEffect(() => {
        updateBackgroundTransparency(backgroundTransparency);
        localStorage.setItem('backgroundTransparency', backgroundTransparency.toString());
    }, [backgroundTransparency]);

    useEffect(() => {
        document.documentElement.style.setProperty('--response-font-size', `${fontSize}px`);
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('audioMode', audioMode);
    }, [audioMode]);

    useEffect(() => {
        localStorage.setItem('stealthProfile', stealthProfile);
    }, [stealthProfile]);

    const saveKeybinds = useCallback(updated => {
        localStorage.setItem('customKeybinds', JSON.stringify(updated));
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('update-keybinds', updated);
        }
    }, []);

    const handleKeybindChange = useCallback(
        (action, value) => {
            setKeybinds(prev => {
                const updated = { ...prev, [action]: value };
                saveKeybinds(updated);
                return updated;
            });
        },
        [saveKeybinds]
    );

    const resetKeybinds = () => {
        const defaults = getDefaultKeybinds();
        setKeybinds(defaults);
        localStorage.removeItem('customKeybinds');
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('update-keybinds', defaults);
        }
    };

    const handleKeybindInput = event => {
        event.preventDefault();
        const modifiers = [];
        if (event.metaKey) modifiers.push('Cmd');
        if (event.ctrlKey) modifiers.push('Ctrl');
        if (event.altKey) modifiers.push('Alt');
        if (event.shiftKey) modifiers.push('Shift');

        let mainKey = null;
        const { key, code } = event;

        if (key === ' ') {
            mainKey = 'Space';
        } else if (key.length === 1) {
            mainKey = key.toUpperCase();
        } else if (key.startsWith('Arrow')) {
            mainKey = key.replace('Arrow', '');
        } else if (key === 'Escape') {
            mainKey = 'Esc';
        } else if (key === 'Enter') {
            mainKey = 'Enter';
        } else if (key === 'Backspace') {
            mainKey = 'Backspace';
        } else if (code.startsWith('Key')) {
            mainKey = code.slice(3);
        } else if (code.startsWith('Digit')) {
            mainKey = code.slice(5);
        }

        if (!mainKey || ['Control', 'Meta', 'Alt', 'Shift'].includes(key)) {
            return;
        }

        const keybind = [...modifiers, mainKey].join('+');
        const action = event.currentTarget.dataset.action;
        handleKeybindChange(action, keybind);
        event.currentTarget.blur();
    };

    const handleGoogleSearchChange = async event => {
        const enabled = event.target.checked;
        setGoogleSearchEnabled(enabled);
        localStorage.setItem('googleSearchEnabled', enabled.toString());
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-google-search-setting', enabled);
            } catch (error) {
                console.error('Failed to notify main process:', error);
            }
        }
    };

    const handleCustomPromptChange = event => {
        const value = event.target.value;
        setCustomPrompt(value);
        localStorage.setItem('customPrompt', value);
    };

    const handleBackgroundSlider = event => {
        setBackgroundTransparency(parseFloat(event.target.value));
    };

    const handleFontSizeSlider = event => {
        setFontSize(parseInt(event.target.value, 10));
    };

    const handleAudioModeChange = event => {
        setAudioMode(event.target.value);
    };

    const handleStealthProfileChange = event => {
        const value = event.target.value;
        setStealthProfile(value);
        window.alert('Restart the application for stealth changes to take full effect.');
    };

    const handleAdvancedToggle = event => {
        onAdvancedModeChange(event.target.checked);
    };

    const profileNames = useMemo(() => {
        const map = {};
        profiles.forEach(profile => {
            map[profile.value] = profile.name;
        });
        return map;
    }, []);

    return (
        <CustomizeShell>
            <div className="settings-container">
                <div className="settings-section">
                    <div className="section-title">
                        <span>AI Profile &amp; Behavior</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Profile Type
                                    <span className="current-selection">{profileNames[selectedProfile] || 'Unknown'}</span>
                                </label>
                                <select className="form-control" value={selectedProfile} onChange={event => onProfileChange(event.target.value)}>
                                    {profiles.map(profile => (
                                        <option key={profile.value} value={profile.value}>
                                            {profile.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Custom AI Instructions</label>
                            <textarea
                                className="form-control"
                                placeholder={`Add specific instructions for how you want the AI to behave during ${
                                    profileNames[selectedProfile] || 'this interaction'
                                }...`}
                                value={customPrompt}
                                rows={4}
                                onChange={handleCustomPromptChange}
                            />
                            <div className="form-description">
                                Personalize the AI's behavior with specific instructions that will be added to the base prompts
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Audio &amp; Microphone</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Audio Mode</label>
                            <select className="form-control" value={audioMode} onChange={handleAudioModeChange}>
                                <option value="speaker_only">Speaker Only (Interviewer)</option>
                                <option value="mic_only">Microphone Only (Me)</option>
                                <option value="both">Both Speaker &amp; Microphone</option>
                            </select>
                            <div className="form-description">Choose which audio sources to capture for the AI.</div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Stealth Profile</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Profile</label>
                            <select className="form-control" value={stealthProfile} onChange={handleStealthProfileChange}>
                                <option value="visible">Visible</option>
                                <option value="balanced">Balanced</option>
                                <option value="ultra">Ultra-Stealth</option>
                            </select>
                            <div className="form-description">Adjusts visibility and detection resistance. Restart required.</div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Language &amp; Audio</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Speech Language</label>
                                <select className="form-control" value={selectedLanguage} onChange={event => onLanguageChange(event.target.value)}>
                                    {languages.map(language => (
                                        <option key={language.value} value={language.value}>
                                            {language.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-description">Language for speech recognition and AI responses</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Interface Layout</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Layout Mode
                                    <span className="current-selection">{layoutMode === 'compact' ? 'Compact' : 'Normal'}</span>
                                </label>
                                <select className="form-control" value={layoutMode} onChange={event => onLayoutModeChange(event.target.value)}>
                                    <option value="normal">Normal</option>
                                    <option value="compact">Compact</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <div className="slider-container">
                                <div className="slider-header">
                                    <label className="form-label">Background Transparency</label>
                                    <span className="slider-value">{Math.round(backgroundTransparency * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="slider-input"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={backgroundTransparency}
                                    onChange={handleBackgroundSlider}
                                />
                                <div className="slider-labels">
                                    <span>Transparent</span>
                                    <span>Opaque</span>
                                </div>
                                <div className="form-description">Adjust the transparency of the interface background</div>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <div className="slider-container">
                                <div className="slider-header">
                                    <label className="form-label">Response Font Size</label>
                                    <span className="slider-value">{fontSize}px</span>
                                </div>
                                <input type="range" className="slider-input" min="12" max="32" step="1" value={fontSize} onChange={handleFontSizeSlider} />
                                <div className="slider-labels">
                                    <span>12px</span>
                                    <span>32px</span>
                                </div>
                                <div className="form-description">Adjust the font size of AI response text</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Screen Capture Settings</span>
                    </div>
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Capture Interval
                                    <span className="current-selection">
                                        {selectedScreenshotInterval === 'manual' ? 'Manual' : `${selectedScreenshotInterval}s`}
                                    </span>
                                </label>
                                <select
                                    className="form-control"
                                    value={selectedScreenshotInterval}
                                    onChange={event => onScreenshotIntervalChange(event.target.value)}
                                >
                                    <option value="manual">Manual (On demand)</option>
                                    <option value="1">Every 1 second</option>
                                    <option value="2">Every 2 seconds</option>
                                    <option value="5">Every 5 seconds</option>
                                    <option value="10">Every 10 seconds</option>
                                </select>
                                <div className="form-description">
                                    {selectedScreenshotInterval === 'manual'
                                        ? 'Screenshots only taken when you use the shortcut'
                                        : 'Automatic screenshots will be taken at the specified interval'}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Image Quality
                                    <span className="current-selection">
                                        {selectedImageQuality.charAt(0).toUpperCase() + selectedImageQuality.slice(1)}
                                    </span>
                                </label>
                                <select className="form-control" value={selectedImageQuality} onChange={event => onImageQualityChange(event.target.value)}>
                                    <option value="high">High Quality</option>
                                    <option value="medium">Medium Quality</option>
                                    <option value="low">Low Quality</option>
                                </select>
                                <div className="form-description">
                                    {selectedImageQuality === 'high'
                                        ? 'Best quality, uses more tokens'
                                        : selectedImageQuality === 'medium'
                                          ? 'Balanced quality and token usage'
                                          : 'Lower quality, uses fewer tokens'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Keyboard Shortcuts</span>
                    </div>
                    <table className="keybinds-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Shortcut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keybindActions.map(action => (
                                <tr key={action.key}>
                                    <td>
                                        <div className="action-name">{action.name}</div>
                                        <div className="action-description">{action.description}</div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control keybind-input"
                                            value={keybinds[action.key]}
                                            placeholder="Press keys..."
                                            data-action={action.key}
                                            readOnly
                                            onKeyDown={handleKeybindInput}
                                            onFocus={event => event.target.select()}
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr className="table-reset-row">
                                <td colSpan={2}>
                                    <button className="reset-keybinds-button" onClick={resetKeybinds} type="button">
                                        Reset to Defaults
                                    </button>
                                    <div className="form-description" style={{ marginTop: 8 }}>Restore all keyboard shortcuts to their default values</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="settings-section">
                    <div className="section-title">
                        <span>Google Search</span>
                    </div>
                    <div className="form-grid">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                id="google-search-enabled"
                                checked={googleSearchEnabled}
                                onChange={handleGoogleSearchChange}
                            />
                            <label htmlFor="google-search-enabled" className="checkbox-label">
                                Enable Google Search
                            </label>
                        </div>
                        <div className="form-description" style={{ marginLeft: 24, marginTop: -8 }}>
                            Allow the AI to search Google for up-to-date information during conversations.
                            <br />
                            <strong>Note:</strong> changes take effect when starting a new AI session.
                        </div>
                    </div>
                </div>

                <div
                    className="settings-section"
                    style={{ borderColor: 'var(--danger-border, rgba(239, 68, 68, 0.3))', background: 'var(--danger-background, rgba(239, 68, 68, 0.05))' }}
                >
                    <div className="section-title" style={{ color: 'var(--danger-color, #ef4444)' }}>
                        <span>⚠️ Advanced Mode</span>
                    </div>
                    <div className="form-grid">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                id="advanced-mode"
                                checked={advancedMode}
                                onChange={handleAdvancedToggle}
                            />
                            <label htmlFor="advanced-mode" className="checkbox-label">
                                Enable Advanced Mode
                            </label>
                        </div>
                        <div className="form-description" style={{ marginLeft: 24, marginTop: -8 }}>
                            Unlock experimental features, developer tools, and advanced configuration options.
                            <br />
                            <strong>Note:</strong> Advanced mode adds a new icon to the main navigation bar.
                        </div>
                    </div>
                </div>

                <div className="settings-note">
                    💡 Settings are automatically saved. Changes will take effect immediately or on the next session start.
                </div>
            </div>
        </CustomizeShell>
    );
};

function updateBackgroundTransparency(value) {
    const root = document.documentElement;
    root.style.setProperty('--header-background', `rgba(0, 0, 0, ${value})`);
    root.style.setProperty('--main-content-background', `rgba(0, 0, 0, ${value})`);
    root.style.setProperty('--card-background', `rgba(255, 255, 255, ${value * 0.05})`);
    root.style.setProperty('--input-background', `rgba(0, 0, 0, ${value * 0.375})`);
    root.style.setProperty('--input-focus-background', `rgba(0, 0, 0, ${value * 0.625})`);
    root.style.setProperty('--button-background', `rgba(0, 0, 0, ${value * 0.625})`);
    root.style.setProperty('--preview-video-background', `rgba(0, 0, 0, ${value * 1.125})`);
    root.style.setProperty('--screen-option-background', `rgba(0, 0, 0, ${value * 0.5})`);
    root.style.setProperty('--screen-option-hover-background', `rgba(0, 0, 0, ${value * 0.75})`);
    root.style.setProperty('--scrollbar-background', `rgba(0, 0, 0, ${value * 0.5})`);
}

export default CustomizeView;
