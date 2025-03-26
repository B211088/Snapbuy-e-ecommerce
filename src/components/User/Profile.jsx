import { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import UpdateInfoUserModal from "../Modal/UpdateInfoUserModal";
import UpdateImgModal from "../Modal/UpdateImgModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useNotify } from "../Notify/NotifyModal";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    authState: { user, roles },
    uploadAvatar,
  } = useAuth();

  const [showUpdateInfoUserModal, setUpdateInfoUserModal] = useState(false);
  const [showUpdateImgModal, setUpdateImgModal] = useState(false);
  const [imgaeUpdate, setImageUpdate] = useState(null);

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

  const handleUpload = async () => {
    if (!user || !user.id) {
      notifyWarning("Không tìm thấy thông tin người dùng!");
      return;
    }

    try {
      const result = await uploadAvatar(user.id, imgaeUpdate);
      if (result.success) {
        notifySuccess("Cập nhật ảnh đại điện thành công");
        setImageUpdate(false);
      } else {
        notifyWarning(`Lỗi:  ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      notifyWarning("Lỗi khi tải lên ảnh!");
    }
  };

  return (
    <div className="w-full flex gap-[20px]  ">
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-white text-dark-100" : "bg-dark-200 text-white "
        }`}
      >
        <div className="w-full flex items-center justify-between px-[20px] py-[12px] border-b-[1px] border-dashed ">
          <div className="flex items-center  font-nunito gap-[10px]">
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
          <div className={`w-full flex  justify-end font-normal text-[1rem] `}>
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
        <div className="w-full  flex   px-[40px] py-[40px] gap-[40px]">
          <div className="w-4/12 flex flex-col  border-dashed">
            <div className="w-full   flex flex-col items-center ">
              <div className="w-[180px] h-[180px] rounded-full border-[1px]">
                <img
                  className="w-full h-full  rounded-full object-cover cursor-pointer"
                  src={
                    user.avatar !== "user.png"
                      ? user.avatar_url
                      : " https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  }
                  alt="avatar"
                />
              </div>
              <div
                className={`font-nunito font-bold pt-[10px] text-[1.3rem] ${
                  user.fullname ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.fullname ? user.fullname : "Chưa cập nhật"}
              </div>
              <div className="w-full flex justify-center mt-[10px]">
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
          <div className="w-8/12 flex flex-col gap-[20px]">
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px]">
              <div className="w-3/12 font-bold text-[1rem] flex justify-end">
                <span>Tên đăng nhập</span>
              </div>
              <div
                className={`w-8/12 font-normal text-[1rem] ${
                  user?.account ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.account ? user.account : "Chưa cập nhật"}
              </div>
            </div>
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px]">
              <div className="w-3/12 font-bold text-[1rem] flex justify-end">
                <span>Họ và tên</span>
              </div>
              <div
                className={`w-8/12 font-normal text-[1rem] ${
                  user?.account ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                {user.fullname ? user.fullname : "Chưa cập nhật"}
              </div>
            </div>

            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
              <div className="w-3/12 font-bold text-[1rem] flex  justify-end">
                <span>Email </span>
              </div>
              <div
                className={`w-8/12 font-normal flex items-center gap-[20px] text-[1rem] ${
                  user.email ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                <div className="w-8/12">
                  {" "}
                  {user?.email ? user.email : "Chưa cập nhật"}
                </div>
                <div className="flex font-nunito text-[0.8rem] cursor-pointer text-blue-500">
                  <Link to="/userinfo/account/email">
                    {user?.email ? "thay đổi" : "cập nhật"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center gap-[40px] font-nunito py-[5px] ">
              <div className="w-3/12 font-bold text-[1rem] flex  justify-end">
                <span>Số điện thoại </span>
              </div>
              <div
                className={`w-8/12 font-normal flex items-center gap-[20px] text-[1rem] ${
                  user.phone_number ? "text-dark-100 " : " text-dark-400"
                } ${isDarkMode ? "text-dark-100" : "text-dark-1000"}`}
              >
                <div className="w-8/12">
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
              <div className="w-3/12 font-bold text-[1rem] flex justify-end">
                <span>Giới tính </span>
              </div>
              <div
                className={`w-8/12 font-normal text-[1rem] ${
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
              <div className="w-3/12 font-bold text-[1rem] flex justify-end">
                <span>Ngày sinh </span>
              </div>
              <div
                className={`w-8/12 font-normal text-[1rem] ${
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
          <UpdateImgModal
            onCropped={(croppedImage) => {
              setImageUpdate(croppedImage);
            }}
            onUpload={handleUpload}
            onCloseUpdateImgModal={closeUpdateImgModal}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
