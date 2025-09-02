import { useState} from 'react';
import { Gemini, Prompt } from '../../../assets/svg/svg-export';

interface Part {
    inlineData?: {
        mime_type: string;
        data: string;
    };
    text?: string;
}

interface AICustomizeProps {
    image: string;
    originalCroppedImage: string;
    userName: string;
    onUserNameChange: (name: string) => void;
    onGenerateDP: () => void;
    onImageUpdate?: (newImage: string) => void;
}

interface ChatMessage {
    type: 'user' | 'ai';
    content: string;
}

interface AICustomizeProps {
    image: string;
    originalCroppedImage: string;
    userName: string;
    onUserNameChange: (name: string) => void;
    onGenerateDP: () => void;
    onImageUpdate?: (newImage: string) => void;
}

export const AICustomize = ({ image, originalCroppedImage, userName, onUserNameChange, onGenerateDP, onImageUpdate }: AICustomizeProps) => {
    const [useGemini, setUseGemini] = useState(false);
    const [geminiPrompt, setGeminiPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [showChat, setShowChat] = useState(false);

    const handleApply = async () => {
        if (!geminiPrompt.trim()) {
            return;
        }

        setIsLoading(true);
        setShowChat(true);

        const userMessage: ChatMessage = {
            type: 'user',
            content: geminiPrompt,
        };
        setChatMessages(prev => [...prev, userMessage]);
        
        setGeminiPrompt('');

        try {
            let base64Image = '';
            let mimeType = 'image/jpeg';

            if (image.startsWith('data:image/')) {
                const parts = image.split(',');
                mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
                base64Image = parts[1];
            } else {
                const response = await fetch(image);
                const blob = await response.blob();
                mimeType = blob.type;
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            const apiKey = "AIzaSyBrabFrEopQokcbg-962BQFLMz7Me74CyQ";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Image
                            }
                        },
                        {
                            text: geminiPrompt
                        }
                    ]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                }
            };

            const imageGenResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!imageGenResponse.ok) {
                const errorText = await imageGenResponse.text();
                console.error('API Error:', imageGenResponse.status, imageGenResponse.statusText, errorText);
                setIsLoading(false);
                return;
            }

            const data = await imageGenResponse.json();

            const candidate = data.candidates?.[0];
            
            if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                console.error('Unexpected API response format:', data);
                return;
            }

            const imagePart = candidate.content.parts.find((p: Part) => p.inlineData);
            const textPart = candidate.content.parts.find((p: Part) => p.text);

            if (imagePart) {
                const newImageData = imagePart.inlineData?.data;
                if (newImageData) {
                    const newImageSrc = `data:${mimeType};base64,${newImageData}`;
                    setProcessedImage(newImageSrc);
                    onImageUpdate?.(newImageSrc);
                    
                    const aiMessage: ChatMessage = {
                        type: 'ai',
                        content: "Done.",
                    };
                    setChatMessages(prev => [...prev, aiMessage]);
                } else {
                    const errorMsg = 'No image data.';
                    const aiMessage: ChatMessage = {
                        type: 'ai',
                        content: errorMsg,
                    };
                    setChatMessages(prev => [...prev, aiMessage]);
                }
            } else if (textPart) {
                const aiMessage: ChatMessage = {
                    type: 'ai',
                    content: textPart.text || 'I  couldn\'t process the image.',
                };
                setChatMessages(prev => [...prev, aiMessage]);
            } else {
                const errorMsg = 'This is not a valid response. Please try again.';
                const aiMessage: ChatMessage = {
                    type: 'ai',
                    content: errorMsg,
                };
                setChatMessages(prev => [...prev, aiMessage]);
            }

        } catch (err) {
            console.error('Image generation error:', err);
            const errorMsg = 'Failed to apply styling. Please try again.';
            const aiMessage: ChatMessage = {
                type: 'ai',
                content: errorMsg,
            };
            setChatMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setProcessedImage(null);
        setGeminiPrompt('');
        setShowChat(false);
        setChatMessages([]);
        onImageUpdate?.(originalCroppedImage);
    };

    return (
        <>
            <div className="customize-container">
                <div className="image-display" style={{ position: 'relative' }}>
                    <img src={processedImage || image} alt="Final preview" className="final-image" />
                    <button
                        type='button'
                        title='generate'
                        className="generate-dp-btn"
                        onClick={onGenerateDP}
                    >
                        GENERATE DP!
                    </button>
                </div>

                <div className="form-container">
                    <div className="form-field">
                        <label className="form-label">
                            Your Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => onUserNameChange(e.target.value)}
                            className="name-input"
                        />
                    </div>

                    <div className="form-field">
                        <label className="gemini-option">
                            <input
                                type="checkbox"
                                checked={useGemini}
                                onChange={(e) => setUseGemini(e.target.checked)}
                                className="gemini-checkbox"
                            />
                            <span className="checkbox-text">
                                Style your Picture with Gemini <Gemini/>
                            </span>
                        </label>

                        {useGemini && (
                            <div className="gemini-prompt-container">
                                <div className="gemini-header">
                                    <Gemini/>
                                </div>

                                {showChat && (
                                    <div className="chat-container">
                                        <div className="chat-messages">
                                            {chatMessages.map((message, index) => (
                                                <div key={index} className={`chat-message ${message.type}`}>
                                                    <div className="message-content">
                                                        {message.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div className="chat-message ai">
                                                    <div className="message-content">
                                                        <div className="typing-indicator">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="gemini-input-row">
                                    <input
                                        type="text"
                                        placeholder="eg: Make me wear glasses and a turtleneck"
                                        value={geminiPrompt}
                                        onChange={(e) => setGeminiPrompt(e.target.value)}
                                        className="gemini-input"
                                        disabled={isLoading}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !isLoading && geminiPrompt.trim()) {
                                                handleApply();
                                            }
                                        }}
                                    />
                                    <div style={{ marginBottom: '8px' }}>
                                    </div>
                                    <button
                                        className="apply-btn"
                                        onClick={handleApply}
                                        disabled={isLoading || !geminiPrompt.trim()}
                                        style={{
                                            opacity: isLoading || !geminiPrompt.trim() ? 0.6 : 1,
                                            cursor: isLoading || !geminiPrompt.trim() ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isLoading ? 'APPLYING' : 'APPLY'}
                                    </button>
                                    <button
                                            onClick={handleReset}
                                            className="undo-btn"
                                        >
                                            UNDO
                                        </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="prompt-helper">
                <div className="helper-bubble">
                    <Prompt/>
                </div>
            </div>
        </>
    );
};
