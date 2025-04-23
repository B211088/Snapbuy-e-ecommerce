// ProductImagesSection.jsx
import React from "react";

const ProductImagesSection = ({
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
  isDarkMode,
  loading,
}) => {
  return (
    <>
      <div className="w-full flex items-center gap-[10px] px-[20px] py-[20px]">
        <div className="w-2/12 flex items-center font-nunito text-[0.9rem]">
          <span>Hình ảnh sản phẩm</span>
        </div>
        <div className="w-10/12">
          <div className="flex gap-4 mb-3 font-nunito pb-[20px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[0.85rem]">Hình ảnh tỷ lệ 1x1</span>
              <input
                disabled={loading}
                type="radio"
                name="ratio"
                value="1x1"
                checked={ratio === "1x1"}
                onChange={handleRatioChange}
                className="hidden"
              />
              <div
                className={`w-[16px] h-[16px] rounded-full border-2 ${
                  ratio === "1x1"
                    ? "bg-dark-500 border-dark-500"
                    : "border-gray-400"
                }`}
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[0.85rem]">Hình ảnh tỷ lệ 3x4</span>
              <input
                disabled={loading}
                type="radio"
                name="ratio"
                value="3x4"
                checked={ratio === "3x4"}
                onChange={handleRatioChange}
                className="hidden"
              />
              <div
                className={`w-[16px] h-[16px] rounded-full border-2 ${
                  ratio === "3x4"
                    ? "bg-dark-500 border-dark-500"
                    : "border-gray-400"
                }`}
              />
            </label>
          </div>

          <div className="flex gap-4 flex-wrap">
            {imagesProductPreview.map((img, index) => (
              <div
                key={index}
                className={`relative border rounded-lg overflow-hidden group ${
                  ratio === "1x1" ? "w-[100px] h-[100px]" : "w-[75px] h-[100px]"
                }`}
              >
                <img
                  src={img.src}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  disabled={loading}
                  className={`absolute group-hover:flex hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full cursor-pointer ${
                    isDarkMode
                      ? "bg-light-200 text-dark-100"
                      : "bg-dark-400 text-light-100"
                  }`}
                  onClick={() => handleRemoveImageProduct(img.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}

            {imagesProductPreview.length >= 0 &&
              imagesProductPreview.length < 5 && (
                <label
                  className={`flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600 ${
                    ratio === "1x1"
                      ? "w-[100px] h-[100px]"
                      : "w-[75px] h-[100px]"
                  }`}
                >
                  <i className="fa-solid fa-image text-2xl"></i>
                  <span className="text-[0.7rem] text-center">
                    Thêm hình ảnh {imagesProduct.length}/5
                  </span>
                  <input
                    disabled={loading}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagesProductChange}
                  />
                </label>
              )}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center gap-[10px] px-[20px] py-[20px]">
        <div className="w-2/12 flex items-center font-nunito text-[0.9rem]">
          <span>Thêm Ảnh bìa</span>
        </div>
        <div className="w-10/12 flex items-center gap-4">
          {imageThumbnailPreview ? (
            <div className="w-[100px] h-[100px] aspect-square rounded-[5px] relative group">
              <img
                src={imageThumbnailPreview}
                alt="Uploaded"
                className="w-full h-full aspect-square rounded-[5px] object-cover"
              />
              <button
                disabled={loading}
                className={`absolute group-hover:flex hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full cursor-pointer ${
                  isDarkMode
                    ? "bg-light-200 text-dark-100"
                    : "bg-dark-400 text-light-100"
                }`}
                onClick={handleRemoveImageThumbnail}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ) : (
            <label
              className={`flex flex-col w-[100px] h-[100px] aspect-square items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600`}
            >
              <i className="fa-solid fa-image text-2xl"></i>
              <span className="text-[0.7rem] text-center">Thêm hình ảnh</span>
              <input
                disabled={loading}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageThumbnailChange}
              />
            </label>
          )}

          <div className="font-nunito text-[0.8rem]">
            Tải lên hình ảnh 1:1. Ảnh bìa sẽ được hiển thị tại các trang Kết quả
            tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm
            lượt truy cập vào sản phẩm của bạn
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductImagesSection;
