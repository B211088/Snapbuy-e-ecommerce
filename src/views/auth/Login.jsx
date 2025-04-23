import { useState } from "react";
import { Link } from "react-router-dom";
import logo_snapbuy from "../../assets/images/logo_snapbuy.png";
import { useTheme } from "../../provider/ThemeProvider";
import { useAuth } from "../../contexts/AuthContext";
import HeaderFlexibleView from "../../component/Header/HeaderFlexibleView";
import { useNotify } from "../../component/Notify/NotifyModal";

const Login = () => {
  const { loginUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();

  const [formData, setFormData] = useState({
    account: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    const account = formData.account.trim();
    const password = formData.password.trim();

    if (!account || !password) {
      notifyWarning("Vui lòng nhập đầy đủ thông tin!", 3000, isDarkMode);
      return;
    }

    if (password.length < 8) {
      notifyWarning("Mật khẩu phải có ít nhất 8 ký tự!", 3000, isDarkMode);
      return;
    }

    try {
      const response = await loginUser({ ...formData, account, password });

      if (response.success && response.roles?.includes("admin")) {
        notifyWarning("Không có quyền truy cập");
        return;
      }

      if (response.success) {
        notifySuccess("Đăng nhập thành công!", 3000, isDarkMode);
        return;
      }

      notifyError("Sai tài khoản hoặc mật khẩu!", 3000, isDarkMode);
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <div
      className={`w-full h-[100vh] flex flex-col items-center ${
        isDarkMode ? "bg-background text-dark-100" : "bg-dark-200 text-white"
      }`}
    >
      <HeaderFlexibleView title={"Đăng nhập Admin Manager Page"} />

      <div className="w-full screen-minus-flexibleheader  flex items-center justify-center ">
        {" "}
        <div
          className={`w-[30%] max-w-[420px] min-w-[340px] tl:min-w-[400px]  rounded-[5px] ${
            isDarkMode ? "bg-white border-[1px]" : "bg-dark-400"
          } py-[20px] px-[20px]`}
        >
          <Link to="#" className="w-full flex items-center gap-[10px] ">
            <img className="w-[30px]" src={logo_snapbuy} alt="" />
            <div className="flex items-centerfont-nunito font-extrabold text-[1.3rem] mt-[5px]">
              {" "}
              <span className="text-primary">Snap</span>
              <span className="">Buy</span>
            </div>
          </Link>
          <div className="w-full flex flex-col py-[20px] pb-[10px]">
            <h1 className="text-[1.5rem] font-nunito font-bold mb-[3px]">
              Đăng nhập Admin
            </h1>
            <p className="text-[0.9rem] font-nunito font-light ">
              Hãy bảo mật kỹ lưỡng tài khoản admin
            </p>
          </div>
          <div className="flex flex-col mt-[20px] gap-[20px]">
            <div
              className={`w-full flex items-center ${
                isDarkMode ? "border-[1px]" : "bg-dark-200"
              } rounded-[5px] `}
            >
              <div className="p-[10px] flex items-center justify-center">
                <i className="fa-solid fa-user"></i>
              </div>
              <input
                className="w-full bg-transparent outline-none px-[0px] py-[10px] rounded-[5px] text-[0.9rem]"
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="Nhập số điện thoại hoặc tên tài khoản"
              />
            </div>
            <div
              className={`w-full flex items-center ${
                isDarkMode ? "border-[1px]" : "bg-dark-200"
              } rounded-[5px] `}
            >
              <div className="p-[10px] flex items-center justify-center">
                <i className="fa-solid fa-lock"></i>
              </div>
              <input
                className="w-full outline-none bg-transparent px-[0px] py-[10px] rounded-[5px] text-[0.9rem]"
                type="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              className="w-full outline-none px-[10px] py-[8px] rounded-[5px]  text-[1rem] text-white font-bold bg-primary"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
