import { Outlet } from "react-router-dom";
import HeaderTop from "../../../../components/header/HeaderTop";
import Header from "../../../../components/header/Header";
import SuggestionsSlide from "../../../../components/Header/SuggestionsSlide";
import ScrollButton from "../../../../components/features/ScrollButton";
import LayoutModeBackground from "../../layout/LayoutModeBackground";
import NavDashboard from "../../../../components/Nav/NavDashboard";
import Footer from "../../../../components/display/Footer";

const UserInfo = () => {
  return (
    <div className="w-full">
      <HeaderTop />
      <Header />
      <SuggestionsSlide />
      <LayoutModeBackground>
        <ScrollButton />
        <div className="w-full flex flex-col items-center pc:py-[30px] mb:py-[10px]  mb:px-[10px] height-screen-minus-header">
          <div className="pc:w-[90%] tl:w-full mb:w-full flex pc:flex-row flex-col gap-[20px] tl:p-[10px]">
            <div className="mb:w-full">
              <NavDashboard
                navList={navList}
                heightTop={240}
                basePath={"/userinfo"}
              />
            </div>

            <div className={`flex-1  mb:w-full flex flex-col gap-[10px]`}>
              <div
                className={`w-full flex items-center justify-between   rounded-[5px] `}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </LayoutModeBackground>
      <Footer />
    </div>
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
];
