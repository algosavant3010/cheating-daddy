import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { resizeLayout } from '../../utils/windowResize';

const MainViewShell = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;

    .welcome {
        font-size: 24px;
        margin-bottom: 8px;
        font-weight: 600;
        margin-top: auto;
    }

    .input-group {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
    }

    .input-group input {
        flex: 1;
    }

    input {
        background: var(--input-background);
        color: var(--text-color);
        border: 1px solid var(--button-border);
        padding: 10px 14px;
        width: 100%;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--focus-border-color);
        box-shadow: 0 0 0 3px var(--focus-box-shadow);
        background: var(--input-focus-background);
    }

    input::placeholder {
        color: var(--placeholder-color);
    }

    input.api-key-error {
        animation: blink-red 1s ease-in-out;
        border-color: #ff4444;
    }

    @keyframes blink-red {
        0%,
        100% {
            border-color: var(--button-border);
            background: var(--input-background);
        }
        25%,
        75% {
            border-color: #ff4444;
            background: rgba(255, 68, 68, 0.1);
        }
        50% {
            border-color: #ff6666;
            background: rgba(255, 68, 68, 0.15);
        }
    }

    .start-button {
        background: var(--start-button-background);
        color: var(--start-button-color);
        border: 1px solid var(--start-button-border);
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .start-button:hover {
        background: var(--start-button-hover-background);
        border-color: var(--start-button-hover-border);
        cursor: pointer;
    }

    .start-button.initializing,
    .start-button.initializing:hover {
        opacity: 0.5;
        background: var(--start-button-background);
        border-color: var(--start-button-border);
        cursor: default;
    }

    .shortcut-icons {
        display: flex;
        align-items: center;
        gap: 2px;
        margin-left: 4px;
    }

    .shortcut-icons svg {
        width: 14px;
        height: 14px;
    }

    .shortcut-icons svg path {
        stroke: currentColor;
    }

    .description {
        color: var(--description-color);
        font-size: 14px;
        margin-bottom: 24px;
        line-height: 1.5;
    }

    .link {
        color: var(--link-color);
        text-decoration: underline;
        cursor: pointer;
    }
`;

const MainView = ({ onStart, onAPIKeyHelp, onLayoutModeChange, isInitializing, showApiKeyError, onDismissApiKeyError }) => {
    const [apiKeyValue, setApiKeyValue] = useState(() => localStorage.getItem('apiKey') || '');

    useEffect(() => {
        resizeLayout();
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            onLayoutModeChange(savedLayoutMode);
        }
    }, [onLayoutModeChange]);

    useEffect(() => {
        const handler = event => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const isShortcut = isMac ? event.metaKey && event.key === 'Enter' : event.ctrlKey && event.key === 'Enter';
            if (isShortcut) {
                event.preventDefault();
                if (!isInitializing) {
                    onStart();
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onStart, isInitializing]);

    const handleInputChange = event => {
        const value = event.target.value;
        setApiKeyValue(value);
        localStorage.setItem('apiKey', value);
        if (showApiKeyError) {
            onDismissApiKeyError?.();
        }
    };

    const handleStartClick = () => {
        if (!isInitializing) {
            onStart();
        }
    };

    const buttonContent = useMemo(() => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const enterIcon = (
            <svg width="14px" height="14px" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.25 19.25L6.75 15.75L10.25 12.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.75 15.75H12.75C14.9591 15.75 16.75 13.9591 16.75 11.75V4.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );

        if (isMac) {
            return (
                <>
                    Start Session
                    <span className="shortcut-icons">
                        <svg width="14px" height="14px" viewBox="0 0 24 24" strokeWidth="2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {enterIcon}
                    </span>
                </>
            );
        }

        return (
            <>
                Start Session
                <span className="shortcut-icons">
                    Ctrl
                    {enterIcon}
                </span>
            </>
        );
    }, []);

    return (
        <MainViewShell>
            <div className="welcome">Welcome</div>
            <div className="input-group">
                <input
                    type="password"
                    placeholder="Enter your Gemini API Key"
                    value={apiKeyValue}
                    onChange={handleInputChange}
                    className={showApiKeyError ? 'api-key-error' : ''}
                />
                <button
                    className={`start-button${isInitializing ? ' initializing' : ''}`}
                    onClick={handleStartClick}
                    disabled={isInitializing}
                    type="button"
                >
                    {buttonContent}
                </button>
            </div>
            <p className="description">
                dont have an api key?
                <span onClick={onAPIKeyHelp} className="link">
                    get one here
                </span>
            </p>
        </MainViewShell>
    );
};

export default MainView;
