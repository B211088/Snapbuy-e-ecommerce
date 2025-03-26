import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../Provider/ThemeProvider";
import { AuthContext, useAuth } from "../../contexts/User/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const NavUserInfo = () => {
  const { isDarkMode } = useTheme();
  const {
    authState: { user },
  } = useAuth();

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getNavItemClass = (path) =>
    location.pathname === path ? "text-red-500 font-bold" : "";
  return (
    <div
      className={`w-3/12 max-w-[340px] flex flex-col gap-[10px] sticky mb:hidden`}
    >
      <div
        className={`w-full flex items-center justify-between px-[10px] py-[10px]  ${
          isDarkMode ? "bg-white" : "bg-dark-200 text-white"
        } rounded-[5px] `}
      >
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] flex flex-col justify-center items-center">
            <img
              className="w-full h-full  rounded-full object-cover cursor-pointer"
              src={
                user.avatar !== "user.png"
                  ? user.avatar_url
                  : " https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
              }
              alt="Ảnh đại diện của người dùng"
            />
          </div>

          <div className="flex flex-col  py-[5px] ">
            <div className="truncate font-nunito font-bold text-[1rem]  z-10">
              <span>{user?.account || "Người dùng"}</span>
            </div>
          </div>
        </div>
        <Link
          to="./account/profile?popup=updateuserinfo"
          className="px-[6px] py-[2px]  rounded-[5px] cursor-pointer text-[1.2rem] "
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </Link>
      </div>
      <div
        className={`w-full flex  rounded-[5px]  ${
          isDarkMode ? "bg-white" : "bg-dark-200 text-white"
        } rounded-[5px] `}
      >
        <ul className="w-full flex flex-col rounded-[5px]">
          <li className="rounded-[5px] px-[5px] py-[5px]">
            <div
              className={`flex items-center justify-between cursor-pointer `}
              onClick={toggleDropdown}
            >
              <div className="w-full flex items-center gap-[5px]">
                <div className="w-[40px] h-[40px] flex items-center justify-center text-[1.1rem]">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className={`font-nunito text-[0.9rem] `}>
                  Tài khoản của tôi
                </span>
              </div>

              <div
                className="text-[0.8rem] w-[30px] h-[30px] flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="ml-[40px] flex flex-col overflow-hidden"
                >
                  <li className="rounded-[5px] px-[10px] py-[5px] ">
                    <Link to="./account/profile">
                      <span
                        className={`font-nunito text-[0.9rem] ${getNavItemClass(
                          "/userinfo/account/profile"
                        )}`}
                      >
                        Hồ sơ
                      </span>
                    </Link>
                  </li>
                  <li className="rounded-[5px] px-[10px] py-[5px] ">
                    <Link to="./account/payment">
                      <span
                        className={`font-nunito text-[0.9rem] ${getNavItemClass(
                          "/userinfo/account/payment"
                        )}`}
                      >
                        Ngân hàng
                      </span>
                    </Link>
                  </li>
                  <li className="rounded-[5px] px-[10px] py-[5px] ">
                    <Link to="./account/address">
                      <span
                        className={`font-nunito text-[0.9rem] ${getNavItemClass(
                          "/userinfo/account/address"
                        )}`}
                      >
                        Địa chỉ
                      </span>
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
          <li className=" rounded-[5px] px-[5px] py-[5px] ">
            <Link to="./order" className="flex items-center gap-[5px]">
              {" "}
              <div className="w-[40px] h-[40px] flex items-center justify-center text-[1.1rem]">
                <i className="fa-solid fa-table-list"></i>
              </div>
              <span
                className={`font-nunito text-[0.9rem] ${getNavItemClass(
                  "/userinfo/order"
                )}`}
              >
                Đơn hàng{" "}
              </span>
            </Link>
          </li>
          <li className=" rounded-[5px] px-[5px] py-[5px]">
            <Link to="./voucher" className="flex items-center gap-[5px]">
              {" "}
              <div className="w-[40px] h-[40px] flex items-center justify-center text-[1.1rem]">
                <i className="fa-solid fa-ticket"></i>
              </div>
              <span
                className={`font-nunito text-[0.9rem] ${getNavItemClass(
                  "/userinfo/voucher"
                )}`}
              >
                Voucher
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavUserInfo;
