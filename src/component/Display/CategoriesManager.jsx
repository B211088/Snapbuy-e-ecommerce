import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ContainerModeLayer1 from "../Container/ContainerModeLayer1";

import { useTheme } from "../../Provider/ThemeProvider";
import { useCategories } from "../../contexts/CategoriesContext";
import { useConfirm } from "../Notify/ConfirmModal";
import { useNotify } from "../Notify/NotifyModal";
import AddSubCategory from "../Modal/AddSubCategory";
import UpdateSubCategory from "../Modal/UpdateSubCategory";
import UpdateCategory from "../Modal/UpdateCategory";
import AddCategory from "../Modal/AddCategory";

const CategoriesManager = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning } = useNotify();
  const { confirm, ConfirmComponent } = useConfirm();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    categoriesState: { categories, subcategories },
    removeCategory,

    getSubCategories,
    removeSubCategory,
  } = useCategories();

  console.log("categories", categories);
  const [openId, setOpenId] = useState(null);
  const [categoryId, setCategoryId] = useState();
  const [subCategories, setSubCategories] = useState({});
  const [subCategoriesRemove, setSubCategoriesRemove] = useState({});
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);
  const [showModalUpdateCategory, setShowModalUpdateCategory] = useState(false);
  const [showModalUpdateSubCategory, setShowModalUpdateSubCategory] =
    useState(false);
  const [showModalAddSubCategory, setShowModalAddSubCategory] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [subCategoryData, setSubCategoryData] = useState({});

  console.log(subCategories);

  const getSubByCategoryId = (categoryId) => {
    return (
      subcategories.find((cat) => cat.categoryId === categoryId)?.data || []
    );
  };

  const toggleDropdown = async (id) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }

    setOpenId(id);

    if (!subCategories[id]) {
      try {
        const response = await getSubCategories(id);
        if (response.success) {
          setSubCategories((prev) => ({
            ...prev,
            [id]: response.data,
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục con:", error);
      }
    }
  };

  const openModalUpdateCategory = (categoryData) => {
    setShowModalUpdateCategory(true);
    setCategoryData(categoryData);
    navigate(`?popup=updatecategorylv1?${categoryData.id}`, { replace: true });
  };

  const openModalUpdateSubCategory = (subCategoryData) => {
    setShowModalUpdateSubCategory(true);
    setSubCategoryData(subCategoryData);
    navigate(`?popup=updatesubcategory${subCategoryData.id}`, {
      replace: true,
    });
  };

  const closeModalUpdateSubCategory = () => {
    setShowModalUpdateSubCategory(false);
    navigate(location.pathname, { replace: true });
  };
  const closeModalUpdateCategory = () => {
    setShowModalUpdateCategory(false);
    navigate(location.pathname, { replace: true });
  };

  const openModalAddCategory = () => {
    setShowModalAddCategory(true);
    navigate(`?popup=addcategorylv1`);
  };
  const openModalAddSubCategory = (id) => {
    setShowModalAddSubCategory(true);
    setCategoryId(id);
    navigate(`?popup=addsubcategory`);
  };

  const closeModalAddCategory = () => {
    setShowModalAddCategory(false);
    navigate(location.pathname, { replace: true });
  };
  const closeModalAddSubCategory = () => {
    setShowModalAddSubCategory(false);
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("popup") === "updatecategorylv1") {
      setShowModalUpdateCategory(true);
    }
    if (searchParams.get("popup") === "addcategorylv1") {
      setShowModalAddCategory(true);
    }
    if (searchParams.get("popup") === "addsubcategory") {
      setShowModalAddSubCategory(true);
    }
    if (searchParams.get("popup") === "updatesubcategory") {
      setShowModalAddCategory(true);
    }
  }, [location.search]);

  const handleRemoveCategory = (categoryId) => {
    confirm({
      message: "Bạn có chắc chắn muốn danh mục này không?",
      onConfirm: async () => {
        try {
          const response = await removeCategory(categoryId);
          if (response.success) {
            notifySuccess("Xóa danh mục thành công", 3000);
          } else {
            notifyWarning("Xóa danh mục thất bại", 3000);
          }
        } catch (error) {
          console.log("Lỗi xóa danh mục", error);
          notifyWarning("Đã xảy ra lỗi khi xóa danh mục", 3000);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleRemoveSubCategory = async (subCategoryId, categoryId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này không?"
    );
    if (!isConfirmed) return;

    try {
      const response = await removeSubCategory(subCategoryId, categoryId);
      if (response.success) {
        notifySuccess(response.message, 3000);
      } else {
        notifyWarning("Xóa danh mục con thất bại", 3000);
      }
    } catch (error) {
      notifyWarning("Đã xảy ra lỗi khi xóa danh mục con", 3000);
    }
  };

  const handleSuccess = (message) => {
    notifySuccess(message);
  };

  return (
    <ContainerModeLayer1>
      <ConfirmComponent />
      <div className="w-full flex flex-col container-mode-layer1 ">
        <div className="w-full flex items-center justify-between px-[20px] py-[10px] font-nunito border-b-[1px]  border-dashed">
          <div className="">
            <h1 className=" font-bold text-[1.3rem]">
              Quản lý danh mục nghành hàng
            </h1>
          </div>
          <div
            className="px-[20px] py-[5px] bg-primary flex justify-center items-center rounded-[5px] text-light-100 cursor-pointer "
            onClick={openModalAddCategory}
          >
            <span>Thêm loại</span>
          </div>
        </div>
        <div
          className={`w-full flex items-center gap-[10px] px-[20px] py-[5px] font-nunito shadow-sm `}
        >
          {" "}
          <div className="w-[32px] h-[32px] flex items-center justify-center rounded-[5px] border-[1px] text-[0.8rem] font-bold opacity-0">
            <span>STT</span>
          </div>
          <div className="w-3/12 text-[0.9rem] font-bold">Tên nghành hàng</div>
          <div className="w-9/12 text-[0.9rem] ml-[-50px] font-bold">Mô tả</div>
        </div>
        <div className="w-full flex flex-col gap-[10px] px-[10px] py-[20px] scrollbar-custom overflow-y-auto overflow-x-hidden">
          {categories ? (
            categories
              .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
              .map((item, index) => (
                <div
                  key={item.id}
                  className={`w-full flex flex-col  gap-[10px] px-[10px] py-[10px]  rounded-[5px] font-nunito  ${
                    isDarkMode ? "border-[1px] " : "bg-dark-400 "
                  }`}
                >
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[32px] min-w-[32px] h-[32px] flex items-center justify-center rounded-[5px] border-[1px] font-bold">
                      <span>{index + 1}</span>
                    </div>
                    <div className="w-3/12 text-[0.9rem]">{item.name}</div>
                    <div className="w-9/12 text-[0.9rem]">
                      {item.description}
                    </div>
                    <div className="flex items-center justify-end gap-[10px]">
                      <div
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[5px] border-[1px]  cursor-pointer relative group "
                        onClick={() => openModalAddSubCategory(item.id)}
                      >
                        <i className="fa-solid fa-plus"></i>
                        <div className="hidden  absolute top-[110%] left-[-120%] bg-[#08080861] group-hover:flex items-center justify-center px-[5px] py-[2px] truncate text-light-100 rounded-[5px]">
                          <span> Thêm phân loại</span>
                        </div>
                      </div>
                      <div
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[5px] border-[1px]  cursor-pointer relative group"
                        onClick={() => openModalUpdateCategory(item)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <div className="hidden  absolute top-[110%] left-[-120%] bg-[#08080861] group-hover:flex items-center justify-center px-[5px] py-[2px] truncate text-light-100 rounded-[5px]">
                          <span> Cập nhật nghành hàng</span>
                        </div>
                      </div>
                      <div
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[5px] border-[1px]  cursor-pointer relative group"
                        onClick={() => handleRemoveCategory(item.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                        <div className="hidden  absolute top-[110%] left-[-120%] bg-[#08080861] group-hover:flex items-center justify-center px-[5px] py-[2px] truncate text-light-100 rounded-[5px]">
                          <span> Xóa nghành hàng</span>
                        </div>
                      </div>{" "}
                      <div
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[5px] border-[1px]  cursor-pointer relative group "
                        onClick={() => toggleDropdown(item.id)}
                      >
                        <i
                          className="fa-solid fa-caret-down transition-all duration-300"
                          style={{
                            transform:
                              openId === item.id
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        ></i>{" "}
                        <div className="hidden  absolute top-[110%] left-[-120%] bg-[#08080861] group-hover:flex items-center justify-center px-[5px] py-[2px] truncate text-light-100 rounded-[5px]">
                          <span>Mở rộng</span>
                        </div>
                        {showModalAddSubCategory && (
                          <AddSubCategory
                            onSuccess={handleSuccess}
                            categoryId={categoryId}
                            onCloseModalAddSubCategory={
                              closeModalAddSubCategory
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openId === item.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                        className="w-full max-h-[240px] flex flex-col gap-2 pl-[40px] mt-2 overflow-y-auto overflow-x-hidden scrollbar-custom-none "
                      >
                        {" "}
                        <div
                          className={`w-full flex items-center justify-between px-[10px] py-[8px]  sticky top-0  ${
                            isDarkMode ? "bg-light-100" : "  bg-dark-400"
                          } `}
                        >
                          <div className="w-full flex items-center">
                            {" "}
                            <div className="w-3/12 text-[0.85rem] font-bold">
                              Tên phân loại
                            </div>
                            <div className="w-9/12 text-[0.85rem] font-bold ml-[-15px]">
                              Mô tả phân loại
                            </div>
                          </div>

                          {showModalUpdateSubCategory && (
                            <UpdateSubCategory
                              onSuccess={handleSuccess}
                              categoryId={item.id}
                              subCategoryData={subCategoryData}
                              onCloseModalUpdateSubCategory={
                                closeModalUpdateSubCategory
                              }
                            />
                          )}
                        </div>
                        {getSubByCategoryId(item.id).length > 0 ? (
                          getSubByCategoryId(item.id).map((sub, index) => (
                            <div
                              key={`${sub.id}-${index}`}
                              className={`w-full flex items-center justify-between px-[10px] py-[8px] rounded-[5px]  ${
                                isDarkMode ? "border-[1px]" : "bg-dark-300  "
                              } `}
                            >
                              <div className="w-full flex items-center">
                                {" "}
                                <div className="w-3/12 text-[0.85rem]">
                                  {sub.name}
                                </div>
                                <div className="w-9/12 text-[0.85rem]">
                                  {sub.description}
                                </div>
                              </div>
                              <div className="flex items-center gap-[5px]">
                                <div
                                  className="w-[22px] h-[22px] flex items-center justify-center rounded-[5px] border-[1px] text-[0.8rem] cursor-pointer"
                                  onClick={() =>
                                    openModalUpdateSubCategory(sub)
                                  }
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </div>
                                <div
                                  className="w-[22px] h-[22px]  flex items-center justify-center rounded-[5px] border-[1px] text-[0.8rem] cursor-pointer"
                                  onClick={() =>
                                    handleRemoveSubCategory(sub.id, item.id)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </div>
                              </div>

                              {showModalUpdateSubCategory && (
                                <UpdateSubCategory
                                  onSuccess={handleSuccess}
                                  categoryId={item.id}
                                  subCategoryData={subCategoryData}
                                  onCloseModalUpdateSubCategory={
                                    closeModalUpdateSubCategory
                                  }
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm italic">
                            Chưa có danh mục con
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
          ) : (
            <div className="">Chưa có dữ liệu</div>
          )}
        </div>
      </div>{" "}
      {showModalUpdateCategory && (
        <UpdateCategory
          onSuccess={handleSuccess}
          categoryData={categoryData}
          onCloseModalUpdateCategory={closeModalUpdateCategory}
        />
      )}
      {showModalAddCategory && (
        <AddCategory
          onSuccess={handleSuccess}
          onCloseModalAddCategory={closeModalAddCategory}
        />
      )}
    </ContainerModeLayer1>
  );
};

export default CategoriesManager;
