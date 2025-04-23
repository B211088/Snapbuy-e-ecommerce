import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../component/Header/Header";
import NavDashboard from "../../component/Nav/NavDashBoard";
import LayoutModeBackground from "../../component/Layout/LayoutModeBackground";

const AdminDashBoard = () => {
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
    items: [{ id: 1, label: "Người dùng", href: "/usersmanagement" }],
    icon: "fa-solid fa-user",
  },
  {
    id: 3,
    label: "Quản lý sản phẩm",
    menuId: "products",
    items: [
      { id: 1, label: "Nghành hàng", href: "/industrysmanagement/categories" },
      { id: 2, label: "Sản phẩm", href: "/produtsmanagement" },
    ],
    icon: "fa-solid fa-clipboard-list",
  },
  {
    id: 4,
    label: "Quản lý tài chính",
    menuId: "finance",
    items: [
      {
        id: 1,
        label: "Thống kê tài chính",
        href: "/financemanagement/sellers",
      },
    ],
    icon: "fa-solid fa-coins",
  },
  {
    id: 5,
    label: "Quản lý tài chính",
    menuId: "finance",
    path: "/shippingmanagement",
    items: [],
    icon: "fa-solid fa-coins",
  },
];
