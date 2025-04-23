import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../Provider/ThemeProvider";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavItem = ({ payload, basePath, currentPath }) => {
  const { label, menuId, items, icon, path } = payload;
  const { isDarkMode } = useTheme();
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({ [menuId]: false });

  useEffect(() => {
    if (
      items &&
      items.some((item) => currentPath.startsWith(`${basePath}/${item.href}`))
    ) {
      setOpenMenus((prev) => ({ ...prev, [menuId]: true }));
    }
  }, [currentPath, items, menuId]);

  const toggleDropdown = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <div className="w-full">
      <div
        className={`flex items-center rounded-[5px] cursor-pointer ${
          isDarkMode ? "hover:bg-dark-900" : "hover:bg-light-800"
        }`}
      >
        {payload.path && payload.path ? (
          <NavLink
            to={payload.path}
            end
            className={({ isActive }) =>
              `w-full flex items-center gap-[10px] py-[6px] px-[5px] ${
                isActive ? "text-primary font-bold" : ""
              }`
            }
          >
            <div className="w-[30px] h-[30px] flex items-center justify-center text-[1rem]">
              <i className={icon}></i>
            </div>
            <span className="font-nunito font-bold text-[0.88rem]">
              {label}
            </span>
          </NavLink>
        ) : (
          <div
            onClick={() => toggleDropdown(menuId)}
            className="w-full flex items-center justify-between  gap-[10px] py-[6px] px-[5px]"
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] flex items-center justify-center text-[1rem]">
                <i className={icon}></i>
              </div>
              <span className="font-nunito font-bold text-[0.88rem]">
                {label}
              </span>
            </div>
            {items.length > 0 ? (
              items && (
                <div
                  className={`text-[0.8rem] w-[30px] h-[30px] flex items-center justify-center cursor-pointer ${
                    openMenus[menuId] ? "" : ""
                  }`}
                >
                  <i
                    className="fa-solid fa-chevron-down transition-transform duration-300"
                    style={{
                      transform: openMenus[menuId]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  ></i>
                </div>
              )
            ) : (
              <div className=""></div>
            )}
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
            {items.map((item) => (
              <li
                key={item.id}
                className="w-full py-[8px] px-[5px] rounded-[5px]"
              >
                <NavLink
                  to={`${basePath}/${item.href}`}
                  end
                  className={({ isActive }) =>
                    `${isActive ? "text-primary font-bold" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItem;
