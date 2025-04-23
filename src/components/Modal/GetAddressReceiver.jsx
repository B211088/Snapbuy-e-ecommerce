import React, { useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAddress } from "../../contexts/User/AddressContext";
import AddUserAddressModal from "./AddUserAddressModal";
import UpdateAddressModal from "./UpdateAddressModal";
import { useAuth } from "../../contexts/User/AuthContext";

const GetAddressReceiver = ({ onCloseModal, onSelect, addressIdSelected }) => {
  const { isDarkMode } = useTheme();
  const {
    authState: { addresses },
  } = useAuth();
  const [addressReceiverSelected, setAddressReceiverSelected] = useState({});
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [updateAddressModal, setUpdateAddressModal] = useState(false);
  const [updateAddressData, setUpdateAddressData] = useState(null);

  const handleSelectAddressReceiver = (address) => {
    setAddressReceiverSelected(address);
  };

  const handleOpenUpdateAddressModal = (address) => {
    setUpdateAddressData(address);
    setUpdateAddressModal(true);
  };

  const handleConfirmSelectAddressReceiver = () => {
    onSelect(addressReceiverSelected);
    onCloseModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center mb:px-[10px] justify-center bg-[#2e2e2e27] z-[30]"
      onClick={onCloseModal}
    >
      <div
        className={`pc:w-[40%] pc:min-w-[680px]   tl:min-w-[480px] mb:w-full mb:min-w-[340px] rounded-[5px] ${
          isDarkMode ? "text-dark-100 bg-white " : "text-white bg-dark-300"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center gap-[5px] px-[20px] py-[15px] border-b-[1px] border-dashed font-nunito font-bold ">
          <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full text-[1.4rem] border-[1px] ">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className="w-full">
            <h1 className="text-[1.2rem]">Dịa chỉ nhận hàng</h1>
            <p
              className={`text-[0.9rem] font-normal ${
                isDarkMode ? "text-dark-400" : "text-light-300"
              }`}
            >
              Chọn địa chỉ nhận hàng của bạn
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col p-[10px] gap-[5px] ">
          {addresses.length > 0 ? (
            addresses?.map((address) => (
              <div
                key={address.address_id}
                className={`w-full flex  justify-between gap-[10px] px-[10px] py-[8px]  cursor-pointer rounded-[5px] border-[2px]  ${
                  isDarkMode ? "border-[2px] " : "border-dark-500 bg-dark-500"
                } ${
                  (!addressReceiverSelected?.address_id &&
                    address.address_id === addressIdSelected) ||
                  addressReceiverSelected?.address_id === address.address_id
                    ? "border-primary border-[2px]"
                    : ""
                }`}
                onClick={() => handleSelectAddressReceiver(address)}
              >
                <div className="w-full flex flex-col gap-[10px] font-nunito">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-[5px] text-[1rem]">
                      <div className="font-bold ">{address.receiver_name}</div>
                      <div className="font-bold">{address?.phone_number}</div>
                    </div>
                    <div
                      className="text-[0.8rem] text-blue-500 cursor-pointer"
                      onClick={() => handleOpenUpdateAddressModal(address)}
                    >
                      Cập nhật
                    </div>
                  </div>
                  <div className=" flex items-center gap-[5px] text-[0.9rem]">
                    <div className="">{address?.specific_address}</div>
                    <div className="">{address?.village_name}</div>
                    <div className="">{address?.district_name}</div>
                    <div className="">{address?.province_name}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full px-[10px] py-[10px] flex ">
              <div className="w-full flex items-center justify-center gap-[10px]">
                <span>Bạn chưa có địa chỉ</span>
              </div>
            </div>
          )}{" "}
          <div
            className={`w-full flex  justify-between gap-[10px] px-[10px] py-[8px]  cursor-pointer rounded-[5px] border-[2px]  ${
              isDarkMode ? "border-[2px] " : "border-dark-500 bg-dark-500"
            } }`}
          >
            <div className="w-full flex flex-col gap-[10px] font-nunito">
              <div
                className="w-full flex items-center justify-center cursor-pointer"
                onClick={() => setAddAddressModal(true)}
              >
                <span className="text-[0.8rem] cursor-pointer">
                  Thêm địa chỉ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-[10px] px-[10px] flex justify-end gap-[10px] border-t-[1px] text-[0.9rem] border-dashed">
          <div
            className="px-[40px] py-[5px] border-[1px] rounded-[5px] font-bold cursor-pointer"
            onClick={onCloseModal}
          >
            Thoát
          </div>
          <div
            className="px-[40px] py-[5px] bg-primary text-light-100 rounded-[5px] font-bold cursor-pointer"
            onClick={handleConfirmSelectAddressReceiver}
          >
            Xác nhận
          </div>
        </div>
      </div>
      {addAddressModal && (
        <AddUserAddressModal
          onCloseAddUserAddressModal={() => setAddAddressModal(false)}
        />
      )}
      {updateAddressModal && (
        <UpdateAddressModal
          address={updateAddressData}
          onCloseUpdateAddressModal={() => setUpdateAddressModal(false)}
        />
      )}
    </div>
  );
};

export default GetAddressReceiver;
