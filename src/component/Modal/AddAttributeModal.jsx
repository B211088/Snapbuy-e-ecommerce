import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import { useAdminManager } from "../../contexts/AdminContext";
import { useNotify } from "../Notify/NotifyModal";
import { useTheme } from "../../Provider/ThemeProvider";

const AddAttributeModal = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const { addAttribute, addMultipleAttribute } = useAdminManager();
  const { notifySuccess, notifyWarning } = useNotify();
  const [attributes, setAttributes] = useState([""]);

  const handleChange = (index, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
  };

  const handleRemoveField = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes.length > 0 ? updatedAttributes : [""]);
  };

  const handleAddField = () => {
    setAttributes([...attributes, ""]);
  };

  console.log(attributes);

  const handleAddAttributes = async () => {
    const validAttributes = attributes.filter((attr) => attr.trim() !== "");
    if (validAttributes.length === 0) {
      notifyWarning("Hãy nhập ít nhất một thuộc tính!");
      return;
    }

    try {
      if (validAttributes.length === 1) {
        await addAttribute({ name: validAttributes[0] });
      } else {
        await addMultipleAttribute(validAttributes);
      }
      notifySuccess("Thêm thuộc tính thành công!");
      onClose();
    } catch (error) {
      notifyWarning("Có lỗi xảy ra khi thêm thuộc tính!");
    }
  };

  return (
    <ModalContainer onCloseModal={onClose}>
      <div className="w-full flex flex-col px-[20px] font-nunito py-[10px]">
        <h1 className="font-bold text-lg">Thêm Thuộc Tính</h1>
        <p className={`${isDarkMode ? "text-dark-400" : "text-light-400"}`}>
          Nhập thông tin và bấm xác nhận
        </p>
      </div>
      <div className="w-full flex flex-col gap-3 py-4 px-5 ">
        <div className="w-full max-h-[220px] flex flex-col gap-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom ">
          {attributes.map((attribute, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-md  ${
                isDarkMode
                  ? "border-[1px]"
                  : "bg-dark-200 border-transparent border-[1px]"
              }`}
            >
              <input
                type="text"
                placeholder="Nhập tên thuộc tính"
                value={attribute}
                onChange={(e) => handleChange(index, e.target.value)}
                className=" bg-transparent text-[0.9rem] outline-none p-2 w-full"
              />
              {attributes.length > 1 && (
                <div
                  className={` px-2 py-1 rounded-md cursor-pointer hover:text-red-500`}
                  onClick={() => handleRemoveField(index)}
                >
                  <i className="fa-regular fa-square-minus"></i>
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="border-[1px] flex items-center justify-center font-nunito text-[1.2rem] py-2 px-4 rounded-md cursor-pointer"
          onClick={handleAddField}
        >
          <i className="fa-solid fa-plus"></i>
        </div>
        <button
          className="bg-primary text-white py-2 px-4 rounded-md"
          onClick={handleAddAttributes}
        >
          Xác nhận
        </button>
        <button
          className="bg-gray-400 text-white py-2 px-4 rounded-md"
          onClick={onClose}
        >
          Hủy
        </button>
      </div>
    </ModalContainer>
  );
};

export default AddAttributeModal;
