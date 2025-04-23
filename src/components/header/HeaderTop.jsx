import { useState } from "react";
import User from "./User";
import Navbar from "./Navbar";
import ModeLayoutButton from "../features/ModeLayoutButton";
import { useTheme } from "../../Provider/ThemeProvider";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo_snapbuy.png";
import Nav from "./Nav";

const HeaderTop = () => {
  const { isDarkMode } = useTheme();
  const [toggleShowNav, setToggleShowNav] = useState(false);

  const handleopenShowNav = () => {
    setToggleShowNav(true);
  };
  const handlecloseShowNav = () => {
    setToggleShowNav(false);
  };

  const navItems = [
    { label: "Kênh người bán", href: "/shopdashboard" },
    { label: "Dịch vụ vận chuyển", href: "#" },
    { label: "Điều khoản dịch vụ", href: "#" },
  ];
  return (
    <div
      className={`w-full flex   items-center justify-center py-[5px] ${
        isDarkMode
          ? "bg-white text-black  border-b-[1px] border-dashed border-border-light"
          : "bg-dark-200 text-white  border-b-[1px] border-dashed border-border-dark "
      }`}
    >
      <div className="w-full px-[10px] hidden mb:flex items-center justify-between text-[1.3rem] ">
        <Link to="/" className=" flex items-center gap-[5px]" href="/">
          <img className="w-[26px] object-contain" src={logo} alt="" />
          <div className="font-jersey15 font-black text-[1.5rem] mt-[5px]">
            <span className="text-primary">SNAP</span>
            <span>BUY</span>
          </div>
        </Link>
        <div className="flex items-center gap-[10px]">
          <ModeLayoutButton />
          <div
            className="flex items-center justify-center px-[8px] py-[6px] rounded-[5px] border-[1px] cursor-pointer"
            onClick={handleopenShowNav}
          >
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </div>
      <div
        className={`pc:w-[90%] tl:w-full flex mb:hidden items-center  w-full tl:px-[10px]  z-30  `}
      >
        <div className=" flex w-full  flex-row  justify-between  z-50  mb:border-l-[1px] mb:border-[#ccc]">
          <ul className=" w-full flex flex-row  items-center   gap-[20px] tl:gap-[10px] mb:gap-[10px] font-nunito  text-[0.85rem] ">
            <li className=" group relative  mb:w-full mb:px-[10px] mb:py-[5px]  ">
              <a
                to="salesregistation"
                className="hover:text-primary transition-all duration-300"
                href=""
              >
                Mở gian hàng chủa bạn
              </a>
              <Navbar items={navItems} />
            </li>
            <li className=" group relative  mb:w-full mb:px-[10px] mb:py-[5px] transition-all duration-300">
              <a className="hover:text-primary" href="">
                Trung tâm trợ giúp
              </a>
              <Navbar items={navItems} />
            </li>
            <li className="group relative  mb:w-full mb:px-[10px] mb:py-[5px] text-blac transition-all duration-300">
              <a className="hover:text-primary" href="">
                Điều khoản dịch vụ
              </a>
              <Navbar items={navItems} />
            </li>
          </ul>
          <div className=" mb:w-full flex mb:flex-col-reverse mb:items-start   items-center justify-end gap-[10px]">
            <div className="mb:hidden">
              <ModeLayoutButton />
            </div>
            <div className="mb:py-[10px]">
              <User />
            </div>
          </div>
        </div>
      </div>
      {toggleShowNav && <Nav closeNav={handlecloseShowNav} />}
    </div>
  );
};

export default HeaderTop;
