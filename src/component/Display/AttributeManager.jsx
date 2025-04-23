import React, { useState } from "react";
import { useConfirm } from "../Notify/ConfirmModal";
import { useAdminManager } from "../../contexts/AdminContext";
import UpdateAttributeModal from "../Modal/UpdateAttributeModal";
import { useNotify } from "../Notify/NotifyModal";
import AddAttributeModal from "../Modal/AddAttributeModal";
import { useTheme } from "../../provider/ThemeProvider";
import ActionButton from "../Button/ActionButton";

const AttributeManager = () => {
  const { isDarkMode } = useTheme();
  const { confirm, ConfirmComponent } = useConfirm();
  const {
    attributeState: { attributes },
    removeAttribute,
  } = useAdminManager();
  const { notifySuccess, notifyWarning } = useNotify();
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [showModalUpdateAttribute, setShowModalUpdateAttribute] =
    useState(false);
  const [showModalAddAttribute, setShowModalAddAttribute] = useState(false);

  const openModalUpdateAttribute = (attribute) => {
    setShowModalUpdateAttribute(true);
    setSelectedAttribute(attribute);
  };

  const handleDeleteAttribute = (id) => {
    confirm({
      message: "Bạn có chắc muốn xóa thuộc tính này?",
      onConfirm: async () => {
        try {
          const response = await removeAttribute(id);
          if (response.success) {
            notifySuccess("Xóa thuộc tính thành công", 3000);
          } else {
            notifyWarning("Xóa thuộc tính thất bại", 3000);
          }
        } catch (error) {
          console.log("Lỗi xóa thuộc tính", error);
          notifyWarning("Đã xảy ra lỗi khi xóa thuộc tính", 3000);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  return (
    <div className="w-full flex flex-col">
      <ConfirmComponent />
      {showModalUpdateAttribute && (
        <UpdateAttributeModal
          attribute={selectedAttribute}
          onCloseModal={() => setShowModalUpdateAttribute(false)}
        />
      )}
      {showModalAddAttribute && (
        <AddAttributeModal onClose={() => setShowModalAddAttribute(false)} />
      )}

      <div className="w-full flex items-center justify-between px-5 py-3 font-nunito border-b border-dashed">
        <h1 className="font-bold text-lg">Quản lý thuộc tính sản phẩm</h1>
        <div
          className=" flex items-center justify-center  gap-[7px] truncate rounded-[5px]  text-dark-1000  border-[1px] border-dark-700  p-[3px] cursor-pointer"
          onClick={() => setShowModalAddAttribute(true)}
        >
          <div className="w-full flex items-center justify-center gap-[5px] px-[20px] py-[5px]  rounded-[4px] bg-primary">
            <span className="font-bold text-[0.8rem] uppercase">
              Thêm thuộc tính
            </span>
          </div>
        </div>
      </div>

      <div
        className="w-full flex flex-col gap-2 px-5 py-4 overflow-y-auto scrollbar-custom"
        style={{ height: "calc(100vh - 270px)" }}
      >
        {attributes.length > 0 ? (
          attributes.map((attribute, index) => (
            <div
              key={attribute.id}
              className={`flex items-center  py-[10px] px-[10px]  rounded-[5px] shadow-sm ${
                isDarkMode ? "border-[1px] " : "bg-dark-400"
              }`}
            >
              <div className="flex-1 flex items-center gap-[10px]">
                <div className="w-[32px] h-[32px] border-[1px] flex items-center justify-center text-center font-bold rounded-[5px]">
                  <span>{index + 1}</span>
                </div>
                <div className="w-3/12 text-[0.9rem]">{attribute.name}</div>
              </div>
              <div className="flex gap-2">
                <ActionButton
                  onClick={() => openModalUpdateAttribute(attribute)}
                  payload={{
                    name: "Chỉnh sửa thuộc tính",
                    icon: "fa-solid fa-pen-to-square",
                  }}
                />
                <ActionButton
                  onClick={() => handleDeleteAttribute(attribute.id)}
                  payload={{
                    name: "Chỉnh sửa thuộc tính",
                    icon: "fa-regular fa-trash-can",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Chưa có thuộc tính nào.</p>
        )}
      </div>
    </div>
  );
};

export default AttributeManager;
