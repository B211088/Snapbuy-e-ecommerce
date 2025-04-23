import React from "react";
import User from "./User";
import { useTheme } from "../../Provider/ThemeProvider";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/User/AuthContext";

const Nav = ({ closeNav }) => {
  const { isDarkMode } = useTheme();
  const {
    authState: { isAuthenticated, user, roles },
  } = useAuth();
  return (
    <div
      className="w-full h-[100vh] fixed top-0 bottom-0 left-0 right-0 flex  bg-[#1c1c1c44] z-50"
      onClick={closeNav}
    >
      <ul
        className={`pr-[20px]  h-full flex flex-col  font-nunito  ${
          isDarkMode ? "bg-light-100" : "bg-dark-300"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-[10px]">
          {isAuthenticated ? (
            <div className="flex  items-center justify-end gap-[5px] cursor-pointer relative user-menu">
              <div className="w-[32px] h-[32px] flex">
                <img
                  className="w-full h-full aspect-square rounded-full object-cover cursor-pointer"
                  src={
                    user.avatar !== "user.png"
                      ? user.avatar_url
                      : " https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  }
                  alt="Ảnh đại diện của người dùng"
                />
              </div>
              <div className="font-nunito font-semibold text-[0.9rem]">
                <span>{user.account}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-[0.9rem]">
              <div className="flex items-center pc:justify-end mb:justify-start mb:border-b-[1px] z-10">
                <Link
                  to={`/register`}
                  className="mb:w-full h-[42px] flex items-center pc:justify-end mb:justify-center pl-[20px] font-nunito font-medium cursor-pointer"
                >
                  Đăng ký
                </Link>
                <Link
                  to={`/login`}
                  className="mb:w-full h-[42px] flex items-center pc:justify-end mb:justify-center pl-[20px] font-nunito font-bold text-primary cursor-pointer"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>
        <ul className="w-full flex flex-col font-nunito px-[10px] text-[0.9rem]">
          <li className="w-full py-[10px]">
            <Link to="/userinfo/account/profile">Thông tin tài khoản</Link>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default Nav;
