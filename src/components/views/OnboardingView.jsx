import React, { useState, useEffect } from 'react';

const OnboardingView = ({ onComplete, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [contextInfo, setContextInfo] = useState('');

    const slides = [
        {
            icon: '👋',
            title: 'Welcome to Cheating Daddy',
            content: 'Your real-time AI assistant for interviews, presentations, and meetings. Get instant help whenever you need it.',
        },
        {
            icon: '🎥',
            title: 'Screen & Audio Capture',
            content: 'The app captures what you see and hear, analyzing it to provide contextual, real-time assistance.',
        },
        {
            icon: '🤖',
            title: 'Powered by Gemini',
            content: 'Using Google\'s Gemini 2.0 Flash Live API for fast, accurate responses to your questions.',
        },
        {
            icon: '🔐',
            title: 'Privacy First',
            content: 'Your data is processed securely. The app works locally on your machine, no unnecessary cloud storage.',
        },
        {
            icon: '⚙️',
            title: 'Customize Your Experience',
            content: 'Choose from multiple profiles (interview, sales, meetings, etc.) and adjust settings to fit your needs.',
        },
        {
            icon: '✨',
            title: 'Ready to Get Started?',
            content: 'Click "Get Started" below to continue. You\'ll need a Gemini API key to use the app.',
        },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleGetStarted = async () => {
        localStorage.setItem('onboardingCompleted', 'true');
        if (contextInfo.trim()) {
            localStorage.setItem('contextInfo', contextInfo);
        }
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('set-onboarded');
            } catch (error) {
                console.error('Error setting onboarded:', error);
            }
        }
        onComplete();
    };

    const slide = slides[currentSlide];
    const isLastSlide = currentSlide === slides.length - 1;
    const isContextSlide = currentSlide === slides.length - 1;

    return (
        <div className="w-screen h-screen bg-black overflow-hidden flex flex-col">
            {/* Animated background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 100, 0.2) 0%, transparent 50%)',
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center px-12 md:px-16 max-w-2xl relative z-10">
                <div className="text-5xl mb-4">{slide.icon}</div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{slide.title}</h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">{slide.content}</p>

                {isContextSlide && (
                    <textarea
                        value={contextInfo}
                        onChange={(e) => setContextInfo(e.target.value)}
                        placeholder="Enter any context or additional information (optional)"
                        className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 resize-vertical mb-8 text-sm"
                    />
                )}

                {/* Progress dots */}
                <div className="flex gap-2 mb-8">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index <= currentSlide
                                    ? 'bg-blue-500 w-2'
                                    : 'bg-gray-600 w-1.5'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/30 border-t border-white/5 relative z-10">
                <button
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button>

                <span className="text-gray-400 text-sm">
                    {currentSlide + 1} / {slides.length}
                </span>

                {!isLastSlide ? (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleGetStarted}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Get Started ✓
                    </button>
                )}
            </div>
        </div>
    );
};

export { OnboardingView };
