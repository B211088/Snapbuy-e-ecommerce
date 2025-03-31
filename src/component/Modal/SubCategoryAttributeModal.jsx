import React, { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAdminManager } from "../../contexts/AdminContext";
import { useNotify } from "../Notify/NotifyModal";

const SubCategoryAttributeModal = ({ onCloseModal, subcategoryId }) => {
  const { isDarkMode } = useTheme();
  const {
    attributeState: { attributes },
    subCategoryAttributeState: { categoryAttributes },
    getAllSubcategoryAttributes,
    addOneSubcategoryAttribute,
    addMultipleSubcategoryAttributes,
  } = useAdminManager();

  const { notifySuccess, notifyWarning } = useNotify();

  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  console.log(subcategoryId);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAllSubcategoryAttributes(subcategoryId);
        if (response.success) {
          setSubcategoryAttributes(response.data);
        }
      } catch (error) {
        notifyWarning(error.message);
      }
    };
    fetchAttributes();
  }, [subcategoryId]);

  const handleAddAttributes = async () => {
    if (selectedAttributes.length === 0) {
      notifyWarning("Vui lòng chọn ít nhất một thuộc tính!");
      return;
    }

    if (selectedAttributes.length === 1) {
      const response = await addOneSubcategoryAttribute(subcategoryId, {
        subcategory_id: subcategoryId,
        attribute_id: selectedAttributes[0].id,
      });

      if (response?.success) {
        notifySuccess("Thêm thuộc tính thành công!");
        setSubcategoryAttributes((prev) => [...prev, response.data]);
      } else {
        notifyWarning(response?.message || "Lỗi khi thêm thuộc tính!");
      }
    } else {
      const attributesToAdd = selectedAttributes.map((attr) => attr.id);

      const response = await addMultipleSubcategoryAttributes(
        subcategoryId,
        attributesToAdd
      );

      if (response?.success) {
        notifySuccess("Thêm thuộc tính thành công!");
        setSubcategoryAttributes((prev) => [
          ...prev,
          ...response.data.sub_attribute,
        ]);
      } else {
        notifyWarning(response?.message || "Lỗi khi thêm nhiều thuộc tính!");
      }
    }

    setSelectedAttributes([]);
  };

  const handleSelectAttribute = (event) => {
    const selectedId = parseInt(event.target.value);
    const selectedAttr = attributes.find((attr) => attr.id === selectedId);

    if (selectedAttr) {
      setSelectedAttributes((prev) => [...prev, selectedAttr]);
      event.target.value = "";
    }
  };

  const removeSelectedAttribute = (id) => {
    setSelectedAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[#2e2e2e27] z-[30]"
      onClick={onCloseModal}
    >
      <div
        className={`pc:w-[50%] pc:min-w-[460px] mb:w-full mb:min-w-[340px]  rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white" : "text-white bg-dark-400"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-nunito text-[1.2rem]  font-semibold text-center pt-[20px] pb-[20px] px-[20px] border-b-[1px] border-dashed">
          Quản lý Thuộc tính Danh mục con
        </h2>
        <div className="w-full font-nunito flex items-center gap-[0px] py-[10px]">
          <div className="w-6/12 px-[10px]">
            <h3 className="font-semibold mb-2 px-[10px]">Thuộc tính đã thêm</h3>
            <div className="flex flex-col gap-[10px] h-[300px] max-h-[300px] px-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom ">
              {subcategoryAttributes.length > 0 ? (
                subcategoryAttributes.map((attr) => (
                  <div
                    key={attr.subcategory_attribute_id}
                    className="flex justify-between items-center p-2 border-[1px] rounded-[5px]"
                  >
                    <span>{attr.attribute_value}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  Chưa có thuộc tính nào
                </p>
              )}
            </div>
          </div>
          <div className=" w-6/12 px-[20px]">
            <div className="mb-3 flex flex-col justify-start ">
              <div className="">
                {" "}
                <label className="block font-medium mb-1">
                  Chọn thuộc tính:
                </label>
                <select
                  onChange={handleSelectAttribute}
                  className="w-full p-2 border rounded-md outline-none bg-transparent"
                  defaultValue=""
                >
                  <option className="bg-transparent" value="" disabled>
                    -- Chọn thuộc tính --
                  </option>
                  {attributes
                    .filter(
                      (attr) =>
                        !subcategoryAttributes.some(
                          (subAttr) => subAttr.attribute_id === attr.id
                        ) &&
                        !selectedAttributes.some(
                          (selAttr) => selAttr.id === attr.id
                        )
                    )
                    .map((attr) => (
                      <option
                        className={`${
                          isDarkMode
                            ? "bg-light-100 text-dark-100"
                            : "bg-dark-300 text-light-100"
                        }`}
                        key={attr.id}
                        value={attr.id}
                      >
                        {attr.name}
                      </option>
                    ))}
                </select>{" "}
              </div>
              <div className="w-full h-[245px]">
                {selectedAttributes.length > 0 && (
                  <div className="">
                    <h3 className="font-semibold mb-2">Thuộc tính sẽ thêm:</h3>
                    <ul className="flex flex-col gap-[5px] h-[225px]  overflow-y-auto overflow-x-hidden scrollbar-custom ">
                      {selectedAttributes.map((attr) => (
                        <li
                          key={attr.id}
                          className="flex justify-between items-center p-2 border-[1px] rounded-[5px]"
                        >
                          <span>{attr.name}</span>
                          <button
                            onClick={() => removeSelectedAttribute(attr.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Xóa
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-[20px] px-[20px] py-[10px] border-t-[1px] border-dashed">
          <button
            onClick={onCloseModal}
            className=" bg-gray-500 text-white p-2 rounded-md px-[30px]"
          >
            Đóng
          </button>
          <button
            onClick={handleAddAttributes}
            className=" bg-blue-500 text-white p-2 rounded-md px-[30px]"
          >
            Thêm Thuộc Tính
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryAttributeModal;
