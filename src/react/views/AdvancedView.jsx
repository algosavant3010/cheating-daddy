import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { resizeLayout } from '../../utils/windowResize';

const AdvancedShell = styled.div`
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

    .advanced-container {
        display: grid;
        gap: 12px;
        padding-bottom: 20px;
    }

    .advanced-section {
        background: var(--card-background, rgba(255, 255, 255, 0.04));
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
        border-radius: 6px;
        padding: 16px;
        backdrop-filter: blur(10px);
    }

    .danger-section {
        border-color: var(--danger-border, rgba(239, 68, 68, 0.3));
        background: var(--danger-background, rgba(239, 68, 68, 0.05));
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

    .advanced-description {
        font-size: 12px;
        color: var(--description-color, rgba(255, 255, 255, 0.7));
        line-height: 1.4;
        margin-bottom: 16px;
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

    .action-button {
        background: var(--button-background, rgba(255, 255, 255, 0.1));
        color: var(--text-color);
        border: 1px solid var(--button-border, rgba(255, 255, 255, 0.15));
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .action-button:hover {
        background: var(--button-hover-background, rgba(255, 255, 255, 0.15));
        border-color: var(--button-hover-border, rgba(255, 255, 255, 0.25));
    }

    .danger-button {
        background: var(--danger-button-background, rgba(239, 68, 68, 0.1));
        color: var(--danger-color, #ef4444);
        border-color: var(--danger-border, rgba(239, 68, 68, 0.3));
    }

    .danger-button:hover {
        background: var(--danger-button-hover, rgba(239, 68, 68, 0.15));
        border-color: var(--danger-border-hover, rgba(239, 68, 68, 0.4));
    }

    .status-message {
        margin-top: 12px;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
    }

    .status-success {
        background: var(--success-background, rgba(34, 197, 94, 0.1));
        color: var(--success-color, #22c55e);
        border: 1px solid var(--success-border, rgba(34, 197, 94, 0.2));
    }

    .status-error {
        background: var(--danger-background, rgba(239, 68, 68, 0.1));
        color: var(--danger-color, #ef4444);
        border: 1px solid var(--danger-border, rgba(239, 68, 68, 0.2));
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

    .form-label {
        font-weight: 500;
        font-size: 12px;
        color: var(--label-color, rgba(255, 255, 255, 0.9));
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .form-control {
        background: var(--input-background, rgba(0, 0, 0, 0.3));
        color: var(--text-color);
        border: 1px solid var(--input-border, rgba(255, 255, 255, 0.15));
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 12px;
        transition: all 0.15s ease;
    }
`;

const AdvancedView = () => {
    const [isClearing, setIsClearing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [throttleTokens, setThrottleTokens] = useState(() => localStorage.getItem('throttleTokens') !== 'false');
    const [maxTokensPerMin, setMaxTokensPerMin] = useState(() => parseInt(localStorage.getItem('maxTokensPerMin'), 10) || 1000000);
    const [throttleAtPercent, setThrottleAtPercent] = useState(() => parseInt(localStorage.getItem('throttleAtPercent'), 10) || 75);
    const [contentProtection, setContentProtection] = useState(() => {
        const stored = localStorage.getItem('contentProtection');
        return stored !== null ? stored === 'true' : true;
    });

    useEffect(() => {
        resizeLayout();
    }, []);

    const handleClearData = async () => {
        if (isClearing) {
            return;
        }
        setIsClearing(true);
        setStatusMessage('');
        setStatusType('');
        try {
            localStorage.clear();
            sessionStorage.clear();
            if ('indexedDB' in window && indexedDB.databases) {
                const databases = await indexedDB.databases();
                await Promise.all(
                    databases.map(db => {
                        if (!db.name) {
                            return Promise.resolve();
                        }
                        return new Promise(resolve => {
                            const request = indexedDB.deleteDatabase(db.name);
                            request.onsuccess = () => resolve();
                            request.onerror = () => resolve();
                            request.onblocked = () => resolve();
                        });
                    })
                );
            }
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            setStatusMessage('✅ Successfully cleared local data. Closing application...');
            setStatusType('success');
            setTimeout(async () => {
                if (window.require) {
                    const { ipcRenderer } = window.require('electron');
                    await ipcRenderer.invoke('quit-application');
                }
            }, 1500);
        } catch (error) {
            console.error('Error clearing data:', error);
            setStatusMessage(`❌ Error clearing data: ${error.message}`);
            setStatusType('error');
        } finally {
            setIsClearing(false);
        }
    };

    const handleThrottleToggle = event => {
        const enabled = event.target.checked;
        setThrottleTokens(enabled);
        localStorage.setItem('throttleTokens', enabled.toString());
    };

    const handleMaxTokensChange = event => {
        const value = parseInt(event.target.value, 10);
        if (!Number.isNaN(value) && value > 0) {
            setMaxTokensPerMin(value);
            localStorage.setItem('maxTokensPerMin', value.toString());
        }
    };

    const handleThrottlePercentChange = event => {
        const value = parseInt(event.target.value, 10);
        if (!Number.isNaN(value) && value >= 0 && value <= 100) {
            setThrottleAtPercent(value);
            localStorage.setItem('throttleAtPercent', value.toString());
        }
    };

    const resetRateLimitSettings = () => {
        setThrottleTokens(true);
        setMaxTokensPerMin(1000000);
        setThrottleAtPercent(75);
        localStorage.removeItem('throttleTokens');
        localStorage.removeItem('maxTokensPerMin');
        localStorage.removeItem('throttleAtPercent');
    };

    const handleContentProtectionChange = async event => {
        const enabled = event.target.checked;
        setContentProtection(enabled);
        localStorage.setItem('contentProtection', enabled.toString());
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-content-protection', enabled);
            } catch (error) {
                console.error('Failed to update content protection:', error);
            }
        }
    };

    return (
        <AdvancedShell>
            <div className="advanced-container">
                <div className="advanced-section">
                    <div className="section-title">
                        <span>🔒 Content Protection</span>
                    </div>
                    <div className="advanced-description">Prevent screen capture utilities from recording the assistant window.</div>
                    <div className="checkbox-group">
                        <input type="checkbox" className="checkbox-input" checked={contentProtection} onChange={handleContentProtectionChange} id="content-protection" />
                        <label htmlFor="content-protection" className="checkbox-label">
                            Enable content protection
                        </label>
                    </div>
                </div>

                <div className="advanced-section">
                    <div className="section-title">
                        <span>📊 Rate Limiting</span>
                    </div>
                    <div className="advanced-description">Avoid exceeding Gemini token limits by throttling screenshot frequency.</div>
                    <div className="form-grid">
                        <div className="checkbox-group">
                            <input type="checkbox" className="checkbox-input" checked={throttleTokens} onChange={handleThrottleToggle} id="token-throttle" />
                            <label htmlFor="token-throttle" className="checkbox-label">
                                Enable token throttling
                            </label>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Max tokens per minute</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={maxTokensPerMin}
                                    onChange={handleMaxTokensChange}
                                    min={1000}
                                    step={1000}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Throttle at (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={throttleAtPercent}
                                    onChange={handleThrottlePercentChange}
                                    min={0}
                                    max={100}
                                />
                            </div>
                        </div>
                        <button className="action-button" type="button" onClick={resetRateLimitSettings}>
                            Reset defaults
                        </button>
                    </div>
                </div>

                <div className="advanced-section danger-section">
                    <div className="section-title" style={{ color: 'var(--danger-color, #ef4444)' }}>
                        <span>🧹 Clear Local Data</span>
                    </div>
                    <div className="advanced-description">
                        Removes API keys, settings, and cached conversations from this device. The application will close once the purge is complete.
                    </div>
                    <button className="action-button danger-button" type="button" onClick={handleClearData} disabled={isClearing}>
                        {isClearing ? 'Clearing...' : 'Clear and Exit'}
                    </button>
                    {statusMessage && <div className={`status-message ${statusType === 'success' ? 'status-success' : 'status-error'}`}>{statusMessage}</div>}
                </div>
            </div>
        </AdvancedShell>
    );
};

export default AdvancedView;
