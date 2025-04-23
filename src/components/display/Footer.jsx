import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Provider/ThemeProvider";
import logo from "../../assets/images/logo_snapbuy.png";

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <footer
      className={`w-full flex flex-col justify-center items-center font-nunito ${
        isDarkMode ? "bg-white text-black" : "bg-dark-200 text-white"
      }`}
    >
      <div className="pc:w-[90%] tl:w-full mb:w-full flex pc:flex-row tl:flex-row mb:flex-col gap-[20px] py-[20px] justify-between tl:px-[10px] mb:px-[10px]">
        {/* Logo + mô tả */}
        <div className="pc:w-4/12 tl:w-4/12 mb:w-full flex flex-col mb:items-center">
          <Link
            to="#"
            className="flex items-center gap-[5px] mb:justify-center"
          >
            <img className="w-[40px] object-contain" src={logo} alt="" />
            <div className="font-jersey15 font-black text-[2rem] mt-[10px]">
              <span className="text-primary">SNAP</span>
              <span>BUY</span>
            </div>
          </Link>
          <p
            className={`text-[0.9rem] py-[5px] pc:text-left tl:text-left mb:text-center ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            Nền tảng thương mại điện tử kết nối người mua và người bán một cách
            dễ dàng, nhanh chóng và an toàn.
          </p>{" "}
          <ul className="text-sm space-y-2 mt-[10px] mb:text-center">
            <li>
              Email:{" "}
              <a
                href="mailto:support@snapbuy.vn"
                className="hover:text-yellow-400"
              >
                support@snapbuy.vn
              </a>
            </li>
            <li>
              Hotline:{" "}
              <a href="tel:0123456789" className="hover:text-yellow-400">
                0123 456 789
              </a>
            </li>
            <li>Địa chỉ: 123 Nguyễn Văn Cừ, Cần Thơ</li>
          </ul>
        </div>

        {/* Liên kết nhanh */}
        <div className="pc:w-4/12 tl:w-4/12 mb:w-full flex flex-col mt-[20px] mb:items-center">
          <h3 className="text-[1.2rem] font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm mb:text-center">
            <li>
              <Link to="/" className="hover:text-yellow-400">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-yellow-400">
                Cửa hàng
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-yellow-400">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yellow-400">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div className="pc:w-4/12 tl:w-4/12 mb:w-full flex flex-col mt-[20px] mb:items-center">
          <h3 className="text-[1.2rem] font-semibold mb-3">
            Theo dõi SnapBuy trên
          </h3>
          <div className="flex items-center gap-4 mb:justify-center">
            <a
              href="https://www.facebook.com/snapbuy.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[35px] h-[35px] rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80"
            >
              <i className="fa-brands fa-square-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/snapbuy.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[35px] h-[35px] rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-white hover:opacity-80"
            >
              <i className="fa-brands fa-square-instagram"></i>
            </a>
            <a
              href="https://www.tiktok.com/@snapbuy.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[35px] h-[35px] rounded-full bg-black flex items-center justify-center text-white hover:opacity-80"
            >
              <div className="">
                <i className="fa-brands fa-tiktok"></i>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Copy right */}
      <div
        className={`w-full flex items-center justify-center py-[8px] text-center text-sm border-t-[1px] font-bold pc:text-base tl:text-sm mb:text-xs ${
          isDarkMode
            ? "bg-light-100 text-dark-100 border-t-dark-700"
            : "bg-dark-100 text-light-100 border-t-dark-700"
        }`}
      >
        <span className="pc:px-0 tl:px-[10px] mb:px-[10px]">
          © {new Date().getFullYear()} SnapBuy. Bảng quyền thuộc về Trương Chí
          Nguyên và Kim Ngọc Tân.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
