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
        className={`pc:w-[60%] pc:min-w-[60px]   tl:min-w-[480px] mb:w-full mb:min-w-[340px] rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white " : "text-white bg-dark-300"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center gap-[5px] px-[20px] py-[15px] border-b-[1px] border-dashed font-nunito font-bold ">
          <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full text-[1.4rem] border-[1px] ">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div className="w-full">
            <h1 className="text-[1.2rem]">Chọn phân loại hàng</h1>
            <p
              className={`text-[0.9rem] font-normal ${
                isDarkMode ? "text-dark-400" : "text-light-300"
              }`}
            >
              Chọn phân loại để lấy thuộc tính của sản phẩm
            </p>
          </div>
        </div>
        <div className="w-full  flex mb:flex-col gap-[10px] p-[20px]  font-nunito  ">
          <div
            className={`pc:w-5/12 w-full pr-[10px]  pc:border-r-[1px] ${
              isDarkMode ? "border-dark-100" : "border-dark-400"
            }`}
          >
            <h1 className="font-bold mb-[5px]">Ngành hàng</h1>
            <div className="w-full pb-[10px]">
              <div
                className={`w-full flex items-center  rounded-[5px] py-[2px]  ${
                  isDarkMode ? "border-[1px] " : " bg-dark-400"
                }`}
              >
                <div className="w-[30px] h-[30px] flex items-center justify-center text-[1rem] ">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="flex-1 outline-none bg-transparent pr-2 py-1 text-[0.85rem]"
                />
              </div>
            </div>
            <ul className="w-full pc:min-h-[300px] pc:max-h-[300px] flex flex-col gap-[5px] overflow-y-auto overflow-x-hidden">
              {[...categories]
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map((cat) => (
                  <li
                    key={cat.id}
                    className={`w-full px-[10px] py-[5px] rounded-[5px] font-bold text-[0.85rem] cursor-pointer 
                      ${
                        selectedCategory?.id === cat.id
                          ? isDarkMode
                            ? " bg-[#b9c6cc50] text-[#4579e8]"
                            : " bg-dark-400 text-light-100"
                          : isDarkMode
                          ? "hover:bg-[#b9c6cc50] hover:text-[#4579e8]"
                          : "hover:bg-dark-400 hover:text-light-100 bg-dark-300 "
                      }`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className="pc:w-7/12 w-full pl-[10px]  min-h-[300px] max-h-[420px] ">
            <h1 className="font-bold mb-[5px]">Phân loại</h1>{" "}
            <div className="w-full pb-[10px]">
              <div
                className={`w-full flex items-center  rounded-[5px] py-[2px]  ${
                  isDarkMode ? "border-[1px] " : " bg-dark-400"
                }`}
              >
                <div className="w-[30px] h-[30px] flex items-center justify-center text-[1rem] ">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="flex-1 outline-none bg-transparent pr-2 py-1 text-[0.85rem]"
                />
              </div>
            </div>
            {selectedCategory && (
              <ul className="w-full  max-h-[300px] flex flex-col gap-[5px] overflow-x-hidden overflow-y-auto ">
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <li
                      key={sub.id}
                      className={`w-full  px-[10px] py-[5px] rounded-[5px] text-[0.9rem] cursor-pointer font-bold ${
                        isDarkMode
                          ? " hover:bg-[#b9c6cc50] hover:text-[#4579e8]  "
                          : "hover:bg-dark-400 text-light-100 "
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
            isDarkMode ? " border-light-200  " : " border-dark-400"
          }`}
        >
          <button
            className={`px-[40px] py-[6px]  rounded-[5px] ${
              isDarkMode
                ? "text-dark-100 border-[1px] "
                : "text-light-100 bg-dark-500"
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
