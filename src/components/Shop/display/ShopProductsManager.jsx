import React from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { NavLink, Outlet } from "react-router-dom";

const ShopProductsManager = () => {
  const { isDarkMode } = useTheme();
  return (
    <OutLetContainer>
      <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
        <div className="flex items-center  font-nunito gap-[10px] pb-[10px]">
          <div
            className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-bold text-[1.2rem]">Kho sản phẩm</h1>
            <p
              className={`font-normal text-[0.95rem] ${
                isDarkMode ? " text-dark-300" : "text-light-300"
              }`}
            >
              Quản lý kho sản phẩm của bạn
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col  py-[10px] ">
          <div className="w-full flex items-center gap-[10px] text-[0.9rem] font-nunito font-bold overflow-x-auto">
            {[
              { to: "list/all", label: "Tất cả" },
              { to: "list/live", label: "Đang bán" },
              { to: "list/unpublic", label: "Chưa đăng bán" },
              { to: "list/reviewing", label: "Chờ duyệt" },
            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `w-2/12 flex items-center justify-center px-[20px] py-[4px] border-[1px] rounded-[5px] cursor-pointer hover:text-red-500 hover:border-red-500 ${
                    isActive
                      ? "border-red-500 text-red-500 "
                      : isDarkMode
                      ? "border-dark-200 text-dark-300"
                      : "border-light-200 text-light-300"
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </OutLetContainer>
  );
};

export default ShopProductsManager;
