import React from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { Link, Outlet } from "react-router-dom";
import ContainerModeLayer1 from "../../Container/ContainerModeLayer1";
import { useState } from "react";
import { useNotify } from "../../Notify/NotifyModal";
import InputField from "../../Modal/InputField";

const AddProduct = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const [imagesProduct, setImagesProduct] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [ratio, setRatio] = useState("1x1");
  const [infoProduct, setInfoProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    categoryId: "",
    subcategoryId: "",
  });

  console.log(infoProduct);

  const handleRatioChange = (event) => {
    setRatio(event.target.value);
  };

  const handleImagesProductChange = (event) => {
    if (imagesProduct.length >= 5) {
      notifyWarning("Chỉ được thêm tối đã 5 ảnh");
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImagesProduct((prev) => [
        ...prev,
        { id: crypto.randomUUID(), src: newImage },
      ]);
    }
  };

  const handleImageThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImageThumbnail(newImage);
    }
  };

  const handleRemoveImageProduct = (id) => {
    setImagesProduct((prev) => prev.filter((image) => image.id !== id));
  };

  const handleRemoveImageThumnail = () => {
    setImageThumbnail(null);
  };

  const handleInfoChange = (event) => {
    const { name, value } = event.target;
    setInfoProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ContainerModeLayer1>
      <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
        <div className="flex items-center  font-nunito gap-[10px] pb-[10px]">
          <div
            className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            <i className="fa-solid fa-dolly"></i>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-bold text-[1.2rem]">Thêm sản phẩm</h1>
            <p
              className={`font-normal text-[0.95rem] ${
                isDarkMode ? " text-dark-300" : "text-light-300"
              }`}
            >
              Thêm sản phẩm vào kho
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full  flex items-center gap-[10px] px-[20px] py-[20px]">
          <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
            <span>Hình ảnh sản phẩm</span>
          </div>
          <div className="w-10/12 ">
            <div className="flex gap-4 mb-3 font-nunito pb-[20px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[0.85rem] ">Hình ảnh tỷ lệ 1x1</span>
                <input
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
                <span className="text-[0.85rem] ">Hình ảnh tỷ lệ 3x4</span>
                <input
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
              {imagesProduct.map((img, index) => (
                <div
                  key={index}
                  className={`relative border rounded-lg overflow-hidden  group ${
                    ratio === "1x1"
                      ? "w-[100px] h-[100px]"
                      : "w-[75px] h-[100px]"
                  }`}
                >
                  <img
                    src={img.src}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full bg-dark-200 cursor-pointer"
                    onClick={() => handleRemoveImageProduct(img.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </div>
                </div>
              ))}

              <label
                className={`flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600 ${
                  ratio === "1x1" ? "w-[100px] h-[100px]" : "w-[75px] h-[100px]"
                }`}
              >
                <i className="fa-solid fa-image text-2xl"></i>
                <span className="text-[0.7rem] text-center">
                  Thêm hình ảnh {imagesProduct.length}/5
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesProductChange}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="w-full  flex items-center  gap-[10px]  px-[20px] py-[20px]">
          <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
            <span>Thêm Ảnh bìa</span>
          </div>
          <div className="w-10/12 flex items-center gap-4 ">
            {imageThumbnail ? (
              imageThumbnail && (
                <div className="w-[100px] h-[100px] aspect-square rounded-[5px] relative group">
                  <img
                    src={imageThumbnail}
                    alt="Uploaded"
                    className="w-full  h-full aspect-square rounded-[5px] object-cover"
                  />
                  <div
                    className="absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full bg-dark-200 cursor-pointer"
                    onClick={handleRemoveImageThumnail}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </div>
                </div>
              )
            ) : (
              <label
                className={`flex flex-col w-[100px] h-[100px] aspect-square items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600`}
              >
                <i className="fa-solid fa-image text-2xl"></i>
                <span className="text-[0.7rem] text-center">
                  Thêm hình ảnh {imagesProduct.length}/1
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageThumbnailChange}
                />
              </label>
            )}

            <div className="font-nunito text-[0.8rem]">
              Tải lên hình ảnh 1:1. Ảnh bìa sẽ được hiển thị tại các trang Kết
              quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu
              hút thêm lượt truy cập vào sản phẩm của bạn
            </div>
          </div>
        </div>
        <div className="w-full  flex items-center  gap-[10px]  px-[20px] py-[20px]">
          <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
            <span>Tên sản phẩm</span>
          </div>
          <div className="w-10/12 flex items-center  gap-[10px]   ">
            <div
              className={`w-full h-[42px] flex items-center gap-[5px] pr-[5px] rounded-[5px] ${
                isDarkMode ? "border-[1px]" : "bg-dark-400 "
              }`}
            >
              <input
                className="w-full bg-transparent outline-none text-[0.8rem] px-[10px]"
                type="text"
                value={infoProduct.name}
                maxLength={100}
                name="name"
                placeholder="Nhập tên sản phẩm"
                onChange={handleInfoChange}
              />
              <div className="text-[0.8rem] w-[50px] flex justify-end">
                <span> {infoProduct.name.length}/100</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  flex items-center gap-[10px] px-[20px] py-[20px]">
          <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
            <span>Chọn nghành hàng</span>
          </div>
          <div className="w-10/12 flex items-center  ">
            <div
              className={`w-full flex items-center  h-[42px] rounded-[5px] cursor-pointer ${
                isDarkMode ? "border-[1px]" : "bg-dark-400"
              }`}
            >
              <div className="w-full flex"></div>
              <div className="flex items-center justify-center text-[0.8rem] w-[50px] cursor-pointer border-l-[1px] h-full ">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-[10px] px-[20px] py-[20px]">
          <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
            <span>Mô tả sản phẩm</span>
          </div>
          <div className="w-10/12 flex items-center  gap-[10px]  gap-4 ">
            <div
              className={`w-full h-[122px] flex  gap-[5px] pr-[5px] rounded-[5px] ${
                isDarkMode ? "border-[1px]" : "bg-dark-400 "
              }`}
            >
              <textarea
                className="w-full h-full bg-transparent outline-none text-[0.8rem] p-[10px]"
                type="text"
                value={infoProduct.description}
                maxLength={400}
                name="description"
                placeholder="Nhập mô tả sản phẩm"
                onChange={handleInfoChange}
              />
              <div className="text-[0.8rem] w-[50px] flex justify-end py-[10px]">
                <span> {infoProduct.description.length}/400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerModeLayer1>
  );
};

export default AddProduct;
