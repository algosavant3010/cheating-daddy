import React, { useState, useEffect } from 'react';

const AdvancedView = () => {
    const [throttleEnabled, setThrottleEnabled] = useState(
        localStorage.getItem('throttleTokens') === 'true'
    );
    const [maxTokens, setMaxTokens] = useState(
        parseInt(localStorage.getItem('maxTokensPerMin') || '1000000', 10)
    );
    const [throttlePercent, setThrottlePercent] = useState(
        parseInt(localStorage.getItem('throttleAtPercent') || '75', 10)
    );
    const [contentProtection, setContentProtection] = useState(
        localStorage.getItem('contentProtection') === 'true'
    );
    const [stealthLevel, setStealthLevel] = useState(
        localStorage.getItem('stealthLevel') || 'balanced'
    );

    useEffect(() => {
        localStorage.setItem('throttleTokens', throttleEnabled.toString());
    }, [throttleEnabled]);

    useEffect(() => {
        localStorage.setItem('maxTokensPerMin', maxTokens.toString());
    }, [maxTokens]);

    useEffect(() => {
        localStorage.setItem('throttleAtPercent', throttlePercent.toString());
    }, [throttlePercent]);

    useEffect(() => {
        localStorage.setItem('contentProtection', contentProtection.toString());
    }, [contentProtection]);

    useEffect(() => {
        localStorage.setItem('stealthLevel', stealthLevel);
    }, [stealthLevel]);

    const handleDataWipe = async () => {
        if (window.confirm('Are you sure you want to wipe all local data? This cannot be undone.')) {
            localStorage.clear();
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    await ipcRenderer.invoke('wipe-local-data');
                    window.location.reload();
                } catch (error) {
                    console.error('Error wiping data:', error);
                }
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto pb-5">
            <h2 className="text-2xl font-bold text-white mb-6">Advanced Settings</h2>

            {/* Token Throttling */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                            Token Throttling
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Limit token usage to prevent exceeding API quotas</p>
                    </div>
                    <button
                        onClick={() => setThrottleEnabled(!throttleEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            throttleEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                throttleEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {throttleEnabled && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div>
                            <label className="text-xs font-semibold text-gray-300 block mb-2">
                                Max Tokens per Minute
                            </label>
                            <input
                                type="number"
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                                className="w-full bg-white/5 border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                min="10000"
                                step="10000"
                            />
                            <p className="text-xs text-gray-500 mt-1">Current: {maxTokens.toLocaleString()} tokens/min</p>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-300 block mb-2">
                                Throttle at {throttlePercent}% of Max
                            </label>
                            <input
                                type="range"
                                value={throttlePercent}
                                onChange={(e) => setThrottlePercent(parseInt(e.target.value, 10))}
                                min="10"
                                max="100"
                                step="5"
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10%</span>
                                <span>{throttlePercent}%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Protection */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                            Content Protection
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Prevent screenshots of the window content</p>
                    </div>
                    <button
                        onClick={() => setContentProtection(!contentProtection)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            contentProtection ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                contentProtection ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Stealth Level */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Stealth Level
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'visible', name: 'Visible', desc: 'Normal mode' },
                        { id: 'balanced', name: 'Balanced', desc: 'Some obfuscation' },
                        { id: 'ultra', name: 'Ultra', desc: 'Maximum stealth' },
                    ].map((level) => (
                        <button
                            key={level.id}
                            onClick={() => setStealthLevel(level.id)}
                            className={`p-3 rounded-lg border transition-all text-center ${
                                stealthLevel === level.id
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            <div className="text-sm font-medium">{level.name}</div>
                            <div className="text-xs text-gray-500">{level.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-red-500 rounded"></span>
                    Data Management
                </h3>
                <p className="text-xs text-gray-300 mb-4">
                    Permanently delete all local data including settings, API keys, and session history.
                </p>
                <button
                    onClick={handleDataWipe}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Wipe All Local Data
                </button>
            </div>

            {/* System Info */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-semibold text-white mb-3">System Information</h3>
                <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                        <span>Platform:</span>
                        <span className="text-white">{navigator.platform}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>User Agent:</span>
                        <span className="text-white truncate">{navigator.userAgent.substring(0, 30)}...</span>
                    </div>
                    <div className="flex justify-between">
                        <span>App Version:</span>
                        <span className="text-white">0.4.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdvancedView };
