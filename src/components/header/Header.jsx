import React, { useState } from "react";
import logo from "../../assets/images/logo_snapbuy.png";
import Search from "../Searchs/Search";
import Nav from "./Nav";
import CartButton from "./CartButton";
import SearchModal from "../Searchs/SearchModal";
import { useTheme } from "../../Provider/ThemeProvider";
import { Link } from "react-router-dom";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchModal, setSearchModal] = useState(false);

  const handleChangeStatusSearchModal = () => {
    setSearchModal(!searchModal);
  };

  const onCloseSearchModal = () => {
    handleChangeStatusSearchModal();
  };

  return (
    <div
      className={` w-full flex justify-center ${
        isDarkMode
          ? "bg-white text-black  border-b-[1px] border-dashed border-border-light"
          : "bg-dark-200 text-white  border-b-[1px] border-dashed border-border-dark "
      }`}
    >
      <div className="pc:w-[90%] tl:w-full mb:w-full h-[90px] flex items-center gap-[20px] justify-between tl:px-[10px] mb:px-[10px]">
        <Link to="/" className=" flex items-center gap-[5px] mb:hidden">
          <img className="w-[40px] object-contain" src={logo} alt="" />
          <div className="font-jersey15 font-black text-[2rem] mt-[10px]">
            <span className="text-primary">SNAP</span>
            <span>BUY</span>
          </div>
        </Link>

        <Nav />
        <div className="pc:w-6/12 tl:w-7/12 mb:w-full  flex items-center justify-end  pc:gap-[20px] tl:gap-[10px] mb:gap-[10px]">
          <Search
            handleChangeStatusSearchModal={handleChangeStatusSearchModal}
          />
          {searchModal && (
            <SearchModal onCloseSearchModal={onCloseSearchModal} />
          )}
          <CartButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
