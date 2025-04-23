// hooks/useProductImages.js
import { useState } from "react";

const useProductImages = () => {
  const [ratio, setRatio] = useState("1x1");
  const [imageThumbnailPreview, setImageThumbnailPreview] = useState(null);
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [imagesProductPreview, setImagesProductPreview] = useState([]);
  const [imagesProduct, setImagesProduct] = useState([]);

  const handleRatioChange = (event) => {
    setRatio(event.target.value);
  };

  const handleImageThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageThumbnailPreview(URL.createObjectURL(file));
      setImageThumbnail(file);
    }
  };

  const handleImagesProductChange = (event) => {
    if (imagesProduct.length >= 5) {
      return;
    }

    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => {
        const id = crypto.randomUUID();
        return {
          id,
          file,
          src: URL.createObjectURL(file),
        };
      });

      setImagesProductPreview((prev) => [...prev, ...newFiles]);
      setImagesProduct((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImageProduct = (id) => {
    setImagesProductPreview((prev) => prev.filter((image) => image.id !== id));
    setImagesProduct((prev) => prev.filter((image) => image.id !== id));
  };

  const handleRemoveImageThumbnail = () => {
    setImageThumbnailPreview(null);
    setImageThumbnail(null);
  };

  const cropImage = async (imageFile, ratioConfig) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width: imgW, height: imgH } = img;
        let cropX = 0,
          cropY = 0,
          cropWidth = imgW,
          cropHeight = imgH;

        if (ratioConfig === "1x1") {
          const size = Math.min(imgW, imgH);
          cropX = (imgW - size) / 2;
          cropY = (imgH - size) / 2;
          cropWidth = size;
          cropHeight = size;
          canvas.width = size;
          canvas.height = size;
        } else if (ratioConfig === "3x4") {
          if (imgW / imgH > 3 / 4) {
            cropHeight = imgH;
            cropWidth = (imgH * 3) / 4;
            cropX = (imgW - cropWidth) / 2;
          } else {
            cropWidth = imgW;
            cropHeight = (imgW * 4) / 3;
            cropY = (imgH - cropHeight) / 2;
          }
          canvas.width = cropWidth;
          canvas.height = cropHeight;
        }

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
    });
  };

  return {
    ratio,
    imageThumbnail,
    imageThumbnailPreview,
    imagesProduct,
    imagesProductPreview,
    handleRatioChange,
    handleImageThumbnailChange,
    handleImagesProductChange,
    handleRemoveImageProduct,
    handleRemoveImageThumbnail,
    cropImage,
  };
};

export default useProductImages;
