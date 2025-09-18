import { useState, useRef } from "react";
import ReactCrop, { type Crop as ReactCropType, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../dpcrop.css";

interface CropProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onReplacePhoto: () => void;
}

export const Crop = ({ image, onCrop, onReplacePhoto }: CropProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<ReactCropType>({
    unit: "%",
    x: 20,
    y: 20,
    width: 60,
    height: 60,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const size = Math.min(width, height) * 0.6;
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    const newCrop: ReactCropType = {
      unit: "px",
      x,
      y,
      width: size,
      height: size,
    };

    setCrop(newCrop);
    setCompletedCrop({
      unit: "px",
      x,
      y,
      width: size,
      height: size,
    });
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop,
    _fileName: string = "cropped_image.jpg"
  ): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth * pixelRatio;
    canvas.height = cropHeight * pixelRatio;

    canvas.style.width = `${cropWidth}px`;
    canvas.style.height = `${cropHeight}px`;

    ctx.scale(pixelRatio, pixelRatio);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageUrl = await getCroppedImg(
          imgRef.current,
          completedCrop,
          "cropped_profile_image.jpg"
        );
        onCrop(croppedImageUrl);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  return (
    <div className="image-edit-container">
      <div className="image-preview-area">
        <div className="react-crop-wrapper">
          <ReactCrop
            crop={crop}
            onChange={setCrop}
            onComplete={setCompletedCrop}
            aspect={1}
            minWidth={50}
            minHeight={50}
            keepSelection
            className="custom-react-crop"
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="uploaded-image"
            />
          </ReactCrop>
        </div>
      </div>

      <div className="action-buttons">
        <button className="replace-photo-btn" onClick={onReplacePhoto}>
          REPLACE PHOTO
        </button>
        <button className="next-btn" onClick={handleCropComplete}>
          NEXT
        </button>
      </div>
    </div>
  );
};
