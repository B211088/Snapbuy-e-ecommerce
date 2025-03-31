import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/client/cropImage";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";

import { ToastContainer } from "react-toastify";
import { useNotify } from "../Notify/NotifyModal";

const UpdateImgModal = ({
  onSuccess,
  onCropped,
  onUpload,
  onCloseUpdateImgModal,
}) => {
  const { notifySuccess, notifyWarning } = useNotify();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { isDarkMode } = useTheme();
  const {
    uploadAvatar,
    authState: { user },
  } = useAuth();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  console.log(image);

  const onCropComplete = useCallback(
    async (_, croppedAreaPixels) => {
      const croppedImageBlob = await getCroppedImg(preview, croppedAreaPixels);
      setCroppedImage(croppedImageBlob);
    },
    [preview]
  );

  const handleUpload = () => {
    onCropped(croppedImage);
    onUpload();
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[#2e2e2e27] z-[50] p-[20px]"
      onClick={onCloseUpdateImgModal}
    >
      <div
        className={`w-[50%] min-w-[350px] flex flex-col  px-[20px] py-[20px] gap-[20px] rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white" : "text-white bg-dark-400"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center gap-[5px]">
          <h1 className="font-bold text-[1.2rem]">Cập nhật ảnh đại diện</h1>
          <p
            className={`text-[0.9rem] ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            Vui lòng chọn ảnh để làm ảnh đại diện
          </p>
        </div>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg py-[20px] cursor-pointer transition duration-300"
        >
          <span className="text-sm text-dark-700">Chọn ảnh từ thiết bị</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {preview && (
          <div className="relative w-full h-[50vh]">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <div className="w-full flex flex-col gap-[10px]">
          <button
            className="w-full outline-none bg-primary py-[5px] rounded-[5px] font-nunito font-bold text-light-100"
            onClick={handleUpload}
          >
            Cập nhật
          </button>
          <button
            className={`outline-none py-[5px] rounded-[5px] font-nunito font-bold ${
              isDarkMode
                ? "border-[1px] text-dark-100  border-dark-200 "
                : "bg-dark-300"
            }`}
            onClick={onCloseUpdateImgModal}
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateImgModal;
