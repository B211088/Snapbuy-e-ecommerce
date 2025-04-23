import { useTheme } from "../../../Provider/ThemeProvider";

const LayoutModeBackground = ({ children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`w-full flex flex-col justify-center items-center pc:px-[20px] px-[10px] ${
        isDarkMode ? "bg-background" : "bg-[#515151]"
      }`}
    >
      {children}
    </div>
  );
};

export default LayoutModeBackground;
