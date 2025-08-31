import { useState } from 'react';
import { Gemini, Prompt } from '../../../assets/svg/svg-export';

interface Part {
    inline_data?: {
        mime_type: string;
        data: string;
    };
    text?: string;
}

interface AICustomizeProps {
    image: string;
    userName: string;
    onUserNameChange: (name: string) => void;
    onGenerateDP: () => void;
    onImageUpdate?: (newImage: string) => void;
}

export const AICustomize = ({ image, userName, onUserNameChange, onGenerateDP, onImageUpdate }: AICustomizeProps) => {
    const [useGemini, setUseGemini] = useState(false);
    const [geminiPrompt, setGeminiPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);

    const handleApply = async () => {
        if (!geminiPrompt.trim()) {
            setError('Please enter a prompt for styling');
            return;
        }

        setIsLoading(true);
        setError(null);

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

            console.log('Attempting API call to:', apiUrl);
            console.log('Image data length:', base64Image.length);
            console.log('Payload:', JSON.stringify(payload, null, 2));

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
                setError(`API request failed with status code: ${imageGenResponse.status}.`);
                setIsLoading(false);
                return;
            }

            const data = await imageGenResponse.json();

            const candidate = data.candidates?.[0];
            
            if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                console.error('Unexpected API response format:', data);
                setError('The API response was successful, but the content part was empty. Please try a different prompt.');
                return;
            }

            const imagePart = candidate.content.parts.find((p: Part) => p.inline_data);
            const textPart = candidate.content.parts.find((p: Part) => p.text);

            if (imagePart) {
                const newImageData = imagePart.inline_data?.data;
                if (newImageData) {
                    const newImageSrc = `data:${mimeType};base64,${newImageData}`;
                    setProcessedImage(newImageSrc);
                    onImageUpdate?.(newImageSrc);
                } else {
                    setError('The API returned an image object, but no image data.');
                }
            } else if (textPart) {
                setError(`API message: ${textPart.text}`);
            } else {
                console.error('Unexpected API response format:', data);
                setError('The API did not return a valid image or a clear error message. Check the console for full response data.');
            }

        } catch (err) {
            console.error('Image generation error:', err);
            setError('Failed to apply styling. Check the console for more details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setProcessedImage(null);
        onImageUpdate?.(image);
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
                                {error && (
                                    <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
                                        {error}
                                    </div>
                                )}
                                {processedImage && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <button
                                            onClick={handleReset}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #ccc',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            Reset to Original
                                        </button>
                                    </div>
                                )}

                                <div className="gemini-input-row">
                                    <input
                                        type="text"
                                        placeholder="Make me wear glasses and a turtleneck"
                                        value={geminiPrompt}
                                        onChange={(e) => setGeminiPrompt(e.target.value)}
                                        className="gemini-input"
                                        disabled={isLoading}
                                    />
                                    <button
                                        className="apply-btn"
                                        onClick={handleApply}
                                        disabled={isLoading || !geminiPrompt.trim()}
                                        style={{
                                            opacity: isLoading || !geminiPrompt.trim() ? 0.6 : 1,
                                            cursor: isLoading || !geminiPrompt.trim() ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isLoading ? 'APPLYING...' : 'APPLY'}
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
