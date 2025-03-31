import { useState } from "react";
import Cropper from "react-easy-crop";
import ModalContainer from "../Modal/ModalContainer";

const ModalCrop = ({ image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedArea);
    onCropDone(croppedImage);
    onClose();
  };

  return (
    <ModalContainer onClose={onClose}>
      <div className="relative w-full h-[400px]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Hủy
        </button>
        <button
          onClick={handleCropDone}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Cắt ảnh
        </button>
      </div>
    </ModalContainer>
  );
};

export default ModalCrop;

const getCroppedImg = async (imageSrc, cropArea) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)), "image/jpeg");
  });
};

const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
