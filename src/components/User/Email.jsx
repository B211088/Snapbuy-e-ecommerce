import React, { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";

const Email = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState();
  console.log(email);
  const {
    sendCodeToEmail,
    confirmEmail,
    authState: { user },
  } = useAuth();

  const handleSendMail = async () => {
    if (!email) {
      alert("Vui lòng nhập đ��a chỉ email");
      return;
    }
    try {
      const response = await sendCodeToEmail(user.id, email);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, []);

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-full flex gap-[20px]  ">
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-white text-dark-100" : "bg-dark-200 text-white "
        }`}
      >
        <div
          className={`w-full flex items-center justify-between px-[20px] py-[10px] border-b-[1px] ${
            isDarkMode
              ? "border-dashed border-light-400"
              : "border-dashed border-dark-500"
          } `}
        >
          <div className="flex flex-col font-nunito gap-[5px]">
            <h1 className="font-bold text-[1.4rem]">Thay đổi địa chỉ email</h1>
            <p className="font-normal text-[0.95rem]">
              Nhập và xác nhận địa chỉ email mới của bạn
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col pt-[40px] pb-[105px] ">
          <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
            <div className="w-3/12 font-bold text-[1rem] flex  justify-end">
              <span>Địa chỉ email mới</span>
            </div>
            <div
              className={`w-6/12 font-normal flex items-center gap-[20px] text-[1rem] py-[8px] px-[10px]  rounded-[5px] ${
                isDarkMode ? "border-[1px] " : "bg-dark-400"
              } `}
            >
              <input
                className="w-full outline-none border-none bg-transparent text-[0.9rem]"
                type="email"
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
            <div className="w-3/12 font-bold text-[1rem] flex  justify-end"></div>
            <button
              className={`w-3/12 min-w-[200px] font-normal flex items-center justify-center gap-[20px] text-[1rem] py-[5px] px-[10px]  rounded-[5px] bg-primary`}
              onClick={handleSendMail}
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
