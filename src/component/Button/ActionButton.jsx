import React from "react";
import { useTheme } from "../../provider/ThemeProvider";

const ActionButton = ({ onClick, payload }) => {
  const { isDarkMode } = useTheme();
  const { type, name, icon } = payload;
  return (
    <div
      className={`w-[28px] h-[28px] flex items-center justify-center rounded-[5px]  cursor-pointer relative group ${
        isDarkMode ? "border-[1px]" : "bg-dark-300"
      } `}
      onClick={onClick}
    >
      <i className={icon}></i>
      <div className="hidden  absolute top-[110%] left-[-120%] bg-[#08080861] group-hover:flex items-center justify-center px-[10px] py-[2px] font-nunito text-[0.9rem] truncate text-light-100 rounded-[5px] z-10">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default ActionButton;
