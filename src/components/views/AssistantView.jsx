import React, { useState, useEffect, useRef } from 'react';

const AssistantView = ({
    responses,
    currentResponseIndex,
    selectedProfile,
    onSendText,
    shouldAnimateResponse,
    onResponseIndexChanged,
    onResponseAnimationComplete,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const responseContainerRef = useRef(null);

    useEffect(() => {
        if (responseContainerRef.current) {
            responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }
    }, [responses, currentResponseIndex]);

    useEffect(() => {
        if (shouldAnimateResponse && onResponseAnimationComplete) {
            const timer = setTimeout(() => {
                onResponseAnimationComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimateResponse, onResponseAnimationComplete]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;

        const message = inputValue.trim();
        setInputValue('');
        setIsSending(true);

        try {
            await onSendText(message);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSend();
        }
    };

    const getCurrentResponse = () => {
        if (currentResponseIndex >= 0 && currentResponseIndex < responses.length) {
            return responses[currentResponseIndex];
        }
        return '';
    };

    const currentResponse = getCurrentResponse();

    const parseMarkdown = (text) => {
        // Basic markdown parsing - in a real app, you'd use a library like marked
        try {
            const html = window.marked?.parse?.(text) || text;
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (error) {
            return <div>{text}</div>;
        }
    };

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Response container */}
            <div
                ref={responseContainerRef}
                className="flex-1 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4 text-text-color leading-relaxed"
                style={{
                    fontSize: 'var(--response-font-size, 16px)',
                    scrollBehavior: 'smooth',
                    userSelect: 'text',
                }}
            >
                {currentResponse ? (
                    <div className={shouldAnimateResponse ? 'animate-fadeInUp' : ''}>
                        {parseMarkdown(currentResponse)}
                    </div>
                ) : (
                    <div className="text-gray-400 text-sm">Waiting for response...</div>
                )}
            </div>

            {/* Navigation buttons */}
            {responses.length > 1 && (
                <div className="flex gap-2 justify-center items-center py-2 border-t border-white/10">
                    <button
                        onClick={() => onResponseIndexChanged(Math.max(0, currentResponseIndex - 1))}
                        disabled={currentResponseIndex === 0}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                    >
                        ← Previous
                    </button>
                    <span className="text-xs text-gray-400">
                        {currentResponseIndex + 1} / {responses.length}
                    </span>
                    <button
                        onClick={() => onResponseIndexChanged(Math.min(responses.length - 1, currentResponseIndex + 1))}
                        disabled={currentResponseIndex === responses.length - 1}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Input area */}
            <div className="flex gap-2 border-t border-white/10 pt-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Send a message (Shift+Enter for new line)"
                    disabled={isSending}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    onClick={handleSend}
                    disabled={isSending || !inputValue.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export { AssistantView };
