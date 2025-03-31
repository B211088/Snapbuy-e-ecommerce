import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../Provider/ThemeProvider";

import { useAppData } from "../../contexts/client/AppDataContext";

const SearchModal = ({ onCloseSearchModal }) => {
  const [subCategories, setSubCategories] = useState({});
  const { isDarkMode, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => setIsVisible(false);
  }, []);

  const {
    categoriesState: { categories, subcategories },
    getSubCategories,
  } = useAppData();

  console.log(categories);

  const getSubByCategoryId = (categoryId) => {
    return (
      subcategories.find((cat) => cat.categoryId === categoryId)?.data || []
    );
  };

  const handleShowSubCategory = async (category) => {
    setCategory(category);
    if (!subCategories[category.id]) {
      try {
        const response = await getSubCategories(category.id);
        if (response.success) {
          setSubCategories((prev) => ({
            ...prev,
            [category.id]: response.data,
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục con:", error);
      }
    }
  };

  return (
    <div
      onClick={onCloseSearchModal}
      className=" bg-[#0000001e] fixed top-0  right-0 left-0 bottom-0 z-[100] flex flex-col "
    >
      <div className="flex w-full  items-center justify-center py-[38px]  tl:px-[10px] ">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`pc:w-[90%]  tl:w-full mb:w-[94%]  min-w-[270px] flex flex-col gap-[20px] ${
            isDarkMode ? "bg-[#f2f2f2]" : "bg-dark-200"
          }  py-[20px] px-[20px] rounded-[5px] transition-all duration-500 ${
            isVisible
              ? "translate-y-3 opacity-100"
              : "translate-y-[-20px] opacity-0"
          }`}
        >
          <div className="w-full flex pc:flex-row mb:flex-col items-center gap-[10px]">
            <div
              className={`pc:w-2/12 min-w-[230px] ${
                isDarkMode ? "bg-white text-black" : "bg-[#1f1f1f] text-white"
              }  mb:w-full h-[42px] flex shadow-sm rounded-[5px]`}
            >
              <select
                className={`w-full rounded-[5px] outline-none border-none ${
                  isDarkMode ? "text-black bg-white" : "bg-[#1f1f1f] text-white"
                } font-nunito text-[0.9rem] bg-transparent  `}
              >
                <option className="" value="">
                  Giá
                </option>
                <option value="">Tên</option>
              </select>
            </div>
            <div
              className={`w-full h-[42px] flex items-center gap-[5px] pl-[10px] pr-[3px] py-[2px] ${
                isDarkMode ? "bg-white" : "bg-[#1f1f1f]"
              } shadow-sm rounded-[5px]`}
            >
              <input
                ref={inputRef}
                className="w-full font-nunito font-light text-[0.9rem] outline-none bg-transparent"
                type="text"
                placeholder="Tìm kiếm sản phẩm"
              />
              <button className="w-[100px] h-[32px] flex items-center gap-[3px] outline-none justify-center text-white font-nunito font-medium cursor-pointer bg-[#797979] rounded-[5px]">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
          <div className="w-full  flex pc:flex-row mb:flex-col justify-between gap-[20px] text-black">
            <div
              className={`pc:w-[240px] mb:w-full min-w-[230px]  pc:min-h-[400px] mb:min-h-[200px] flex flex-col ${
                isDarkMode ? "bg-white" : "bg-[#1f1f1f] text-white"
              } rounded-[5px] px-[10px] py-[5px]`}
            >
              <h3 className="flex items-center font-nunito font-bold text-[0.9rem]  py-[5px] px-[10px] rounded-[5px]">
                <span>Danh mục sản phẩm</span>
              </h3>
              <ul className="flex flex-col max-h-[400px] gap-[2px] overflow-auto scrollbar-custom ">
                {categories ? (
                  categories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => handleShowSubCategory(cat)}
                      className={`w-full flex gap-[10px] py-[5px] px-[5px] cursor-pointer ${
                        isDarkMode ? "hover:bg-[#efefef]" : "hover:bg-[#2e2e2e]"
                      } rounded-[5px]`}
                    >
                      <i className="text-[0.5rem] fa-solid fa-angle-right mt-[6px]"></i>
                      <span className="font-nunito font-semibold text-[0.9rem]">
                        {cat.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li
                    className={`w-full flex items-center gap-[10px] py-[5px] px-[5px] cursor-pointer ${
                      isDarkMode ? "hover:bg-[#efefef]" : "hover:bg-[#2e2e2e]"
                    } rounded-[5px]`}
                  >
                    <i className="text-[0.5rem] fa-solid fa-angle-right"></i>
                    <span className="font-nunito font-semibold text-[0.9rem]">
                      Chưa có dữ liệu
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="pc:w-10/12 max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-custom mb:w-full flex ">
              <div className="w-full">
                <div className="w-full flex flex-wrap ml-[20px]">
                  {category && getSubByCategoryId(category.id).length > 0 ? (
                    getSubByCategoryId(category.id).map((sub) => (
                      <div
                        key={sub.id}
                        className={`flex pc:w-2/12 mb:6/12 min-w-[180px] h-[30px] items-center gap-[5px] ${
                          isDarkMode ? "text-[#343434]" : "text-white"
                        } cursor-pointer pr-[20px] mt-[14px]`}
                      >
                        <i className="text-[0.5rem] fa-solid fa-circle"></i>
                        <span className="font-nunito font-bold text-[0.9rem]">
                          {sub.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex ml-[20px] text-[0.9rem] font-nunito">
                      {category ? (
                        <div
                          className={`w-full flex   items-center gap-[10px] ${
                            isDarkMode ? "text-[#343434]" : "text-white"
                          } cursor-pointer pr-[20px] mt-[14px]`}
                        >
                          <i className="text-[0.5rem] fa-solid fa-circle"></i>
                          <span className="font-nunito font-bold text-[0.9rem]">
                            Chưa có phân loại
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`w-full flex   items-center gap-[10px] ${
                            isDarkMode ? "text-[#343434]" : "text-white"
                          } cursor-pointer pr-[20px] mt-[14px]`}
                        >
                          <i className="text-[0.5rem] fa-solid fa-circle"></i>
                          <span className="font-nunito font-bold text-[0.9rem]">
                            Chọn danh mục để xem phân loại
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
