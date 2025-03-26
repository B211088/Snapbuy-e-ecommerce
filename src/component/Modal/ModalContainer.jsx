import React from "react";
import { useTheme } from "../../Provider/ThemeProvider";

const ModalContainer = ({ onCloseModal, children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 pc:px-[0px] mb:px-[20px] mb:py-[20px] flex items-center justify-center bg-[#2e2e2e27] z-[30]"
      onClick={onCloseModal}
    >
      <div
        className={`pc:w-[28%] pc:min-w-[460px] mb:w-full mb:min-w-[340px] py-[10px]  rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white " : "text-white bg-dark-300"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
