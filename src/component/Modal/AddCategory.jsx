import React, { useState } from "react";
import InputField from "./InputField";
import ModalContainer from "./ModalContainer";
import { useNotify } from "../Notify/NotifyModal";
import { useTheme } from "../../provider/ThemeProvider";
import { useAdminManager } from "../../contexts/AdminContext";

const AddCategory = ({ onCloseModalAddCategory }) => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning } = useNotify();
  const { addCategory } = useAdminManager();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async () => {
    const { name, description } = formData;

    if (!name) {
      notifyWarning("Hãy nhập tên nghành hàng!");
      return;
    }
    if (!description) {
      notifyWarning("Hãy nhập mô tả nghành hàng!");
      return;
    }

    try {
      const response = await addCategory(formData);
      if (response.success) {
        notifySuccess(`Thêm Nghành hàng ${response.name} thành công`);
        onCloseModalAddCategory();
        return;
      }
      notifyWarning(response.message);
      return;
    } catch (error) {
      notifyWarning(error.message);
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseModalAddCategory}>
      <div className="w-full flex flex-col px-[20px] pt-[10px] font-nunito ">
        <h1 className="text-[1.2rem] font-bold pb-[5px]">Thêm nghành hàng </h1>
        <p className="text-[0.9rem]">Nhập thông tin và bấm xác nhận</p>
      </div>
      <div className="w-full flex flex-col gap-[20px] pt-[20px] pb-[15px] px-[20px]">
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập tên nghành hàng",
            name: "name",
            value: formData.name,
            required: true,
          }}
          onChange={handleChange}
        />
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập mô nghành hàng",
            name: "description",
            value: formData.description,
            required: true,
          }}
          onChange={handleChange}
        />
        <button
          className="w-full py-[7px] px-[30px] bg-primary text-white font-bold rounded-md  transition-all duration-300"
          onClick={handleAddCategory}
        >
          Xác nhận
        </button>
        <button
          className={`w-full py-[8px] px-[30px]  font-bold rounded-md  transition-all duration-300 ${
            isDarkMode ? "border-[1px] " : "bg-dark-400"
          }`}
          onClick={onCloseModalAddCategory}
        >
          Hủy
        </button>
      </div>
    </ModalContainer>
  );
};

export default AddCategory;
