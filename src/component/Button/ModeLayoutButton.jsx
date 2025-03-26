import { useTheme } from "../../Provider/ThemeProvider";

const ModeLayoutButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={`w-[42px] h-[22px] flex items-center  rounded-full p-1 cursor-pointer transition-all relative  ${
        isDarkMode ? "bg-dark-400 text-white" : "bg-white text-dark-900"
      } shadow-md transition-all duration-300 ease}`}
    >
      <div
        className={`w-[18px] h-[18px] bg-white text-[0.6rem] dark:bg-black rounded-full flex items-center justify-center shadow-md absolute transition-transform duration-300 ${
          isDarkMode ? "translate-x-[18px]" : "translate-x-0"
        }`}
      >
        {isDarkMode ? (
          <i className="fa-solid fa-sun text-yellow-500"></i>
        ) : (
          <i className="fa-solid fa-moon text-white"></i>
        )}
      </div>
    </div>
  );
};

export default ModeLayoutButton;
