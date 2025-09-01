import './dpmaker.css'
import './dpai.css'
import './dpcrop.css'
import devfestLogo from '../../assets/images/home/devfestlogo.png'
import image1 from '../../assets/images/home/joint.png'
import productdesign from '../../assets/images/vector/productdesign.png'
import { Invert, Vector } from '../../assets/svg/svg-export'
import { useState } from 'react'
import { Upload, Crop, AICustomize, Results } from './components'

export const DPMaker = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'customize' | 'results'>('upload');
  const [userName, setUserName] = useState('');

  const handleImageUpload = (image: string) => {
    setUploadedImage(image);
    setCurrentStep('edit');
  };

  const handleImageCrop = (croppedImg: string) => {
    setCroppedImage(croppedImg);
    setFinalImage(croppedImg); // Set as initial final image
    setCurrentStep('customize');
  };

  const handleImageUpdate = (newImage: string) => {
    setFinalImage(newImage);
  };

  const handleReplacePhoto = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setFinalImage(null);
    setCurrentStep('upload');
  };

  const handleGenerateDP = () => {
    if (!userName.trim()) {
      alert('Please enter your name before generating your DP');
      return;
    }
    
    if (!finalImage && !croppedImage) {
      alert('Please upload and crop an image first');
      return;
    }

    // Move to results step
    setCurrentStep('results');
  };

  const handleCreateAnother = () => {
    // Reset all state and go back to upload
    setUploadedImage(null);
    setCroppedImage(null);
    setFinalImage(null);
    setUserName('');
    setCurrentStep('upload');
  };

  return (
    <div className="dpmaker-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-shapes">
            <div className="shape shape-pink">
              <Invert />
            </div>
            <div className="shape shape-green">
              <Vector />
            </div>
          </div>
          <div className="logo-content">
            <img src={devfestLogo} alt="DevFest Lagos" className="logo" />
            <h1 className="title">DEVFEST LAGOS DP MAKER</h1>
            <p className="subtitle">Create a DevFest branded image to announce your attendance with your network! 📸</p>
          </div>
        </div>
      </header>

      <section className="upload-section">
        <div className="upload-container">
          {currentStep === 'upload' ? (
            <Upload onImageUpload={handleImageUpload} />
          ) : currentStep === 'edit' ? (
            <Crop 
              image={uploadedImage || ''} 
              onCrop={handleImageCrop}
              onReplacePhoto={handleReplacePhoto}
            />
          ) : currentStep === 'customize' ? (
            <AICustomize
              image={finalImage || croppedImage || uploadedImage || ''}
              originalCroppedImage={croppedImage || uploadedImage || ''}
              userName={userName}
              onUserNameChange={setUserName}
              onGenerateDP={handleGenerateDP}
              onImageUpdate={handleImageUpdate}
            />
          ) : (
            <Results
              userName={userName}
              finalImage={finalImage || croppedImage || uploadedImage || ''}
              onCreateAnother={handleCreateAnother}
            />
          )}
        </div>
      </section>

      {currentStep !== 'results' && (
        <>
          <section className="samples-section">
            <div className="samples-grid">
              <div className="sample-image">
                <img className='image' src={image1} alt="Sample DP 1" />
              </div>
            </div>
          </section>

          <div className="designer-tag">
            <div className="tag-content">
              <img src={productdesign} alt="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
