import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avt from "../../assets/images/sanpham3.jpg";

import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ExtentionsUser from "../User/extentionsUser";

const User = () => {
  const { isDarkMode } = useTheme();
  const {
    authState: { isAuthenticated, user, roles },
  } = useAuth();

  const extentionsList = [
    { title: "Tài khoản của tôi", path: "/userinfo/account/profile" },
    { title: "Đơn hàng", path: "/userinfo/order" },
    { title: "Địa chỉ", path: "/userinfo/account/address" },
  ];

  const [statusModal, setStatusModal] = useState(false);

  const handleChangStatusModalExtention = (event) => {
    event.stopPropagation();
    setStatusModal((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".user-menu")) {
      setStatusModal(false);
    }
  };

  useEffect(() => {
    if (statusModal) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [statusModal]);

  return (
    <div className="pc:ml-[20px] mb:px-[10px]">
      {isAuthenticated ? (
        <div
          className="flex  items-center justify-end gap-[5px] cursor-pointer relative user-menu"
          onClick={handleChangStatusModalExtention}
        >
          <div className="font-nunito font-semibold text-[0.9rem]">
            <span>{user.account}</span>
          </div>
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
          {statusModal && (
            <AnimatePresence>
              <ExtentionsUser extentionsList={extentionsList} />
            </AnimatePresence>
          )}
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
  );
};

export default User;
