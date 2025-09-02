import { useState, useCallback } from 'react';
import '../dpcrop.css';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onReplacePhoto: () => void;
}

export const Crop = ({ image, onCrop, onReplacePhoto }: CropProps) => {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 20,
    y: 20,
    width: 100,
    height: 75
  });

  const cropImage = useCallback(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const cropX = (img.width * cropArea.x) / 100;
      const cropY = (img.height * cropArea.y) / 100;
      const cropWidth = (img.width * cropArea.width) / 100;
      const cropHeight = (img.height * cropArea.height) / 100;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx?.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, 
        0, 0, cropWidth, cropHeight 
      );

      const croppedDataUrl = canvas.toDataURL('image/png');
      onCrop(croppedDataUrl);
    };

    img.src = image;
  }, [image, cropArea, onCrop]);

  const handleCropMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCropX = cropArea.x;
    const startCropY = cropArea.y;
    
    const overlay = e.currentTarget.parentElement;
    if (!overlay) return;
    
    const rect = overlay.getBoundingClientRect();
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = ((e.clientX - startX) / rect.width) * 100;
      const deltaY = ((e.clientY - startY) / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(startCropX + deltaX, 100 - cropArea.width));
      const newY = Math.max(0, Math.min(startCropY + deltaY, 100 - cropArea.height));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [cropArea.x, cropArea.y, cropArea.width, cropArea.height]);

  const handleCropTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startCropX = cropArea.x;
    const startCropY = cropArea.y;
    
    const overlay = e.currentTarget.parentElement;
    if (!overlay) return;
    
    const rect = overlay.getBoundingClientRect();
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = ((touch.clientX - startX) / rect.width) * 100;
      const deltaY = ((touch.clientY - startY) / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(startCropX + deltaX, 100 - cropArea.width));
      const newY = Math.max(0, Math.min(startCropY + deltaY, 100 - cropArea.height));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [cropArea.x, cropArea.y, cropArea.width, cropArea.height]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...cropArea };
    
    const overlay = e.currentTarget.parentElement?.parentElement;
    if (!overlay) return;
    
    const rect = overlay.getBoundingClientRect();
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = ((e.clientX - startX) / rect.width) * 100;
      const deltaY = ((e.clientY - startY) / rect.height) * 100;
      
      let newCrop = { ...startCrop };
      
      if (corner.includes('right')) {
        newCrop.width = Math.max(20, Math.min(startCrop.width + deltaX, 100 - startCrop.x));
      }
      if (corner.includes('left')) {
        const newWidth = Math.max(20, startCrop.width - deltaX);
        const newX = Math.max(0, startCrop.x + (startCrop.width - newWidth));
        newCrop.x = newX;
        newCrop.width = newWidth;
      }
      if (corner.includes('bottom')) {
        newCrop.height = Math.max(20, Math.min(startCrop.height + deltaY, 100 - startCrop.y));
      }
      if (corner.includes('top')) {
        const newHeight = Math.max(20, startCrop.height - deltaY);
        const newY = Math.max(0, startCrop.y + (startCrop.height - newHeight));
        newCrop.y = newY;
        newCrop.height = newHeight;
      }
      
      setCropArea(newCrop);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [cropArea]);

  const handleResizeTouchStart = useCallback((e: React.TouchEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startCrop = { ...cropArea };
    
    const overlay = e.currentTarget.parentElement?.parentElement;
    if (!overlay) return;
    
    const rect = overlay.getBoundingClientRect();
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = ((touch.clientX - startX) / rect.width) * 100;
      const deltaY = ((touch.clientY - startY) / rect.height) * 100;
      
      let newCrop = { ...startCrop };
      
      if (corner.includes('right')) {
        newCrop.width = Math.max(20, Math.min(startCrop.width + deltaX, 100 - startCrop.x));
      }
      if (corner.includes('left')) {
        const newWidth = Math.max(20, startCrop.width - deltaX);
        const newX = Math.max(0, startCrop.x + (startCrop.width - newWidth));
        newCrop.x = newX;
        newCrop.width = newWidth;
      }
      if (corner.includes('bottom')) {
        newCrop.height = Math.max(20, Math.min(startCrop.height + deltaY, 100 - startCrop.y));
      }
      if (corner.includes('top')) {
        const newHeight = Math.max(20, startCrop.height - deltaY);
        const newY = Math.max(0, startCrop.y + (startCrop.height - newHeight));
        newCrop.y = newY;
        newCrop.height = newHeight;
      }
      
      setCropArea(newCrop);
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [cropArea]);

  const handleNext = () => {
    cropImage();
  };

  return (
    <div className="image-edit-container">
      <div className="image-preview-area">
        <img src={image} alt="Uploaded preview" className="uploaded-image" />
        <div className="crop-overlay">
          <div 
            className="crop-selection"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`,
            }}
            onMouseDown={handleCropMouseDown}
            onTouchStart={handleCropTouchStart}
          >
            <div 
              className="resize-handle resize-handle-tl"
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'top-left')}
            />
            <div 
              className="resize-handle resize-handle-tr"
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'top-right')}
            />
            <div 
              className="resize-handle resize-handle-bl"
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom-left')}
            />
            <div 
              className="resize-handle resize-handle-br"
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom-right')}
            />
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="replace-photo-btn"
          onClick={onReplacePhoto}
        >
          REPLACE PHOTO
        </button>
        <button 
          className="next-btn"
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};
