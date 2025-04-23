import { useState } from "react";
import { useTheme } from "../../provider/ThemeProvider";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const NavItem = ({ payload, currentPath }) => {
  const { label, menuId, items, icon, path } = payload;
  const { isDarkMode } = useTheme();
  const [openMenus, setOpenMenus] = useState({ [menuId]: true });

  const toggleDropdown = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isActiveMain =
    (path && currentPath.startsWith(path)) ||
    (items && items.some((item) => currentPath.includes(item.href)));

  return (
    <div className="w-full">
      <div
        className={`flex items-center rounded-[5px] cursor-pointer ${
          isDarkMode ? "hover:bg-dark-900" : "hover:bg-light-800"
        }`}
      >
        <Link
          to={path || "#"}
          className="w-full flex items-center gap-[10px] py-[6px] px-[5px]"
        >
          <div
            className={`w-[30px] h-[30px] flex items-center justify-center text-[1rem]  ${
              isActiveMain
                ? "text-red-500 font-bold"
                : isDarkMode
                ? "hover:bg-dark-900"
                : "hover:bg-light-800"
            }`}
          >
            <i className={icon}></i>
          </div>
          <span
            className={`font-nunito font-bold text-[0.88rem] ${
              isActiveMain ? "text-red-500" : ""
            }`}
          >
            {label}
          </span>
        </Link>

        {items && items.length > 0 && (
          <div
            className={`text-[0.8rem] w-[30px] h-[30px] flex items-center justify-center cursor-pointer   ${
              isActiveMain
                ? "text-blue-600 font-bold"
                : isDarkMode
                ? "hover:bg-dark-900"
                : "hover:bg-light-800"
            }`}
            onClick={() => toggleDropdown(menuId)}
          >
            <i
              className="fa-solid fa-chevron-down transition-transform duration-300 "
              style={{
                transform: openMenus[menuId]
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            ></i>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openMenus[menuId] && items && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col pl-[40px] overflow-hidden"
          >
            {items.map((item) => {
              const isActiveSub = currentPath === item.href;
              return (
                <li
                  key={item.id}
                  className={`w-full py-[8px] px-[5px] rounded-[5px] ${
                    isActiveSub
                      ? "text-red-500 font-bold"
                      : isDarkMode
                      ? "hover:bg-dark-900"
                      : "hover:bg-light-800"
                  }`}
                >
                  <Link to={item.href}>{item.label}</Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItem;
