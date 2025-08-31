import { useState, useCallback } from 'react';
import { Upload as UploadIcon } from '../../../assets/svg/svg-export';

interface UploadProps {
  onImageUpload: (image: string) => void;
}

export const Upload = ({ onImageUpload }: UploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
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
        accept="image/png,image/jpeg"
        onChange={handleFileSelect}
        className="file-input"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="upload-label">
        <h1 className='upload-title'>Upload your Photo</h1>
        <div className='upload-box'>
          <div className="upload-icon"><UploadIcon /></div>
          <div className="upload-text">
            <span className="click-text">Click to upload</span> or drag and drop
            <br />
            PNG or JPG (max. 800×400px)
          </div>
        </div>
      </label>
    </div>
  );
};
