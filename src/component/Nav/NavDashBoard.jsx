import { useLocation } from "react-router-dom";
import { useTheme } from "../../provider/ThemeProvider";
import NavItem from "../Feature/NavItem";

const NavDashboard = ({ navList, heightTop }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  return (
    <div className="w-full max-w-[280px] min-w-[260px] flex flex-col gap-[10px] sticky rounded-[5px]">
      <div
        className={`w-full flex flex-col pl-[10px] rounded-[5px] ${
          isDarkMode
            ? "bg-light-100 text-dark-100"
            : "bg-dark-200 text-light-100"
        }`}
      >
        <div className="w-full py-[5px] ">
          <ul
            className="w-full flex flex-col overflow-y-auto overflow-x-hidden scrollbar-custom py-[8px] pr-[5px] font-nunito text-[0.85rem]"
            style={{ height: `calc(100vh - ${heightTop}px)` }}
          >
            {navList.map((item) => (
              <NavItem
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
