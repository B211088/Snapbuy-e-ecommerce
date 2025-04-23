import React from "react";
import { useTheme } from "../../../Provider/ThemeProvider";

const SectionContainer = ({ children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`pc:w-[90%] w-full flex flex-col  my-[20px]   rounded-[5px] ${
        isDarkMode ? "bg-white" : "bg-dark-200 text-white"
      } `}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
