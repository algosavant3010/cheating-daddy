import React from 'react';

const HelpView = ({ onExternalLinkClick }) => {
    const faqs = [
        {
            question: 'How do I get a Gemini API key?',
            answer: 'Visit Google AI Studio (aistudio.google.com/apikey) and follow the instructions to generate your API key.',
        },
        {
            question: 'What information is captured?',
            answer: 'Cheating Daddy captures your screen and audio to provide contextual assistance. This data is processed locally on your machine.',
        },
        {
            question: 'Can I use this in interviews?',
            answer: 'This tool is designed for practice and learning. Make sure to check the rules of your interview or test before using it.',
        },
        {
            question: 'How do I move the window?',
            answer: 'Use Ctrl/Cmd + Arrow Keys to move the window around your screen.',
        },
        {
            question: 'What is click-through mode?',
            answer: 'Click-through mode (Ctrl/Cmd + M) makes the window transparent to mouse clicks, allowing you to interact with elements behind it.',
        },
        {
            question: 'How do I stop a session?',
            answer: 'Press Ctrl/Cmd + \\ (backslash) or click the X button in the header to close the session.',
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto pb-5">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/8 transition-colors">
                        <h3 className="text-sm font-semibold text-white mb-2">
                            {faq.question}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Move window left/right/up/down:</span>
                        <span className="font-mono text-white">Ctrl/Cmd + Arrow Keys</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Toggle click-through mode:</span>
                        <span className="font-mono text-white">Ctrl/Cmd + M</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Close or go back:</span>
                        <span className="font-mono text-white">Ctrl/Cmd + \\</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Send message:</span>
                        <span className="font-mono text-white">Enter</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Start session:</span>
                        <span className="font-mono text-white">Ctrl/Cmd + Enter</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
                <p>For more information, visit <button onClick={() => onExternalLinkClick('https://cheatingdaddy.com')} className="text-blue-400 hover:text-blue-300 underline">cheatingdaddy.com</button></p>
            </div>
        </div>
    );
};

export { HelpView };
