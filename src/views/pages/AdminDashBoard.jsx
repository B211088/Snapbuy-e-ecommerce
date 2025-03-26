import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../component/Header/Header";
import NavDashboard from "../../component/Nav/NavDashBoard";
import LayoutModeBackground from "../../component/Layout/LayoutModeBackGround";
import { useCategories } from "../../contexts/CategoriesContext";

const AdminDashBoard = () => {
  const {
    authState: { user },
  } = useAuth();

  const {
    categoriesState: { categories },
  } = useCategories();

  return (
    <LayoutModeBackground>
      <div className="w-full min-h-[100vh] flex flex-col items-center ">
        <Header />
        <div className="w-[98%] flex flex-col items-center mt-[20px] ">
          <div className=" w-full flex  gap-[20px] ">
            <div className="w-3/12 max-w-[280px] min-w-[260px]">
              <NavDashboard navList={navList} heightTop={110} />
            </div>
            <div className="flex-1 flex ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </LayoutModeBackground>
  );
};

export default AdminDashBoard;

const navList = [
  {
    id: 2,
    label: "Quản lý người dùng",
    menuId: "user",
    items: [
      { id: 1, label: "Người dùng", href: "/usersmanagement" },
      { id: 2, label: "Người bán", href: "/sellersmanagement" },
    ],
    icon: "fa-solid fa-user",
  },
  {
    id: 3,
    label: "Quản lý sản phẩm",
    menuId: "products",
    items: [
      { id: 1, label: "Nghành hàng", href: "/categoriesmanagement" },
      { id: 2, label: "Sản phẩm", href: "/produtsmanagement" },
    ],
    icon: "fa-solid fa-clipboard-list",
  },
];
