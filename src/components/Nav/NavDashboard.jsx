import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../Provider/ThemeProvider";
import NavItem from "./NavItem";
import { useIsMobile } from "../../hooks/useMediaQuery";

const NavDashboard = ({ navList, heightTop, basePath }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  return (
    <div className="w-full pc:max-w-[280px] pc:min-w-[240px] flex flex-col gap-[10px] ">
      <div
        className={`w-full flex flex-col pl-[10px] rounded-[5px] ${
          isDarkMode
            ? "bg-light-100 text-dark-100"
            : "bg-dark-200 text-light-100"
        }`}
      >
        <div className="w-full py-[5px]">
          <ul
            className="w-full flex flex-col overflow-y-auto overflow-x-hidden scrollbar-custom py-[8px] pr-[5px] font-nunito text-[0.85rem]"
            style={
              !isMobile ? { height: `calc(100vh - ${heightTop}px)` } : undefined
            }
          >
            {navList.map((item) => (
              <NavItem
                basePath={basePath}
                key={item.id}
                payload={item}
                currentPath={location.pathname}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavDashboard;
