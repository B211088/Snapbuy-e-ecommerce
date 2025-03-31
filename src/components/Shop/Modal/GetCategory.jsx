import React, { useState } from "react";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useAppData } from "../../../contexts/client/AppDataContext";

const GetCategory = ({ onCloseModal, onSelect }) => {
  const { isDarkMode } = useTheme();
  const {
    categoriesState: { categories },
    getSubCategories,
  } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  console.log(subCategories);
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    const subs = await getSubCategories(category.id);
    setSubCategories(subs.data);
  };

  const handleSelect = (item, type) => {
    onSelect(item, type);
    onCloseModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center mb:px-[10px] justify-center bg-[#2e2e2e27] z-[30]"
      onClick={onCloseModal}
    >
      <div
        className={`pc:w-[60%] pc:min-w-[680px]   tl:min-w-[480px] mb:w-full mb:min-w-[340px] rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white " : "text-white bg-dark-300"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center px-[20px] py-[10px] border-b-[1px] border-dashed font-nunito font-bold text-[1.2rem]">
          <h1>Chọn phân loại hàng</h1>
        </div>
        <div className="w-full flex gap-[10px] p-[20px]  font-nunito  ">
          <div className="w-5/12 pr-[10px]  border-r-[1px]">
            <h1 className="font-bold">Ngành hàng</h1>
            <ul className="w-full max-h-[400px] flex flex-col gap-[5px] overflow-y-auto overflow-x-hidden">
              {[...categories]
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map((cat) => (
                  <li
                    key={cat.id}
                    className={`w-full px-[10px] py-[5px] rounded-[5px] font-bold text-[0.9rem] cursor-pointer 
                      ${
                        selectedCategory?.id === cat.id
                          ? isDarkMode
                            ? " bg-dark-100"
                            : " bg-dark-400"
                          : isDarkMode
                          ? "hover:bg-light-200 border-[1px]"
                          : "hover:bg-dark-400 bg-dark-200"
                      }`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className="w-7/12 pl-[10px]  min-h-[300px] max-h-[420px] ">
            <h1 className="font-bold">Danh mục con</h1>
            {selectedCategory && (
              <ul className="w-full   flex flex-col gap-[5px] overflow-x-hidden overflow-y-auto ">
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <li
                      key={sub.id}
                      className={`w-full  px-[10px] py-[5px] rounded-[5px] text-[0.9rem] cursor-pointer ${
                        isDarkMode
                          ? " hover:bg-dark-800 border-[1px]"
                          : "hover:bg-dark-400 bg-dark-200"
                      }`}
                      onClick={() => handleSelect(sub, "subCategory")}
                    >
                      {sub.name}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có danh mục con</p>
                )}
              </ul>
            )}
          </div>
        </div>
        <div
          className={`w-full  flex items-center gap-[10px] justify-end px-[20px]  py-[10px] font-nunito font-bold text-[0.9rem] border-t-[1px] ${
            isDarkMode ? " border-light-200  " : " border-dark-200"
          }`}
        >
          <button
            className={`px-[40px] py-[6px]  rounded-[5px] ${
              isDarkMode
                ? "text-dark-100 border-[1px] "
                : "text-light-100 bg-dark-200"
            }`}
            onClick={onCloseModal}
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetCategory;
