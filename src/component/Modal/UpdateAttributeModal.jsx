import React, { useState } from "react";
import InputField from "./InputField";
import ModalContainer from "./ModalContainer";
import { useNotify } from "../Notify/NotifyModal";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAdminManager } from "../../contexts/AdminContext";

const UpdateAttributeModal = ({ attribute, onCloseModal }) => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning } = useNotify();
  const { updateAttribute } = useAdminManager();
  const [formData, setFormData] = useState({
    id: attribute.id,
    name: attribute?.name || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdateAttribute = async () => {
    if (!formData.name.trim()) {
      notifyWarning("Hãy nhập tên thuộc tính!");
      return;
    }

    try {
      const response = await updateAttribute(formData);

      if (response?.success) {
        notifySuccess(
          `Cập nhật thuộc tính "${response.data.name}" thành công!`
        );
        onCloseModal();
      } else {
        notifyWarning(response?.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      notifyWarning(
        error.response?.data?.message || error.message || "Đã xảy ra lỗi!"
      );
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseModal}>
      <div className="w-full flex flex-col px-[20px]">
        <h1 className="text-lg font-bold">Cập nhật thuộc tính</h1>
        <p>Chỉnh sửa thông tin và bấm xác nhận</p>
      </div>

      <div className="w-full flex flex-col gap-[20px] py-[20px] px-[20px]">
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập tên thuộc tính",
            name: "name",
            value: formData.name,
            required: true,
          }}
          onChange={handleChange}
        />

        <button
          className="w-full py-[8px] px-[30px] bg-primary text-white font-bold rounded-md transition-all duration-300"
          onClick={handleUpdateAttribute}
        >
          Xác nhận
        </button>
        <button
          className={`w-full py-[8px] px-[30px] font-bold rounded-md transition-all duration-300 ${
            isDarkMode ? "border-[1px]" : "bg-dark-400"
          }`}
          onClick={onCloseModal}
        >
          Hủy
        </button>
      </div>
    </ModalContainer>
  );
};

export default UpdateAttributeModal;
