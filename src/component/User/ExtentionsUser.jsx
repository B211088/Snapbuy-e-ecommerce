import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useConfirm } from "../../component/Notify/ConfirmModal";
import { useTheme } from "../../Provider/ThemeProvider";

const ExtentionsUser = ({ extentionsList }) => {
  const {
    authState: { isAuthenticated, user },
    logoutUser,
  } = useAuth();
  const { confirm, ConfirmComponent } = useConfirm();

  const [statusModal, setStatusModal] = useState(false);
  const { isDarkMode } = useTheme();

  const handleClickOutside = (event) => {
    if (!event.target.closest(".user-menu")) {
      setStatusModal(false);
    }
  };

  const handleLogoutAccount = () => {
    confirm({
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      onConfirm: () => {
        console.log("Đăng xuất thành công!");
        logoutUser();
      },
      onCancel: () => {
        console.log("Người dùng đã hủy đăng xuất!");
      },
    });
  };

  useEffect(() => {
    if (statusModal) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [statusModal]);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`absolute flex top-[105%] right-[0%] shadow-lg rounded-[5px] ${
        isDarkMode ? "bg-white" : "bg-dark-400"
      } min-w-[170px] z-50 overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      <ConfirmComponent />
      <ul className="w-full flex flex-col justify-center font-nunito font-light text-[0.87rem]">
        {extentionsList.map((item, index) => (
          <li
            key={index}
            className={`w-full flex items-center py-[6px] px-[10px] ${
              isDarkMode ? "hover:bg-dark-900 " : "hover:bg-dark-500 "
            } rounded-[5px]`}
            onClick={item.onClick ? item.onClick : undefined}
          >
            {item.path ? <Link to={item.path}>{item.title}</Link> : item.title}
          </li>
        ))}
        <li
          className={`w-full flex items-center py-[6px] px-[10px] rounded-[5px] cursor-pointer ${
            isDarkMode ? "hover:bg-dark-900 " : "hover:bg-dark-500 "
          } `}
          onClick={handleLogoutAccount}
        >
          Đăng xuất
        </li>
      </ul>
    </motion.div>
  );
};

export default ExtentionsUser;
