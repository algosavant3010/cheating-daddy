import React, { useState } from 'react';

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
    const profiles = [
        { id: 'interview', name: 'Interview', emoji: '🎤' },
        { id: 'sales-call', name: 'Sales Call', emoji: '📞' },
        { id: 'meeting', name: 'Meeting', emoji: '👥' },
        { id: 'presentation', name: 'Presentation', emoji: '📊' },
        { id: 'negotiation', name: 'Negotiation', emoji: '🤝' },
    ];

    const languages = [
        { id: 'en-US', name: 'English (US)' },
        { id: 'en-GB', name: 'English (UK)' },
        { id: 'es-ES', name: 'Spanish' },
        { id: 'fr-FR', name: 'French' },
        { id: 'de-DE', name: 'German' },
        { id: 'it-IT', name: 'Italian' },
        { id: 'pt-BR', name: 'Portuguese (Brazil)' },
        { id: 'ja-JP', name: 'Japanese' },
        { id: 'zh-CN', name: 'Chinese (Simplified)' },
        { id: 'zh-TW', name: 'Chinese (Traditional)' },
        { id: 'ko-KR', name: 'Korean' },
    ];

    const screenshotIntervals = [
        { id: 'manual', name: 'Manual' },
        { id: '2', name: 'Every 2 seconds' },
        { id: '5', name: 'Every 5 seconds' },
        { id: '10', name: 'Every 10 seconds' },
    ];

    const imageQualities = [
        { id: 'low', name: 'Low (256px)' },
        { id: 'medium', name: 'Medium (512px)' },
        { id: 'high', name: 'High (1024px)' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto pb-5">
            {/* Profile Selection */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Profile
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => onProfileChange(profile.id)}
                            className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                                selectedProfile === profile.id
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            <div className="text-lg mb-1">{profile.emoji}</div>
                            <div>{profile.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Language
                </h3>
                <select
                    value={selectedLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10"
                >
                    {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Screenshot Settings */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Screenshot Interval
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {screenshotIntervals.map((interval) => (
                        <button
                            key={interval.id}
                            onClick={() => onScreenshotIntervalChange(interval.id)}
                            className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                                selectedScreenshotInterval === interval.id
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {interval.name}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Lower intervals use more tokens but provide more context.</p>
            </div>

            {/* Image Quality */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Image Quality
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {imageQualities.map((quality) => (
                        <button
                            key={quality.id}
                            onClick={() => onImageQualityChange(quality.id)}
                            className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                                selectedImageQuality === quality.id
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {quality.name}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Higher quality uses more tokens but provides better detail.</p>
            </div>

            {/* Layout Mode */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                    Layout Mode
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onLayoutModeChange('normal')}
                        className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                            layoutMode === 'normal'
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        Normal
                    </button>
                    <button
                        onClick={() => onLayoutModeChange('compact')}
                        className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                            layoutMode === 'compact'
                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        Compact
                    </button>
                </div>
            </div>

            {/* Advanced Mode Toggle */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
                            Advanced Mode
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Enable advanced settings and controls</p>
                    </div>
                    <button
                        onClick={() => onAdvancedModeChange(!advancedMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            advancedMode ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                advancedMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { CustomizeView };
