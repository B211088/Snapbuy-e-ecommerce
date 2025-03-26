import React from "react";
import { useTheme } from "../../Provider/ThemeProvider";

const ContainerModeLayer1 = ({ children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`w-full flex flex-col  rounded-[5px] ${
        isDarkMode
          ? "bg-light-100 text-dark-100"
          : "bg-dark-200 text-light-100 "
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerModeLayer1;
