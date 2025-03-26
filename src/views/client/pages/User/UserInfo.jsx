import { Outlet } from "react-router-dom";
import HeaderTop from "../../../../components/Header/HeaderTop";
import Header from "../../../../components/Header/Header";

import SuggestionsSlide from "../../../../components/header/SuggestionsSlide";
import ScrollButton from "../../../../components/features/ScrollButton";

import NavUserInfo from "../../../../components/User/NavUserInfo";
import LayoutModeBackground from "../../layout/LayoutModeBackground";
import NavDashboard from "../../../../components/Nav/NavDashboard";

const UserInfo = () => {
  return (
    <LayoutModeBackground>
      <HeaderTop />
      <Header />
      <SuggestionsSlide />
      <ScrollButton />
      <div className="w-full flex flex-col items-center pc:py-[30px] mb:py-[10px]  mb:px-[10px] height-screen-minus-header">
        <div className="pc:w-[90%] mb:w-full flex gap-[20px]">
          <div className="">
            <NavDashboard
              navList={navList}
              heightTop={240}
              basePath={"/userinfo"}
            />
          </div>

          <div
            className={`flex-1 min-w-[900px] mb:w-full flex flex-col gap-[10px]`}
          >
            <div
              className={`w-full flex items-center justify-between   rounded-[5px] `}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </LayoutModeBackground>
  );
};

export default UserInfo;
const navList = [
  {
    id: 1,
    menuId: "home",
    label: "Trang chủ",
    icon: "fa-solid fa-house",
    path: "/",
  },
  {
    id: 2,
    label: "Thông tin tài khoản",
    path: null,
    menuId: "userinfo",
    items: [
      { id: 1, label: "Hồ sơ", href: "account/profile" },
      { id: 2, label: "Địa chỉ", href: "account/address" },
      { id: 3, label: "Thanh toán", href: "account/payment" },
    ],
    icon: "fa-solid fa-user",
  },
  {
    id: 3,
    label: "Đơn hàng",
    path: "/userinfo/order",
    menuId: "order",
    items: [],
    icon: "fa-solid fa-clipboard-list",
  },
  {
    id: 4,
    label: "Voucher",
    path: "/userinfo/voucher",
    menuId: "voucher",
    items: [],
    icon: "fa-solid fa-ticket",
  },
];
