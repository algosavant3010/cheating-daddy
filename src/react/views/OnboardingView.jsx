import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const OnboardingShell = styled.div`
    * {
        font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
        cursor: default;
        user-select: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    & {
        display: block;
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
    }

    .onboarding-container {
        position: relative;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        overflow: hidden;
    }

    .gradient-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .content-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 32px 48px;
        max-width: 500px;
        color: #e5e5e5;
        overflow: hidden;
    }

    .slide-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.9;
        display: block;
    }

    .slide-title {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #ffffff;
        line-height: 1.3;
    }

    .slide-content {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 24px;
        color: #b8b8b8;
        font-weight: 400;
    }

    .context-textarea {
        width: 100%;
        height: 100px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: #e5e5e5;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        transition: all 0.2s ease;
        margin-bottom: 24px;
    }

    .context-textarea::placeholder {
        color: rgba(255, 255, 255, 0.4);
        font-size: 14px;
    }

    .context-textarea:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.08);
    }

    .feature-list {
        max-width: 100%;
    }

    .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 15px;
        color: #b8b8b8;
    }

    .feature-icon {
        font-size: 16px;
        margin-right: 12px;
        opacity: 0.8;
    }

    .navigation {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        height: 60px;
        box-sizing: border-box;
    }

    .nav-button {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #e5e5e5;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        min-height: 36px;
    }

    .nav-button:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .nav-button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .progress-dots {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .dot.active {
        background: rgba(255, 255, 255, 0.8);
        transform: scale(1.2);
    }
`;

const slides = [
    {
        icon: 'assets/onboarding/welcome.svg',
        title: 'Welcome to Cheating Daddy',
        content: 'Your AI assistant that listens and watches, then provides intelligent suggestions automatically during interviews and meetings.',
    },
    {
        icon: 'assets/onboarding/security.svg',
        title: 'Completely Private',
        content: 'Invisible to screen sharing apps and recording software. Your secret advantage stays completely hidden from others.',
    },
    {
        icon: 'assets/onboarding/context.svg',
        title: 'Add Your Context',
        content: 'Share relevant information to help the AI provide better, more personalized assistance.',
        showTextarea: true,
    },
    {
        icon: 'assets/onboarding/customize.svg',
        title: 'Additional Features',
        content: '',
        showFeatures: true,
    },
    {
        icon: 'assets/onboarding/ready.svg',
        title: 'Ready to Go',
        content: 'Add your Gemini API key in settings and start getting AI-powered assistance in real-time.',
    },
];

const colorSchemes = [
    [
        [25, 25, 35],
        [20, 20, 30],
        [30, 25, 40],
        [15, 15, 25],
        [35, 30, 45],
        [10, 10, 20],
    ],
    [
        [20, 25, 35],
        [15, 20, 30],
        [25, 30, 40],
        [10, 15, 25],
        [30, 35, 45],
        [5, 10, 20],
    ],
    [
        [25, 25, 25],
        [20, 20, 20],
        [30, 30, 30],
        [15, 15, 15],
        [35, 35, 35],
        [10, 10, 10],
    ],
    [
        [20, 30, 25],
        [15, 25, 20],
        [25, 35, 30],
        [10, 20, 15],
        [30, 40, 35],
        [5, 15, 10],
    ],
    [
        [30, 25, 20],
        [25, 20, 15],
        [35, 30, 25],
        [20, 15, 10],
        [40, 35, 30],
        [15, 10, 5],
    ],
];

const OnboardingView = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [contextText, setContextText] = useState('');
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const isTransitioningRef = useRef(false);
    const previousSchemeRef = useRef(null);
    const transitionStartRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const drawGradient = timestamp => {
            const { width, height } = canvas;
            let scheme = colorSchemes[currentSlide];

            if (isTransitioningRef.current && previousSchemeRef.current) {
                const elapsed = timestamp - (transitionStartRef.current || 0);
                const progress = Math.min(elapsed / 800, 1);
                const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                scheme = previousSchemeRef.current.map((color, index) => {
                    const target = colorSchemes[currentSlide][index];
                    return [
                        color[0] + (target[0] - color[0]) * eased,
                        color[1] + (target[1] - color[1]) * eased,
                        color[2] + (target[2] - color[2]) * eased,
                    ];
                });
                if (progress >= 1) {
                    isTransitioningRef.current = false;
                    previousSchemeRef.current = null;
                }
            }

            const time = timestamp * 0.0005;
            const flowX = Math.sin(time * 0.7) * width * 0.3;
            const flowY = Math.cos(time * 0.5) * height * 0.2;
            const gradient = ctx.createLinearGradient(flowX, flowY, width + flowX * 0.5, height + flowY * 0.5);

            scheme.forEach((color, index) => {
                const offset = index / (scheme.length - 1);
                const wave = Math.sin(time + index * 0.3) * 0.05;
                const r = Math.max(0, Math.min(255, color[0] + wave * 5));
                const g = Math.max(0, Math.min(255, color[1] + wave * 5));
                const b = Math.max(0, Math.min(255, color[2] + wave * 5));
                gradient.addColorStop(offset, `rgb(${r}, ${g}, ${b})`);
            });

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const centerX = width * 0.5 + Math.sin(time * 0.3) * width * 0.15;
            const centerY = height * 0.5 + Math.cos(time * 0.4) * height * 0.1;
            const radius = Math.max(width, height) * 0.8;
            const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            radialGradient.addColorStop(0, `rgba(${scheme[0][0] + 10}, ${scheme[0][1] + 10}, ${scheme[0][2] + 10}, 0.1)`);
            radialGradient.addColorStop(0.5, `rgba(${scheme[2][0]}, ${scheme[2][1]}, ${scheme[2][2]}, 0.05)`);
            radialGradient.addColorStop(1, `rgba(${scheme[5][0]}, ${scheme[5][1]}, ${scheme[5][2]}, 0.03)`);
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillStyle = radialGradient;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';

            animationRef.current = requestAnimationFrame(drawGradient);
        };

        animationRef.current = requestAnimationFrame(drawGradient);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [currentSlide]);

    const goToSlide = slide => {
        if (slide === currentSlide) {
            return;
        }
        previousSchemeRef.current = colorSchemes[currentSlide].map(color => [...color]);
        isTransitioningRef.current = true;
        transitionStartRef.current = performance.now();
        setCurrentSlide(slide);
    };

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        } else {
            completeOnboarding();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    };

    const handleDotClick = index => {
        goToSlide(index);
    };

    const handleContextChange = event => {
        setContextText(event.target.value);
    };

    const completeOnboarding = () => {
        if (contextText.trim()) {
            localStorage.setItem('customPrompt', contextText.trim());
        }
        localStorage.setItem('onboardingCompleted', 'true');
        onComplete?.();
    };

    const slide = slides[currentSlide];

    return (
        <OnboardingShell>
            <div className="onboarding-container">
                <canvas ref={canvasRef} className="gradient-canvas"></canvas>
                <div className="content-wrapper">
                    <img className="slide-icon" src={slide.icon} alt={`${slide.title} icon`} />
                    <div className="slide-title">{slide.title}</div>
                    <div className="slide-content">{slide.content}</div>
                    {slide.showTextarea && (
                        <textarea
                            className="context-textarea"
                            placeholder="Paste your resume, job description, or any relevant context here..."
                            value={contextText}
                            onChange={handleContextChange}
                        ></textarea>
                    )}
                    {slide.showFeatures && (
                        <div className="feature-list">
                            <div className="feature-item">
                                <span className="feature-icon">🎨</span>
                                Customize AI behavior and responses
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📚</span>
                                Review conversation history
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔧</span>
                                Adjust capture settings and intervals
                            </div>
                        </div>
                    )}
                </div>
                <div className="navigation">
                    <button className="nav-button" onClick={handlePrev} disabled={currentSlide === 0}>
                        <svg width="16px" height="16px" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                    <div className="progress-dots">
                        {[0, 1, 2, 3, 4].map(index => (
                            <div key={index} className={`dot${index === currentSlide ? ' active' : ''}`} onClick={() => handleDotClick(index)}></div>
                        ))}
                    </div>
                    <button className="nav-button" onClick={handleNext}>
                        {currentSlide === slides.length - 1 ? (
                            'Get Started'
                        ) : (
                            <svg width="16px" height="16px" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </OnboardingShell>
    );
};

export default OnboardingView;
