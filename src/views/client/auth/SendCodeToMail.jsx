import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/User/AuthContext";
import { useNotify } from "../../../components/Notify/NotifyModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../Provider/ThemeProvider";

const SendCodeToMail = () => {
  const { sendMailForRegister } = useAuth();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const email = location.state?.email;
  const password = location.state?.password;

  useEffect(() => {
    if (!email && !password) {
      navigate("/login");
    }
  }, []);

  const handleSendMail = async () => {
    setLoading(true);
    try {
      const response = await sendMailForRegister(email);
      if (response.success) {
        setLoading(false);
        notifySuccess("Mã xác nhận đã được gửi vào email!");
        navigate("/confirmcode", {
          state: { email: email.trim(), password: password.trim() },
        });
        return;
      }
      notifyWarning(response.message || "Gửi mã thất bại!");
      setLoading(false);
      return;
    } catch (err) {
      notifyError("Có lỗi khi gửi mã xác nhận:", err.messag);
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full h-[100vh] flex flex-col items-center  ${
        isDarkMode ? "bg-background text-dark-100" : "bg-dark-200 text-white"
      }`}
    >
      <div className="w-full container-minus-headerflexible flex items-center justify-center">
        <div
          className={`w-[30%] max-w-[420px] min-w-[340px] tl:min-w-[400px]  rounded-[5px]  ${
            isDarkMode ? "bg-white border-[1px]" : "bg-dark-400"
          } py-[20px] px-[20px]`}
        >
          <div className="w-full flex flex-col items-center py-[10px] pb-[10px] ">
            <h1 className="text-[1.5rem] font-nunito font-bold">Gửi mã OTP</h1>
            <p className="text-[0.9rem] font-nunito font-light text-center">
              Bấm gửi mã và kiểm tra email để nhận OTP <br />
              <span className="font-semibold">{email}</span>
            </p>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <button
              onClick={handleSendMail}
              className="w-full outline-none px-[10px] py-[10px] rounded-[5px] text-[1rem] text-white font-bold bg-primary"
            >
              {loading ? "Đang gửi mã" : " Gửi mã"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`w-full outline-none px-[10px] py-[10px] rounded-[5px] text-[1rem] font-bold ${
                isDarkMode
                  ? "bg-light-100 text-dark-100"
                  : "bg-dark-200 text-light-100"
              }`}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCodeToMail;
