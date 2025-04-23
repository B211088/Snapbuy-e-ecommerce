import { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import AddUserAddressModal from "../Modal/AddUserAddressModal";
import UpdateAddressModal from "../Modal/UpdateAddressModal";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAddress } from "../../contexts/User/AddressContext";
import { useNotify } from "../Notify/NotifyModal";
import { useConfirm } from "../Notify/ConfirmModal";

const Address = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning } = useNotify();
  const { confirm, ConfirmComponent } = useConfirm();
  const {
    authState: { user, addresses },
  } = useAuth();
  const { deleteAddressReceiver } = useAddress();

  const navigate = useNavigate();
  const location = useLocation();
  const [addressData, setAddressData] = useState({});
  const [showAddUserAddressModal, setShowAddUserAddressModal] = useState(false);
  const [showUpdateUserAddressModal, setShowUpdateUserAddressModal] =
    useState(false);

  const onOpenAddUserAddressModal = (address) => {
    setShowAddUserAddressModal(true);
    navigate("?popup=adduseraddress", { replace: true });
  };

  const onCloseAddUserAddressModal = () => {
    setShowAddUserAddressModal(false);
    navigate(location.pathname, { replace: true });
  };

  const onOpenUpadateUserAddressModal = (address_id, addressData) => {
    setShowUpdateUserAddressModal(true);
    setAddressData({ ...addressData, address_id: address_id });
    navigate(`?popup=updateuseraddress?${address_id}`, { replace: true });
  };

  const onCloseUpdateAddressModal = () => {
    setShowUpdateUserAddressModal(false);
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("popup") === "updateuseraddress") {
      setShowAddUserAddressModal(true);
    }
    if (searchParams.get("popup") === "adduseraddress") {
      setShowAddUserAddressModal(true);
    }
  }, [location.search]);

  const handleDeletedAddress = (addressId) => {
    confirm({
      message: "Bạn có chắc chắn muốn xoá địa chỉ này không?",
      onConfirm: async () => {
        try {
          const response = await deleteAddressReceiver(addressId, user.id);
          if (response.success) {
            notifySuccess("Xóa địa chỉ thành công!", 3000);
            return;
          }
          notifyWarning("Không thể xoá địa chỉ", 3000);
          return;
        } catch (error) {
          console.error("Lỗi khi xoá địa chỉ:", error);
          notifyWarning("Có lỗi xảy ra khi xoá địa chỉ", 3000);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleSuccess = (message) => {
    notifySuccess(message);
  };

  return (
    <div className="w-full flex gap-[20px]">
      <div
        className={`w-full flex flex-col  ${
          isDarkMode
            ? "bg-white text-dark-100"
            : "bg-dark-200 text-white rounded-[5px]"
        }`}
      >
        {" "}
        <ConfirmComponent />
        <div className="w-full flex items-center justify-between px-[20px] py-[12px] border-b-[1px] border-dashed ">
          <div className="flex items-center  font-nunito gap-[10px]">
            <div
              className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
                isDarkMode ? "text-dark-300" : "text-light-300"
              }`}
            >
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="font-bold text-[1.2rem]">Địa chỉ giao hàng</h1>
              <p
                className={`font-normal text-[0.95rem] ${
                  isDarkMode ? " text-dark-300" : "text-light-300"
                }`}
              >
                Quản lý thông tin giao hàng của bạn
              </p>
            </div>{" "}
          </div>
          <div className={`w-full flex  justify-end font-normal text-[1rem] `}>
            <div
              className=" flex items-center justify-center  gap-[7px] truncate rounded-[5px]  text-dark-1000  border-[1px] border-dark-700  p-[3px] cursor-pointer"
              onClick={onOpenAddUserAddressModal}
            >
              <div className="w-full flex items-center justify-center gap-[5px] px-[20px] py-[5px]  rounded-[4px] bg-primary">
                <span className="font-bold text-[0.8rem] uppercase">
                  Thêm địa chỉ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <div className="w-full flex items-center justify-end border-b-[1px] py-[10px] px-[20px]">
            <div className="  py-[5px] border-[1px] rounded-[5px] font-nunito text-[0.8rem]">
              <select
                className="w-full pr-[20px] pl-[10px] outline-none bg-transparent"
                name=""
                id=""
              >
                <option className="outline-none  bg-transparent" value="">
                  Thêm gần đây
                </option>
                <option className="outline-none  bg-transparent" value="">
                  Cũ nhất
                </option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-[20px] px-[20px] ">
            {addresses.length > 0 ? (
              <div className="w-full flex flex-col gap-[20px] pb-[20px]">
                {addresses?.map((address, index) => (
                  <div
                    key={index}
                    className={`w-full flex-col  px-[10px] py-[10px] rounded-[5px] font-nunito ${
                      isDarkMode ? "border-[1px]" : " bg-dark-300 text-white"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-[10px] text-[0.9rem]">
                      <div className="flex items-center gap-[5px]">
                        <div className="flex items-center justify-center w-[30px] h-[30px] p-[10px] rounded-[5px] text-[1.2rem]  ">
                          <i className="fa-regular fa-address-book"></i>
                        </div>
                        <div className="flex items-center gap-[20px] font-nunito text-[1.02rem]">
                          <div className="font-bold">
                            {address.receiver_name}
                          </div>
                          <div className="">{address.phone_number}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        {address.isDefault && (
                          <div className="truncate flex items-center justify-center font-bold text-primary text-[0.9rem] px-[20px] py-[5px] rounded-[5px] border-[1px] ">
                            <span>Mặc định</span>
                          </div>
                        )}
                        <div
                          className="flex items-center gap-[5px] border-[1px] px-[10px] py-[9px] rounded-[5px] cursor-pointer"
                          onClick={() =>
                            onOpenUpadateUserAddressModal(
                              address.address_id,
                              address
                            )
                          }
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                        <div
                          className="flex items-center gap-[5px] border-[1px] px-[10px] py-[9px] rounded-[5px] cursor-pointer"
                          onClick={() =>
                            handleDeletedAddress(address.address_id)
                          }
                        >
                          <i className="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex items-center gap-[10px] mt-[10px]">
                      <div className="flex items-center py-[10px] gap-[10px]">
                        <div className="flex items-center justify-center w-[30px] h-[30px] p-[10px] rounded-full border-[1px] text-red-700">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <span className="font-nunito font-bold text-[0.9rem]">
                          {address.village_name} - {address.district_name} -{" "}
                          {address.province_name}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-full flex items-center gap-[10px] mt-[10px] px-[5px] ${
                        isDarkMode ? "bg-dark-900" : "bg-dark-400"
                      } rounded-[5px]`}
                    >
                      <div className="flex items-center py-[10px] gap-[10px] ">
                        <div className="flex items-center justify-center w-[24px] h-[24px] p-[10px] rounded-full  text-green-700">
                          <i className="fa-solid fa-location-crosshairs"></i>
                        </div>
                        <span className="font-nunito font-medium text-[0.9rem]">
                          {address.specific_address}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center px-[10px] py-[20px] font-nunito ">
                <div className="w-full text-center">
                  Bạn chưa có địa chỉ nhận hàng
                </div>
              </div>
            )}
          </div>
        </div>
        {showAddUserAddressModal && (
          <AddUserAddressModal
            onCloseAddUserAddressModal={onCloseAddUserAddressModal}
            onSuccess={handleSuccess}
          />
        )}{" "}
        {showUpdateUserAddressModal && (
          <UpdateAddressModal
            address={addressData}
            onCloseUpdateAddressModal={onCloseUpdateAddressModal}
          />
        )}{" "}
      </div>
    </div>
  );
};

export default Address;
