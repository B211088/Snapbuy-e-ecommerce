import { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import UpdateInfoUserModal from "../Modal/UpdateInfoUserModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotify } from "../Notify/NotifyModal";
import UpdateAvatarModal from "../Modal/UpdateAvatarModal";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    authState: { user },
  } = useAuth();

  const [showUpdateInfoUserModal, setUpdateInfoUserModal] = useState(false);
  const [showUpdateImgModal, setUpdateImgModal] = useState(false);

  const handleOpenUpdateInfoUserModal = () => {
    setUpdateInfoUserModal(true);
    navigate("?popup=updateuserinfo", { replace: true });
  };

  const onCloseUpdateInfoUserModal = () => {
    setUpdateInfoUserModal(false);
    navigate(location.pathname, { replace: true });
  };

  const closeUpdateImgModal = () => {
    setUpdateImgModal(false);
  };

  const onOpenUpdateImgModal = () => {
    setUpdateImgModal(true);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("popup") === "updateuserinfo") {
      setUpdateInfoUserModal(true);
    }
  }, [location.search]);

  return (
    <div className="w-full flex gap-[20px]  ">
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-white text-dark-100" : "bg-dark-200 text-white "
        }`}
      >
        <div className="w-full flex mb:flex-col items-center justify-between pc:p-[20px] mb:p-[10px]  border-b-[1px] border-dashed ">
          <div className="w-full flex items-center  font-nunito gap-[10px]">
            <div
              className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
                isDarkMode ? "text-dark-300" : "text-light-300"
              }`}
            >
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="font-bold text-[1.2rem]">Hồ sơ của tôi</h1>
              <p
                className={`font-normal text-[0.95rem] ${
                  isDarkMode ? " text-dark-300" : "text-light-300"
                }`}
              >
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </div>{" "}
          </div>
          <div
            className={`w-full flex  pc:justify-end font-normal text-[1rem] mb:py-[10px]`}
          >
            <div
              className=" flex items-center justify-center  gap-[7px] truncate rounded-[5px]  text-dark-1000  border-[1px] border-dark-700  p-[3px] cursor-pointer"
              onClick={handleOpenUpdateInfoUserModal}
            >
              <div className="w-full flex items-center justify-center gap-[5px] px-[20px] py-[5px]  rounded-[4px] bg-primary">
                <span className="font-bold text-[0.8rem] uppercase">
                  Cập nhật thông tin
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex  mb:flex-col   pc:p-[40px] mb:p-[10px] gap-[40px]">
          <div className="pc:w-4/12 mb:w-full flex flex-col   border-dashed">
            <div className="w-full flex flex-col mb:flex-row items-center mb:gap-[10px] ">
              <div className="w-[180px] h-[180px] mb:w-[100px] mb:h-[100px] aspect-square  rounded-full border-[1px]">
                <img
                  className="w-full h-full aspect-square  rounded-full object-cover cursor-pointer"
                  src={
                    user.avatar !== "user.png"
                      ? user.avatar_url
                      : " https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  }
                  alt="avatar"
                />
              </div>
              <div className="w-full flex flex-col mb:mb-[10px]">
                <div
                  className={`pc:text-center font-nunito font-bold pt-[10px] text-[1.3rem] mb:text-[1.2rem] truncate ${
                    user.fullname ? "text-dark-100 " : " text-dark-400"
                  } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
                >
                  {user.fullname ? user.fullname : "Chưa cập nhật"}
                </div>
                <div className="w-full flex justify-center mb:justify-start mt-[10px] pl-[5px]">
                  <div
                    className={` px-[10px] py-[5px] border-dashed rounded-[5px] text-[0.7rem] font-nunito   cursor-pointer ${
                      isDarkMode
                        ? "text-dark-100 border-[1px] border-[#3e3e3e] "
                        : "text-dark-1000 border-[1px] border-[#ffffff] "
                    }`}
                    onClick={onOpenUpdateImgModal}
                  >
                    <span>Thay đổi ảnh đại diện</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pc:w-8/12 w-full flex flex-col pc:gap-[20px] mb:gap-[10px] mb:text-[0.9rem]">
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px]">
              <div className="w-3/12 mb:w-4/12 font-bold  flex pc:justify-end truncate">
                <span>Tên đăng nhập</span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal ${
                  user?.account ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.account ? user.account : "Chưa cập nhật"}
              </div>
            </div>
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px]">
              <div className="w-3/12 mb:w-4/12  font-bold flex pc:justify-end">
                <span>Họ và tên</span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal  ${
                  user?.account ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.fullname ? user.fullname : "Chưa cập nhật"}
              </div>
            </div>

            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
              <div className="w-3/12 mb:w-4/12  font-bold flex  pc:justify-end">
                <span>Email </span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal flex mb:flex-col pc:items-center pc:justify-between pc:gap-[20px]  ${
                  user.email ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                <div className="w-8/12">
                  {user?.email ? user.email : "Chưa cập nhật"}
                </div>
                <div className="flex font-nunito text-[0.8rem] cursor-pointer text-blue-500">
                  <Link to="/userinfo/account/email">
                    {user?.email ? "thay đổi" : "cập nhật"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center  gap-[40px] font-nunito py-[5px] ">
              <div className="w-3/12 mb:w-4/12  font-bold  flex  pc:justify-end">
                <span>Số điện thoại </span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal flex mb:flex-col pc:items-center pc:justify-between pc:gap-[20px]  ${
                  user.phone_number ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                <div className="w-9/12">
                  {" "}
                  {user?.phone_number ? user.phone_number : "Chưa cập nhật"}
                </div>
                <div className="w- flex font-nunito text-[0.8rem] cursor-pointer text-blue-500">
                  <Link to="/userinfo/account/phone_number">
                    {" "}
                    {user?.phone_number ? "thay đổi" : "cập nhật"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
              <div className="w-3/12 mb:w-4/12 font-bold  flex pc:justify-end ">
                <span>Giới tính </span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal  ${
                  user?.gender !== null ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.gender === null
                  ? "Chưa cập nhật"
                  : user.gender === true
                  ? "Nam"
                  : "Nữ"}
              </div>
            </div>
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px]">
              <div className="w-3/12 mb:w-4/12 font-bold  flex pc:justify-end ">
                <span>Ngày sinh </span>
              </div>
              <div
                className={`w-9/12 mb:w-8/12  font-normal mb:text-[0.85rem]  ${
                  user.birth_date ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.birth_date
                  ? new Date(user.birth_date).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
        {showUpdateInfoUserModal && (
          <UpdateInfoUserModal
            onCloseUpdateInfoUserModal={onCloseUpdateInfoUserModal}
          />
        )}

        {showUpdateImgModal && (
          <UpdateAvatarModal onCloseUpdateImgModal={closeUpdateImgModal} />
        )}
      </div>
    </div>
  );
};

export default Profile;
