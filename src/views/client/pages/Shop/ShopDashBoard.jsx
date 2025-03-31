import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ExtentionsUser from "../../../../components/User/extentionsUser";
import NavDashboard from "../../../../components/Nav/NavDashboard";
import logo from "../../../../assets/images/logo_snapbuy.png";
import { Outlet } from "react-router-dom";
import LayoutModeBackground from "../../layout/LayoutModeBackground";
import { useTheme } from "../../../../Provider/ThemeProvider";
import ModeLayoutButton from "../../../../components/features/ModeLayoutButton";
import { useAuth } from "../../../../contexts/User/AuthContext";
import { useShop } from "../../../../contexts/User/ShopContext";

const ShopDashBoard = () => {
  const { isDarkMode } = useTheme();
  const {
    authState: { user },
  } = useAuth();

  const {
    shopState: { shopInfo },
  } = useShop();

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
    <LayoutModeBackground>
      <div className="w-full min-h-[100vh]  flex flex-col items-center ">
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
                Shop manager
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
                      {user.account}
                    </h3>
                  </div>
                  <div className="w-[42px] h-[42px] rounded-full ">
                    <img
                      className="w-full h-full rounded-full object-cover "
                      src={user.avatar_url}
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
        <div className="w-[98%] flex items-center  py-[20px]">
          <div className="w-full flex gap-[20px] ">
            <div className="w-[240px] ">
              <NavDashboard
                navList={navList}
                heightTop={110}
                basePath={"/shopdashboard"}
              />
            </div>
            <div className="flex-1 min-w-9/12 overflow-hidden ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </LayoutModeBackground>
  );
};

export default ShopDashBoard;
const navList = [
  {
    id: 1,
    menuId: "dashboard",
    label: "Trang chủ",
    icon: "fa-solid fa-chart-line",
    path: "/shopdashboard",
  },
  {
    id: 2,
    menuId: "products",
    label: "Sản phẩm",
    icon: "fa-solid fa-boxes-stacked",
    path: null,
    items: [
      {
        id: "1",
        label: "Tất cả sản phẩm",
        href: "products/list/all",
      },
      {
        id: "2",
        label: "Thêm sản phẩm",
        href: "products/addproduct",
      },
      {
        id: "3",
        label: "Sản phẩm vi phạm",
        href: "products/violation",
      },
    ],
  },
  {
    id: 3,
    menuId: "orders",
    label: "Đơn hàng",
    icon: "fa-solid fa-receipt",
    path: null,
    items: [
      {
        id: "1",
        label: "Tất cả đơn hàng",
        href: "orders",
      },
      {
        id: "2",
        label: "Đơn hàng chờ xử lý",
        href: "orders/pending",
      },
    ],
  },
  {
    id: 4,
    menuId: "settings",
    label: "Cài đặt",
    icon: "fa-solid fa-gear",
    path: "/settings",
  },
];

const extentionsList = [
  {
    id: 1,
    title: "Thông tin của tôi",
    path: "/userinfo/account/profile",
  },
];
