import { useState } from 'react';
import devfestLogo from '../../../assets/images/home/devfestlogo.png';
import blueBackground from '../../../assets/images/background/blue.png';
import orangeBackground from '../../../assets/images/background/orange.png';
import purpleBackground from '../../../assets/images/background/purple.png';
import yellowBackground from '../../../assets/images/background/yellow.png';
import {Top, Twitter, LinkedIn, FaceBook} from '../../../assets/svg/svg-export';
import './results.css';

interface ResultsProps {
  userName: string;
  finalImage: string;
  onCreateAnother: () => void;
}

export const Results = ({ userName, finalImage}: ResultsProps) => {
  const [selectedBackground, setSelectedBackground] = useState(blueBackground);

  const backgroundOptions = [
    { name: 'Blue', image: blueBackground },
    { name: 'Orange', image: orangeBackground },
    { name: 'Purple', image: purpleBackground },
    { name: 'Yellow', image: yellowBackground }
  ];

  const handleDownload = async () => {
    const previewElement = document.querySelector('.dp-preview') as HTMLElement;
    if (!previewElement) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewElement, {
        width: 400,
        height: 400,
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = `${userName}-DevFestLagos-DP.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Please right-click on the preview image and select "Save image as..."');
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const message = encodeURIComponent(`I'll be at #DevFestLagos2025!`);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="results-container">

      <div className="results-content">
        <div className="preview-section">
          <div 
            className="dp-preview" 
            style={{ 
              backgroundImage: `url(${selectedBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <img src={finalImage} alt="Your DP" className="user-image" />
            
            <div className="frame-overlay">
              <div className="frame-message">
                <span>I can't wait to be at</span>
                <span>DevFest Lagos 2025!</span>
                <div className="quote-mark"><Top/></div>

              </div>
              
              <div className="devfest-logo">
                <img src={devfestLogo} alt="DevFest Lagos" />
              </div>
              
              <div className="user-name-overlay">
                <h2 className="user-name">{userName}</h2>
              </div>
            </div>
          </div>

          <div className="background-selector">
            <div className="background-options">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.name}
                  className={`background-option ${selectedBackground === bg.image ? 'selected' : ''}`}
                  style={{ 
                    backgroundImage: `url(${bg.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => setSelectedBackground(bg.image)}
                  title={bg.name}
                />
              ))}
            </div>
          </div>

        </div>

        <div className="customization-section">
          <h3>Share the word that you'll be at #DevFestLagos2025!</h3>
          
          <button className="download-btn" onClick={handleDownload}>
            DOWNLOAD DP
          </button>

          <div className="share-section">
            <div className="share-buttons">
              <div 
              title='Share on Twitter'
                className="share-btn twitter"
                onClick={() => handleShare('twitter')}
              >
                <Twitter />
              </div>
              <div 
              title='Share on LinkedIn'
                className="share-btn linkedin"
                onClick={() => handleShare('linkedin')}
              >
                <LinkedIn />
              </div>
              <div 
              title='Share on Facebook'
                className="share-btn facebook"
                onClick={() => handleShare('facebook')}
              >
                <FaceBook />
              </div>
            </div>
            <p>Share on Social Media!</p>
          </div>

        </div>
      </div>
    </div>
  );
};
