import React from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import logoSnapbuy from "../../assets/images/logo_snapbuy.png";
import ModeLayoutButton from "../Button/ModeLayoutButton";
import { Link } from "react-router-dom";
import User from "../User/User";

const HeaderFlexibleView = ({ title }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`w-full  flex justify-center ${
        isDarkMode
          ? "bg-dark-1000 text-dark-100 border-b-[1px]  border-dark-900  shadow-sm"
          : "bg-dark-200  text-light-100 border-b-[1px]  border-dark-400  shadow-sm"
      } `}
    >
      <div className="w-[90%] h-[60px] flex items-center justify-between  ">
        <div className="x flex items-center gap-[20px] mb-[5px]">
          <Link to="/home" className="flex items-center gap-[10px]">
            <img
              className="w-[32px] object-contain"
              src={logoSnapbuy}
              alt="logo snapbuy"
            />

            <div className="font-jersey15 font-black text-[1.5rem] mt-[10px]">
              <span className="text-primary">SNAP</span>
              <span>BUY</span>
            </div>
          </Link>
          <div className="font-nunito font-semibold text-[1.1rem] mt-[12px] ">
            <span>{title}</span>
          </div>
        </div>
        <div className=" flex items-center justify-end">
          <ModeLayoutButton />
        </div>
      </div>
    </div>
  );
};

export default HeaderFlexibleView;
