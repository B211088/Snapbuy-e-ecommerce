import React, { useEffect, useState } from "react";
import { useTheme } from "../../provider/ThemeProvider";
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
    updateSubcategoryAttributes,
    removeSubcategoryAttribute,
  } = useAdminManager();

  const { notifySuccess, notifyWarning, notifyError } = useNotify();

  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editAttribute, setEditAttribute] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, [subcategoryId]);

  const fetchAttributes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubcategoryAttributes(subcategoryId);
      if (response.success) {
        setSubcategoryAttributes(response.data);
      } else {
        notifyWarning(response?.message || "Không thể tải thuộc tính!");
      }
    } catch (error) {
      notifyError(
        "Lỗi khi tải thuộc tính: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttributes = async () => {
    if (selectedAttributes.length === 0) {
      notifyWarning("Vui lòng chọn ít nhất một thuộc tính!");
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (selectedAttributes.length === 1) {
        response = await addOneSubcategoryAttribute(subcategoryId, {
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

        response = await addMultipleSubcategoryAttributes(
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
    } catch (error) {
      notifyError(
        "Lỗi khi thêm thuộc tính: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
      setSelectedAttributes([]);
    }
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

  const handleDelete = async (attributeId) => {
    try {
      setIsLoading(true);
      const result = await removeSubcategoryAttribute(
        subcategoryId,
        attributeId
      );
      if (result.success) {
        notifySuccess(result.message || "Xóa thuộc tính thành công!");
        setSubcategoryAttributes((prev) =>
          prev.filter((attr) => attr.subcategory_attribute_id !== attributeId)
        );
      } else {
        notifyWarning(result.message || "Lỗi khi xóa thuộc tính!");
      }
    } catch (error) {
      notifyError(
        "Lỗi khi xóa thuộc tính: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (attribute) => {
    setEditMode(attribute.subcategory_attribute_id);
    setEditAttribute({
      ...attribute,
      is_required: attribute.is_required || false,
      is_filterable: attribute.is_filterable || false,
      display_order: attribute.display_order || 0,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditAttribute(null);
  };

  const handleUpdateAttribute = async () => {
    if (!editAttribute) return;

    setIsLoading(true);
    try {
      const result = await updateSubcategoryAttributes(
        subcategoryId,
        editAttribute.subcategory_attribute_id,
        {
          is_required: editAttribute.is_required,
          is_filterable: editAttribute.is_filterable,
          display_order: editAttribute.display_order,
        }
      );

      if (result.success) {
        notifySuccess("Cập nhật thuộc tính thành công!");
        setSubcategoryAttributes((prev) =>
          prev.map((attr) =>
            attr.subcategory_attribute_id ===
            editAttribute.subcategory_attribute_id
              ? { ...attr, ...editAttribute }
              : attr
          )
        );
        setEditMode(null);
        setEditAttribute(null);
      } else {
        notifyWarning(result.message || "Lỗi khi cập nhật thuộc tính!");
      }
    } catch (error) {
      notifyError(
        "Lỗi khi cập nhật thuộc tính: " +
          (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEditAttribute = (field, value) => {
    setEditAttribute((prev) => ({
      ...prev,
      [field]: field === "display_order" ? parseInt(value) : value,
    }));
  };

  const renderEditForm = () => {
    if (!editAttribute) return null;

    return (
      <div className="border p-3 rounded-md mb-3">
        <h4 className="font-semibold mb-2">
          Cập nhật thuộc tính: {editAttribute.attribute_value}
        </h4>

        <div className="mb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editAttribute.is_required}
              onChange={(e) =>
                handleChangeEditAttribute("is_required", e.target.checked)
              }
            />
            <span>Bắt buộc</span>
          </label>
        </div>

        <div className="mb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editAttribute.is_filterable}
              onChange={(e) =>
                handleChangeEditAttribute("is_filterable", e.target.checked)
              }
            />
            <span>Có thể lọc</span>
          </label>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Thứ tự hiển thị:</label>
          <input
            type="number"
            min="0"
            value={editAttribute.display_order}
            onChange={(e) =>
              handleChangeEditAttribute("display_order", e.target.value)
            }
            className="w-full p-2 border rounded-md outline-none bg-transparent"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdateAttribute}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[#2e2e2e27] z-[30]"
      onClick={onCloseModal}
    >
      <div
        className={`pc:w-[60%] pc:min-w-[460px] mb:w-full mb:min-w-[340px] rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white" : "text-white bg-dark-400"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-nunito text-[1.2rem] font-semibold text-center pt-[20px] pb-[20px] px-[20px] border-b-[1px] border-dashed">
          Quản lý Thuộc tính Danh mục con
        </h2>

        <div className="w-full font-nunito flex flex-col md:flex-row items-start gap-[20px] py-[20px] px-[20px]">
          {/* Left column - Existing attributes */}
          <div className="w-full md:w-6/12">
            <h3 className="font-semibold mb-3">Thuộc tính đã thêm</h3>

            {editMode && renderEditForm()}

            <div className="flex flex-col gap-[10px] h-[350px] max-h-[350px] overflow-y-auto overflow-x-hidden scrollbar-custom">
              {isLoading && !subcategoryAttributes.length ? (
                <p className="text-center">Đang tải...</p>
              ) : subcategoryAttributes.length > 0 ? (
                subcategoryAttributes.map((attr) => (
                  <div
                    key={attr.subcategory_attribute_id}
                    className={`flex justify-between items-center p-3 border rounded-[5px] ${
                      editMode === attr.subcategory_attribute_id
                        ? "border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {attr.attribute_value}
                      </span>
                      <div className="text-xs flex gap-2 mt-1">
                        {attr.is_required && (
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Bắt buộc
                          </span>
                        )}
                        {attr.is_filterable && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Lọc
                          </span>
                        )}
                        {attr.display_order > 0 && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            Thứ tự: {attr.display_order}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(attr)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
                        disabled={isLoading || editMode !== null}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(attr.subcategory_attribute_id)
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                        disabled={isLoading || editMode !== null}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  Chưa có thuộc tính nào
                </p>
              )}
            </div>
          </div>

          {/* Right column - Add new attributes */}
          <div className="w-full md:w-6/12">
            <div className="mb-3">
              <label className="block font-medium mb-2">
                Chọn thuộc tính mới:
              </label>
              <select
                onChange={handleSelectAttribute}
                className="w-full p-2 border rounded-md outline-none bg-transparent"
                defaultValue=""
                disabled={isLoading || editMode !== null}
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
              </select>
            </div>

            {selectedAttributes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Thuộc tính sẽ thêm:</h3>
                <div className="h-[280px] overflow-y-auto overflow-x-hidden scrollbar-custom">
                  {selectedAttributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex justify-between items-center p-3 border mb-2 rounded-[5px]"
                    >
                      <span>{attr.name}</span>
                      <button
                        onClick={() => removeSelectedAttribute(attr.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddAttributes}
                  className="w-full mt-3 bg-blue-500 text-white p-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang thêm..." : "Thêm Thuộc Tính"}
                </button>
              </div>
            )}

            {selectedAttributes.length === 0 && !editMode && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Hướng dẫn</h4>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  <li>Chọn thuộc tính từ danh sách để thêm vào danh mục con</li>
                  <li>Bạn có thể thêm nhiều thuộc tính cùng lúc</li>
                  <li>Nhấn "Sửa" để cập nhật cài đặt thuộc tính</li>
                  <li>Nhấn "Xóa" để gỡ thuộc tính khỏi danh mục con</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-[20px] px-[20px] py-[15px] border-t-[1px] border-dashed">
          <button
            onClick={onCloseModal}
            className="bg-gray-500 text-white p-2 rounded-md px-[30px]"
            disabled={isLoading}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryAttributeModal;
