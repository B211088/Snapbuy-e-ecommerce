import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import InputField from "./InputField";
import { useTheme } from "../../Provider/ThemeProvider";
import { useNotify } from "../Notify/NotifyModal";
import { useCategories } from "../../contexts/CategoriesContext";

const AddSubCategory = ({
  categoryId,
  onCloseModalAddSubCategory,
  onSuccess,
}) => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const { addSubCategory } = useCategories();
  const [formData, setFormData] = useState({
    categoryId: categoryId,
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubCategory = async () => {
    const { name, description } = formData;
    if (!name) {
      notifyWarning("Hãy nhập tên phân loại hàng!");
      return;
    }
    if (!description) {
      notifyWarning("Hãy nhập tên phân loại hàng!");
      return;
    }

    try {
      const response = await addSubCategory(categoryId, formData);
      if (response.success) {
        onSuccess(`Thêm phân loại ${response.data.name} thành công`);
        setFormData({ name: "", description: "" });
        onCloseModalAddSubCategory();
        return;
      }
      notifyWarning(response.message, 3000);
      return;
    } catch (error) {
      notifyError(error.message, 3000);
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseModalAddSubCategory}>
      <div className="w-full flex flex-col px-[20px] ">
        <h1>Thêm loại sản phẩm</h1>
        <p>Nhập thông tin và bấm xác nhận</p>
      </div>
      <div className="w-full flex flex-col gap-[20px] pt-[20px] pb-[20px] px-[20px]">
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập tên loại",
            name: "name",
            value: formData.name,
            required: true,
          }}
          onChange={handleChange}
        />
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập mô tả loại",
            name: "description",
            value: formData.description,
            required: true,
          }}
          onChange={handleChange}
        />
        <button
          className="w-full py-[8px] px-[30px] bg-primary text-white font-bold rounded-md  transition-all duration-300"
          onClick={handleAddSubCategory}
        >
          Xác nhận
        </button>
        <button
          className={`w-full py-[8px] px-[30px]  font-bold rounded-md  transition-all duration-300 ${
            isDarkMode ? "border-[1px] " : "bg-dark-400"
          }`}
          onClick={onCloseModalAddSubCategory}
        >
          Hủy
        </button>
      </div>
    </ModalContainer>
  );
};

export default AddSubCategory;
