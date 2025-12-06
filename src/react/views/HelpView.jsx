import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { resizeLayout } from '../../utils/windowResize';

const HelpShell = styled.div`
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        cursor: default;
        user-select: none;
    }

    & {
        display: block;
        padding: 12px;
    }

    .help-container {
        display: grid;
        gap: 12px;
        padding-bottom: 20px;
    }

    .option-group {
        background: var(--card-background, rgba(255, 255, 255, 0.04));
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
        border-radius: 6px;
        padding: 16px;
        backdrop-filter: blur(10px);
    }

    .option-label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: var(--text-color);
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .option-label::before {
        content: '';
        width: 3px;
        height: 14px;
        background: var(--accent-color, #007aff);
        border-radius: 1.5px;
    }

    .description {
        color: var(--description-color, rgba(255, 255, 255, 0.75));
        font-size: 12px;
        line-height: 1.4;
        user-select: text;
        cursor: text;
    }

    .link {
        color: var(--link-color, #007aff);
        text-decoration: none;
        cursor: pointer;
        transition: color 0.15s ease;
        user-select: text;
    }

    .link:hover {
        color: var(--link-hover-color, #0056b3);
        text-decoration: underline;
    }

    .key {
        background: var(--key-background, rgba(0, 0, 0, 0.3));
        color: var(--text-color);
        border: 1px solid var(--key-border, rgba(255, 255, 255, 0.15));
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
        font-weight: 500;
        margin: 0 1px;
        white-space: nowrap;
        user-select: text;
        cursor: text;
    }

    .keyboard-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
        margin-top: 8px;
    }

    .keyboard-group {
        background: var(--input-background, rgba(0, 0, 0, 0.2));
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.1));
        border-radius: 4px;
        padding: 10px;
    }

    .keyboard-group-title {
        font-weight: 600;
        font-size: 12px;
        color: var(--text-color);
        margin-bottom: 6px;
        padding-bottom: 3px;
    }

    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px 0;
        font-size: 11px;
    }

    .shortcut-description {
        color: var(--description-color, rgba(255, 255, 255, 0.7));
        user-select: text;
        cursor: text;
    }

    .shortcut-keys {
        display: flex;
        gap: 2px;
    }

    .profiles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 8px;
    }

    .profile-item {
        background: var(--input-background, rgba(0, 0, 0, 0.2));
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.1));
        border-radius: 4px;
        padding: 8px;
    }

    .profile-name {
        font-weight: 600;
        font-size: 12px;
        color: var(--text-color);
        margin-bottom: 3px;
        user-select: text;
        cursor: text;
    }

    .profile-description {
        font-size: 10px;
        color: var(--description-color, rgba(255, 255, 255, 0.6));
        line-height: 1.3;
        user-select: text;
        cursor: text;
    }

    .community-links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .community-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: var(--input-background, rgba(0, 0, 0, 0.2));
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.1));
        border-radius: 4px;
        text-decoration: none;
        color: var(--link-color, #007aff);
        font-size: 11px;
        font-weight: 500;
        transition: all 0.15s ease;
        cursor: pointer;
    }

    .community-link:hover {
        background: var(--input-hover-background, rgba(0, 0, 0, 0.3));
        border-color: var(--link-color, #007aff);
    }

    .usage-steps {
        counter-reset: step-counter;
    }

    .usage-step {
        counter-increment: step-counter;
        position: relative;
        padding-left: 24px;
        margin-bottom: 6px;
        font-size: 11px;
        line-height: 1.3;
        user-select: text;
        cursor: text;
    }

    .usage-step::before {
        content: counter(step-counter);
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 16px;
        background: var(--link-color, #007aff);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 600;
    }
`;

const defaultKeybinds = () => {
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

const profiles = [
    { name: 'Job Interview', description: 'Get help with interview questions and responses' },
    { name: 'Sales Call', description: 'Assistance with sales conversations and objection handling' },
    { name: 'Business Meeting', description: 'Support for professional meetings and discussions' },
    { name: 'Presentation', description: 'Help with presentations and public speaking' },
    { name: 'Negotiation', description: 'Guidance for business negotiations and deals' },
    { name: 'Exam Assistant', description: 'Academic assistance for test-taking and exam questions' },
];

const HelpView = ({ onExternalLinkClick }) => {
    const [keybinds] = useState(() => {
        const stored = localStorage.getItem('customKeybinds');
        if (!stored) {
            return defaultKeybinds();
        }
        try {
            return { ...defaultKeybinds(), ...JSON.parse(stored) };
        } catch (error) {
            console.error('Failed to parse saved keybinds:', error);
            return defaultKeybinds();
        }
    });

    useEffect(() => {
        resizeLayout();
    }, []);

    const platformInfo = useMemo(() => {
        const isMacOS = window.cheddar?.isMacOS || false;
        const isLinux = window.cheddar?.isLinux || false;
        return { isMacOS, isLinux };
    }, []);

    const formatKeybind = bind => {
        return bind.split('+').map(part => (
            <span key={`${bind}-${part}`} className="key">
                {part}
            </span>
        ));
    };

    const handleLinkClick = url => {
        onExternalLinkClick?.(url);
    };

    return (
        <HelpShell>
            <div className="help-container">
                <div className="option-group">
                    <div className="option-label">
                        <span>Community &amp; Support</span>
                    </div>
                    <div className="community-links">
                        <div className="community-link" onClick={() => handleLinkClick('https://cheatingdaddy.com')}>
                            🌐 Official Website
                        </div>
                        <div className="community-link" onClick={() => handleLinkClick('https://github.com/sohzm/cheating-daddy')}>
                            📂 GitHub Repository
                        </div>
                        <div className="community-link" onClick={() => handleLinkClick('https://discord.gg/GCBdubnXfJ')}>
                            💬 Discord Community
                        </div>
                    </div>
                </div>

                <div className="option-group">
                    <div className="option-label">
                        <span>Keyboard Shortcuts</span>
                    </div>
                    <div className="keyboard-section">
                        <div className="keyboard-group">
                            <div className="keyboard-group-title">Window Movement</div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Move window up</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.moveUp)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Move window down</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.moveDown)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Move window left</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.moveLeft)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Move window right</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.moveRight)}</div>
                            </div>
                        </div>
                        <div className="keyboard-group">
                            <div className="keyboard-group-title">Window Control</div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Toggle click-through mode</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.toggleClickThrough)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Toggle window visibility</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.toggleVisibility)}</div>
                            </div>
                        </div>
                        <div className="keyboard-group">
                            <div className="keyboard-group-title">AI Actions</div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Take screenshot and ask for next step</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.nextStep)}</div>
                            </div>
                        </div>
                        <div className="keyboard-group">
                            <div className="keyboard-group-title">Response Navigation</div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Previous response</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.previousResponse)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Next response</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.nextResponse)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Scroll response up</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.scrollUp)}</div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Scroll response down</span>
                                <div className="shortcut-keys">{formatKeybind(keybinds.scrollDown)}</div>
                            </div>
                        </div>
                        <div className="keyboard-group">
                            <div className="keyboard-group-title">Text Input</div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">Send message to AI</span>
                                <div className="shortcut-keys">
                                    <span className="key">Enter</span>
                                </div>
                            </div>
                            <div className="shortcut-item">
                                <span className="shortcut-description">New line in text input</span>
                                <div className="shortcut-keys">
                                    <span className="key">Shift</span>
                                    <span className="key">Enter</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="description" style={{ marginTop: 12, fontStyle: 'italic', textAlign: 'center' }}>
                        💡 You can customize these shortcuts in the Settings page!
                    </div>
                </div>

                <div className="option-group">
                    <div className="option-label">
                        <span>How to Use</span>
                    </div>
                    <div className="usage-steps">
                        <div className="usage-step">
                            <strong>Start a Session:</strong> Enter your Gemini API key and click "Start Session"
                        </div>
                        <div className="usage-step">
                            <strong>Customize:</strong> Choose your profile and language in the settings
                        </div>
                        <div className="usage-step">
                            <strong>Position Window:</strong> Use keyboard shortcuts to move the window to your desired location
                        </div>
                        <div className="usage-step">
                            <strong>Click-through Mode:</strong> Use {formatKeybind(keybinds.toggleClickThrough)} to make the window click-through
                        </div>
                        <div className="usage-step">
                            <strong>Get AI Help:</strong> The AI will analyze your screen and audio to provide assistance
                        </div>
                        <div className="usage-step">
                            <strong>Text Messages:</strong> Type questions or requests to the AI using the text input
                        </div>
                        <div className="usage-step">
                            <strong>Navigate Responses:</strong> Use {formatKeybind(keybinds.previousResponse)} and {formatKeybind(keybinds.nextResponse)} to browse responses
                        </div>
                    </div>
                </div>

                <div className="option-group">
                    <div className="option-label">
                        <span>Supported Profiles</span>
                    </div>
                    <div className="profiles-grid">
                        {profiles.map(profile => (
                            <div key={profile.name} className="profile-item">
                                <div className="profile-name">{profile.name}</div>
                                <div className="profile-description">{profile.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="option-group">
                    <div className="option-label">
                        <span>Audio Input</span>
                    </div>
                    <div className="description">
                        The AI listens to conversations and provides contextual assistance based on what it hears.
                        <br />
                        Platform: {platformInfo.isMacOS ? 'macOS' : platformInfo.isLinux ? 'Linux' : 'Windows'}
                    </div>
                </div>
            </div>
        </HelpShell>
    );
};

export default HelpView;
