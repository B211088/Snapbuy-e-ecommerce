import React, { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/images/logo_snapbuy.png";
import ModeLayoutButton from "../Button/ModeLayoutButton";
import { AnimatePresence } from "framer-motion";
import ExtentionsUser from "../User/ExtentionsUser";
const Header = () => {
  const extentionsList = [
    { title: "Tài khoản của tôi", path: "/userinfo/account/profile" },
  ];
  const { isDarkMode } = useTheme();
  const {
    authState: { user },
  } = useAuth();

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
    <div
      className={`w-full flex sticky top-0 items-center justify-center  ${
        isDarkMode
          ? "bg-light-100 border-b-[1px] border-dashed  border-light-200"
          : "bg-dark-200 text-light-100"
      }`}
    >
      <div className="w-[98%] h-[60px] flex justify-between items-center ">
        <div className=" flex items-center gap-[10px] mb-[5px]">
          <div className="flex items-center gap-[5px] ">
            <img
              className="w-[30px] object-contain"
              src={logo}
              alt="logo_snapbuy"
            />
            <div className="font-jersey15 font-black text-[1.5rem] mt-[10px]">
              <span className="text-primary">SNAP</span>
              <span>BUY</span>
            </div>
          </div>
          <div className="font-nunito font-semibold text-[1.1rem] mt-[10px] mb:hidden">
            Admin manager
          </div>
        </div>
        <div className="w-3/12 flex items-center justify-end gap-[20px]">
          <div className="">
            <ModeLayoutButton />
          </div>{" "}
          <div
            className={` flex items-center justify-between  pl-[10px] pr-[5px] py-[8px] gap-[10px] rounded-[5px] cursor-pointer ${
              isDarkMode
                ? "bg-light-100 text-dark-100"
                : "bg-dark-200 text-light-100"
            }`}
          >
            <div
              className="flex items-center gap-[10px] relative"
              onClick={handleChangStatusModalExtention}
            >
              {" "}
              <div className="flex flex-col ">
                <h3 className="font-bold text-[0.9rem] font-nunito truncate">
                  {user.fullname}
                </h3>
                <p className="font-nunito text-[0.8rem] truncate">
                  Quản trị viên cấp 1
                </p>
              </div>
              <div className="w-[42px] h-[42px] rounded-full ">
                <img
                  className="w-full h-full rounded-full object-cover "
                  src={user.avatar}
                  alt="avatar"
                />
              </div>{" "}
              {statusModal && (
                <AnimatePresence>
                  <ExtentionsUser extentionsList={extentionsList} />
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
