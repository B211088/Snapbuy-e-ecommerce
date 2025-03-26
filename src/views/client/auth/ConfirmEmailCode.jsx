import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useAuth } from "../../../contexts/User/AuthContext";
import HeaderFlexibleView from "../../../components/Header/HeaderFlexibleView";
import { useNotify } from "../../../components/Notify/NotifyModal";
import { parse } from "postcss";

const ConfirmEmailCode = () => {
  const { isDarkMode } = useTheme();
  const { registerUser, confirmCodeMailForRegister, sendMailForRegister } =
    useAuth();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const email = location.state?.email;
  const password = location.state?.password;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendMail = async () => {
    setLoading(true);
    try {
      const response = await sendMailForRegister(email);
      if (response.success) {
        setLoading(false);
        notifySuccess("Mã xác nhận đã được gửi vào email!", 3000);
        setIsSendMail(true);
        setCountdown(60);
      } else {
        notifyError(response.message || "Gửi mã thất bại!", 3000);
      }
    } catch (err) {
      console.error(err);
      notifyError("Có lỗi khi gửi mã xác nhận!", 3000);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser({ account: email, password });
      if (response.success) {
        notifySuccess("Tạo tài khoản thành công!", 3000, isDarkMode);
        return { success: true };
      }
      notifyError(response.message || "Tạo tài khoản thất bại", 3000);
      return false;
    } catch (error) {
      console.error(error);
      notifyError("Tạo tài khoản thất bại", 3000);
      return false;
    }
  };

  const handleConfirmEmail = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      notifyWarning("Vui lòng nhập đủ 6 số mã xác nhận", 3000);
      return;
    }
    try {
      const code = parseInt(otpCode);
      const response = await confirmCodeMailForRegister({
        email,
        code,
      });
      if (response.success) {
        notifySuccess("Xác nhận email thành công!", 3000);
        const registered = await handleRegister();
        if (registered.success) {
          navigate("/login");
        }
      } else {
        notifyError(response.message || "Xác nhận thất bại", 3000);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        notifyError("Bạn không có quyền truy cập!", 3000, isDarkMode);
      } else if (status === 401) {
        notifyError("Sai tài khoản hoặc mật khẩu!", 3000, isDarkMode);
      } else if (status === 500) {
        notifyError("Lỗi server, vui lòng thử lại sau!", 3000, isDarkMode);
      } else {
        notifyError("Lỗi hệ thống, vui lòng thử lại!", 3000, isDarkMode);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div
      className={`w-full h-[100vh] flex flex-col items-center  ${
        isDarkMode ? "bg-background text-dark-100" : "bg-dark-200 text-white"
      }`}
    >
      <HeaderFlexibleView title={"Xác nhận OTP"} />
      <div className="w-full container-minus-headerflexible flex items-center justify-center">
        <div
          className={`w-[30%] max-w-[420px] min-w-[340px] tl:min-w-[400px]  rounded-[5px]  ${
            isDarkMode ? "bg-white border-[1px]" : "bg-dark-400"
          } py-[20px] px-[20px]`}
        >
          {!isSendMail ? (
            <>
              <div className="w-full flex flex-col items-center py-[10px] pb-[10px] ">
                <h1 className="text-[1.5rem] font-nunito font-bold">
                  Gửi mã OTP
                </h1>
                <p className="text-[0.9rem] font-nunito font-light text-center">
                  Bấm gửi mã và kiểm tra email để nhận OTP <br />
                  <span className="font-semibold">{email}</span>
                </p>
              </div>
              <button
                onClick={handleSendMail}
                className="w-full outline-none px-[10px] py-[10px] rounded-[5px] text-[1rem] text-white font-bold bg-primary"
              >
                {loading ? "Đang gửi mã" : " Gửi mã"}
              </button>
            </>
          ) : (
            <>
              <div className="w-full flex flex-col items-center py-[10px] pb-[10px] ">
                <h1 className="text-[1.5rem] font-nunito font-bold">
                  Xác nhận OTP
                </h1>
                <p className="text-[0.9rem] font-nunito font-light text-center">
                  Nhập mã OTP gồm 6 chữ số đã gửi vào email <br />
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-12 text-center text-xl border rounded-md outline-none ${
                      isDarkMode
                        ? "border-dark-100 bg-white"
                        : "border-gray-300 bg-dark-200 text-white"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-center items-center gap-3 mb-6">
                {countdown > 0 ? (
                  <span className="text-sm text-gray-500">
                    Mã hết hạn sau {countdown}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendMail}
                    className="text-sm text-primary hover:underline"
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>

              <button
                onClick={handleConfirmEmail}
                className="w-full outline-none px-[10px] py-[10px] rounded-[5px] text-[1rem] text-white font-bold bg-primary"
              >
                Xác nhận
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailCode;
