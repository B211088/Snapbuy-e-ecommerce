import React, { useState, useEffect, useContext } from "react";
import ModalContainer from "./ModalContainer";

import { useTheme } from "../../Provider/ThemeProvider";
import InputField from "./InputField";
import Button from "./Button";
import { AuthContext, useAuth } from "../../contexts/User/AuthContext";
import { useAddress } from "../../contexts/User/AddressContext";

import { ToastContainer } from "react-toastify";
import LocationSelector from "./LocationSelector";
import { useNotify } from "../Notify/NotifyModal";

const AddUserAddressModal = ({ onCloseAddUserAddressModal, onSuccess }) => {
  const {
    authState: { user },
  } = useAuth();

  const { addAddressReceiver } = useAddress();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const [localAddress, setLocalAddress] = useState({
    province: "",
    district: "",
    village: "",
  });

  const [formData, setFormData] = useState({
    user_id: user.id,
    village_id: "",
    specific_address: "",
    receiver_name: "",
    phone_number: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      village_id: parseInt(localAddress.village),
    }));
  }, [localAddress.village]);

  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAddress = async () => {
    const { receiver_name, phone_number, specific_address, village_id } =
      formData;

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;

    if (!receiver_name) {
      notifyWarning("Vui lòng nhập tên người nhận!");
      return;
    }

    if (!phone_number) {
      notifyWarning("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!phoneRegex.test(phone_number)) {
      notifyWarning("Số điện thoại không đúng định dạng!");
      return;
    }

    if (!village_id) {
      notifyWarning("Vui lòng chọn xã, phường, quận!");
      return;
    }

    if (!specific_address) {
      notifyWarning("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    try {
      const response = await addAddressReceiver(formData);
      if (response.success) {
        onCloseAddUserAddressModal();
        onSuccess("Thêm địa chỉ thành công");
      } else notifyWarning("Thêm địa chỉ không thành công!", 3000, isDarkMode);
    } catch (error) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại sau!", 3000, isDarkMode);
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseAddUserAddressModal}>
      <div
        className={`w-full flex flex-col gap-[2px] pt-[10px] pb-[15px] px-[30px] border-b-[1px] border-dashed `}
      >
        <h1 className="font-nunito font-bold text-[1.5rem]">
          <span>Thêm địa chỉ giao hàng </span>
        </h1>
        <p className="text-[0.9rem] ">
          Nhập và bấm xác nhận để lưu địa chỉ giao hàng của bạn
        </p>
      </div>
      <div
        className={`w-full flex flex-col gap-[20px] py-[20px] px-[30px] font-nunito text-[0.95rem]  `}
      >
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập tên người nhận hàng",
            name: "receiver_name",
            value: formData.receiver_name,
            required: true,
          }}
          onChange={handleChange}
        />
        <InputField
          payload={{
            type: "tel",
            placeholder: "Nhập số điện thoại nhận hàng",
            name: "phone_number",
            value: formData.phone_number,
            required: true,
          }}
          onChange={handleChange}
        />
        <div className="flex flex-col    gap-[20px]">
          <div className="w-3/12 min-w-3/12   truncate font-bold ">Địa chỉ</div>
          <div className=" rounded-[5px] text-[0.9rem]">
            <LocationSelector
              localAddress={localAddress}
              onChange={setLocalAddress}
            />
          </div>
        </div>
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập địa chỉ chi tiết",
            name: "specific_address",
            value: formData.specific_address,
          }}
          onChange={handleChange}
        />

        <div className="w-full flex flex-col items-center gap-[15px] mt-[20px]">
          <Button onClick={handleAddAddress}>
            <span>Lưu</span>
          </Button>
          <button
            className={`w-full py-[5px] border-[1px] rounded-[5px] font-bold ${
              isDarkMode
                ? "border-[#141414]  bg-white text-dark-100 "
                : " text-white bg-dark-400 border-none"
            }`}
            onClick={onCloseAddUserAddressModal}
          >
            Hủy
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default AddUserAddressModal;
