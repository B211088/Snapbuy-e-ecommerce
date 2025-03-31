import { useState } from "react";
import InputField from "./InputField";
import ModalContainer from "./ModalContainer";
import { useTheme } from "../../Provider/ThemeProvider";
import { useNotify } from "../Notify/NotifyModal";

import { useAdminManager } from "../../contexts/AdminContext";

const UpdateSubCategory = ({
  categoryId,
  subCategoryData,
  onCloseModalUpdateSubCategory,
  onSuccess,
}) => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning } = useNotify();
  const { updateSubCategory } = useAdminManager();
  const [formData, setFormData] = useState({
    categoryId: categoryId,
    name: subCategoryData.name,
    description: subCategoryData.description,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("subCategoryData", subCategoryData);

  const handleUpdateSubCategory = async () => {
    const { name, description } = formData;
    if (!name) {
      notifyWarning("Hãy nhập tên loại", 3000);
      return;
    }

    if (!description) {
      notifyWarning("Hãy nhập mô tả loại", 3000);
      return;
    }

    try {
      const subCategoryId = subCategoryData.id;
      const response = await updateSubCategory(
        subCategoryId,
        formData,
        categoryId
      );
      if (response.success) {
        onSuccess(`Cập nhân phân loại thành công`);
        onCloseModalUpdateSubCategory();
        return;
      }
      notifyWarning("Cập nhật sản phẩm thất bại", 3000);
      return;
    } catch (error) {
      console.error;
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseModalUpdateSubCategory}>
      <div className="w-full flex flex-col px-[20px] ">
        <h1>Cập nhật loại sản phẩm</h1>
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
          onClick={handleUpdateSubCategory}
        >
          Xác nhận
        </button>
        <button
          className={`w-full py-[8px] px-[30px]  font-bold rounded-md  transition-all duration-300 ${
            isDarkMode ? "border-[1px] " : "bg-dark-400"
          }`}
          onClick={onCloseModalUpdateSubCategory}
        >
          Hủy
        </button>
      </div>
    </ModalContainer>
  );
};

export default UpdateSubCategory;
