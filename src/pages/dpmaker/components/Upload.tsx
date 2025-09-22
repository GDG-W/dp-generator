import { useState, useCallback } from 'react';
import { Upload as UploadIcon } from '../../../assets/svg/svg-export';
import heic2any from 'heic2any';

interface UploadProps {
  onImageUpload: (image: string) => void;
}

export const Upload = ({ onImageUpload }: UploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const convertHeicToJpeg = async (file: File): Promise<Blob> => {
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 1
    });
    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    return resultBlob as Blob;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    try {
      let processedFile = file;
      
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        setIsConverting(true);
        const heicBlob = await convertHeicToJpeg(file);
        processedFile = new File(
          [heicBlob],
          file.name.replace(/\.heic$/i, '.jpg'),
          { type: 'image/jpeg', lastModified: file.lastModified }
        );
      } else if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        alert('Please upload a PNG, JPEG, or HEIC file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
        setIsConverting(false);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      setIsConverting(false);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/heic,.heic"
        onChange={handleFileSelect}
        className="file-input"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="upload-label">
        <h1 className='upload-title'>Upload your Photo</h1>
        <div className='upload-box'>
          <div className="upload-icon"><UploadIcon /></div>
          {isConverting ? (
            <div className="upload-text">Converting HEIC image...</div>
          ) : (
            <div className="upload-text">
              <span className="click-text">Click to upload</span> or drag and drop
              <br />
              PNG or JPG(max. 800×400px)
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
