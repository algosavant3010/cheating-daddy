import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const AssistantShell = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;

    * {
        font-family: 'Inter', sans-serif;
        cursor: default;
    }

    .response-container {
        height: calc(100% - 60px);
        overflow-y: auto;
        border-radius: 10px;
        font-size: var(--response-font-size, 18px);
        line-height: 1.6;
        background: var(--main-content-background);
        padding: 16px;
        scroll-behavior: smooth;
        user-select: text;
        cursor: text;
    }

    .response-container * {
        user-select: text;
        cursor: text;
    }

    .response-container [data-word] {
        opacity: 0;
        filter: blur(10px);
        display: inline-block;
        transition: opacity 0.5s, filter 0.5s;
    }

    .response-container [data-word].visible {
        opacity: 1;
        filter: blur(0px);
    }

    .response-container h1,
    .response-container h2,
    .response-container h3,
    .response-container h4,
    .response-container h5,
    .response-container h6 {
        margin: 1.2em 0 0.6em 0;
        color: var(--text-color);
        font-weight: 600;
    }

    .response-container p {
        margin: 0.8em 0;
        color: var(--text-color);
    }

    .response-container ul,
    .response-container ol {
        margin: 0.8em 0;
        padding-left: 2em;
        color: var(--text-color);
    }

    .response-container blockquote {
        margin: 1em 0;
        padding: 0.5em 1em;
        border-left: 4px solid var(--focus-border-color);
        background: rgba(0, 122, 255, 0.1);
        font-style: italic;
    }

    .response-container code {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85em;
    }

    .response-container pre {
        background: var(--input-background);
        border: 1px solid var(--button-border);
        border-radius: 6px;
        padding: 1em;
        overflow-x: auto;
        margin: 1em 0;
    }

    .response-container a {
        color: var(--link-color);
        text-decoration: none;
    }

    .response-container a:hover {
        text-decoration: underline;
    }

    .response-container strong,
    .response-container b {
        font-weight: 600;
        color: var(--text-color);
    }

    .response-container::-webkit-scrollbar {
        width: 8px;
    }

    .response-container::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
        border-radius: 4px;
    }

    .response-container::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 4px;
    }

    .text-input-container {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        align-items: center;
    }

    .text-input-container input {
        flex: 1;
        background: var(--input-background);
        color: var(--text-color);
        border: 1px solid var(--button-border);
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
    }

    .text-input-container input:focus {
        outline: none;
        border-color: var(--focus-border-color);
        box-shadow: 0 0 0 3px var(--focus-box-shadow);
        background: var(--input-focus-background);
    }

    .text-input-container button {
        background: transparent;
        color: var(--start-button-background);
        border: none;
        padding: 0;
        border-radius: 100px;
    }

    .text-input-container button:hover {
        background: var(--text-input-button-hover);
        cursor: pointer;
    }

    .nav-button {
        background: transparent;
        color: white;
        border: none;
        padding: 4px;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        width: 36px;
        height: 36px;
        justify-content: center;
    }

    .nav-button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .nav-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .response-counter {
        font-size: 12px;
        color: var(--description-color);
        white-space: nowrap;
        min-width: 60px;
        text-align: center;
    }

    .save-button {
        background: transparent;
        color: var(--start-button-background);
        border: none;
        padding: 4px;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        width: 36px;
        height: 36px;
        justify-content: center;
        cursor: pointer;
    }

    .save-button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .save-button.saved {
        color: #4caf50;
    }
`;

const defaultResponseForProfile = profile => {
    const names = {
        interview: 'Job Interview',
        sales: 'Sales Call',
        meeting: 'Business Meeting',
        presentation: 'Presentation',
        negotiation: 'Negotiation',
        exam: 'Exam Assistant',
    };
    return `Hey, Im listening to your ${names[profile] || 'session'}?`;
};

const AssistantView = ({
    responses,
    currentResponseIndex,
    selectedProfile,
    onSendText,
    shouldAnimateResponse,
    onResponseIndexChanged,
    onResponseAnimationComplete,
}) => {
    const responseContainerRef = useRef(null);
    const textInputRef = useRef(null);
    const timeoutsRef = useRef([]);
    const [savedResponses, setSavedResponses] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedResponses') || '[]');
        } catch (error) {
            console.error('Failed to parse saved responses:', error);
            return [];
        }
    });

    const currentResponse = useMemo(() => {
        if (responses.length > 0 && currentResponseIndex >= 0) {
            return responses[currentResponseIndex];
        }
        return defaultResponseForProfile(selectedProfile);
    }, [responses, currentResponseIndex, selectedProfile]);

    const responseCounter = responses.length > 0 ? `${currentResponseIndex + 1}/${responses.length}` : '';

    const isResponseSaved = savedResponses.some(saved => saved.response === currentResponse);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            timeoutsRef.current = [];
        };
    }, []);

    const wrapWordsInSpans = html => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tagsToSkip = ['PRE'];

            const processNode = node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode?.tagName)) {
                    const words = node.textContent.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();
                    words.forEach(word => {
                        if (word.trim()) {
                            const span = document.createElement('span');
                            span.setAttribute('data-word', '');
                            span.textContent = word;
                            fragment.appendChild(span);
                        } else {
                            fragment.appendChild(document.createTextNode(word));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
                    Array.from(node.childNodes).forEach(processNode);
                }
            };

            Array.from(doc.body.childNodes).forEach(processNode);
            return doc.body.innerHTML;
        } catch (error) {
            console.error('Failed to wrap words:', error);
            return html;
        }
    };

    useEffect(() => {
        const container = responseContainerRef.current;
        if (!container) {
            return;
        }
        if (!currentResponse) {
            container.innerHTML = '';
            return;
        }

        const getRendered = () => {
            if (typeof window === 'undefined' || !window.marked) {
                return currentResponse;
            }
            try {
                window.marked.setOptions({ breaks: true, gfm: true, sanitize: false });
                const rendered = window.marked.parse(currentResponse);
                return wrapWordsInSpans(rendered);
            } catch (error) {
                console.error('Failed to render markdown:', error);
                return currentResponse;
            }
        };

        container.innerHTML = getRendered();
        const words = container.querySelectorAll('[data-word]');
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current = [];

        if (shouldAnimateResponse) {
            words.forEach(word => word.classList.remove('visible'));
            words.forEach((word, index) => {
                const timeout = setTimeout(() => {
                    word.classList.add('visible');
                    if (index === words.length - 1) {
                        onResponseAnimationComplete?.();
                    }
                }, index * 100);
                timeoutsRef.current.push(timeout);
            });
        } else {
            words.forEach(word => word.classList.add('visible'));
        }
    }, [currentResponse, shouldAnimateResponse, onResponseAnimationComplete]);

    useEffect(() => {
        if (!window.require) {
            return undefined;
        }
        const { ipcRenderer } = window.require('electron');

        const handlePrevious = () => {
            if (currentResponseIndex > 0) {
                onResponseIndexChanged(currentResponseIndex - 1);
            }
        };

        const handleNext = () => {
            if (currentResponseIndex < responses.length - 1) {
                onResponseIndexChanged(currentResponseIndex + 1);
            }
        };

        const handleScrollUp = () => {
            const container = responseContainerRef.current;
            if (!container) {
                return;
            }
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        };

        const handleScrollDown = () => {
            const container = responseContainerRef.current;
            if (!container) {
                return;
            }
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        };

        ipcRenderer.on('navigate-previous-response', handlePrevious);
        ipcRenderer.on('navigate-next-response', handleNext);
        ipcRenderer.on('scroll-response-up', handleScrollUp);
        ipcRenderer.on('scroll-response-down', handleScrollDown);

        return () => {
            ipcRenderer.removeListener('navigate-previous-response', handlePrevious);
            ipcRenderer.removeListener('navigate-next-response', handleNext);
            ipcRenderer.removeListener('scroll-response-up', handleScrollUp);
            ipcRenderer.removeListener('scroll-response-down', handleScrollDown);
        };
    }, [currentResponseIndex, responses.length, onResponseIndexChanged]);

    const handleSendText = async () => {
        const value = textInputRef.current?.value?.trim();
        if (!value) {
            return;
        }
        await onSendText?.(value);
        if (textInputRef.current) {
            textInputRef.current.value = '';
        }
    };

    const handleTextKeydown = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendText();
        }
    };

    const navigatePrevious = () => {
        if (currentResponseIndex > 0) {
            onResponseIndexChanged(currentResponseIndex - 1);
        }
    };

    const navigateNext = () => {
        if (currentResponseIndex < responses.length - 1) {
            onResponseIndexChanged(currentResponseIndex + 1);
        }
    };

    const saveCurrentResponse = () => {
        if (!currentResponse || isResponseSaved) {
            return;
        }
        setSavedResponses(prev => {
            const updated = [
                ...prev,
                {
                    response: currentResponse,
                    timestamp: Date.now(),
                    profile: selectedProfile,
                },
            ];
            localStorage.setItem('savedResponses', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AssistantShell>
            <div className="response-container" ref={responseContainerRef}></div>
            <div className="text-input-container">
                <button className="nav-button" onClick={navigatePrevious} disabled={currentResponseIndex <= 0} aria-label="Previous response" type="button">
                    <svg width="24px" height="24px" strokeWidth="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                {responses.length > 0 && <span className="response-counter">{responseCounter}</span>}
                <button
                    className={`save-button${isResponseSaved ? ' saved' : ''}`}
                    onClick={saveCurrentResponse}
                    title={isResponseSaved ? 'Response saved' : 'Save this response'}
                    type="button"
                >
                    <svg width="24px" height="24px" strokeWidth="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5 20V5C5 3.89543 5.89543 3 7 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L19.4142 5.41421C19.7893 5.78929 20 6.29799 20 6.82843V20C20 21.1046 19.1046 22 18 22H7C5.89543 22 5 21 5 20Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M15 22V13H9V22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 3V8H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <input ref={textInputRef} type="text" placeholder="Type a message to the AI..." onKeyDown={handleTextKeydown} />
                <button className="nav-button" onClick={navigateNext} disabled={currentResponseIndex >= responses.length - 1} aria-label="Next response" type="button">
                    <svg width="24px" height="24px" strokeWidth="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </AssistantShell>
    );
};

export default AssistantView;
