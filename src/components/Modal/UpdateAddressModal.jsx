import { useContext, useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAddress } from "../../contexts/User/AddressContext";
import Button from "./Button";
import LocationSelector from "./LocationSelector";
import InputField from "./InputField";
import { AuthContext } from "../../contexts/User/AuthContext";
import { useNotify } from "../Notify/NotifyModal";

const UpdateAddressModal = ({
  address,
  onCloseUpdateAddressModal,
  onSuccess,
}) => {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { updateAddressReceiver } = useAddress();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const [localAddress, setLocalAddress] = useState({
    province: address?.province_id,
    district: address?.district_id,
    village: address?.village_id,
  });

  console.log("updateaddress", address);

  const [formData, setFormData] = useState({
    user_id: user?.id,
    village_id: localAddress.village,
    specific_address: address?.specific_address,
    receiver_name: address?.receiver_name,
    phone_number: address?.phone_number,
  });

  console.log("update address data", formData);

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

  const handleUpdateAddress = async () => {
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

    if (!specific_address) {
      notifyWarning("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    if (!village_id) {
      notifyWarning("Vui lòng chọn xã, phường, quận!");
      return;
    }

    try {
      const response = await updateAddressReceiver(
        address.address_id,
        formData
      );
      if (response.success) {
        notifySuccess("Cập nhật địa chỉ thành công");
        onCloseUpdateAddressModal();
        return;
      }
      notifyWarning("Thêm địa chỉ không thành công!", 3000, isDarkMode);
      return;
    } catch (error) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại sau!", 3000, isDarkMode);
    }
  };
  return (
    <ModalContainer onCloseModal={onCloseUpdateAddressModal}>
      <div
        className={`w-full flex flex-col gap-[2px] py-[20px] px-[30px] border-b-[1px] border-dashed `}
      >
        <h1 className="font-nunito font-bold text-[1.5rem]">
          <span>Chỉnh sửa địa chỉ giao hàng </span>
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
          <Button onClick={handleUpdateAddress}>
            <span>Lưu</span>
          </Button>
          <button
            className={`w-full py-[5px] border-[1px] rounded-[5px] font-bold ${
              isDarkMode
                ? "border-[#141414]  bg-white text-dark-100 "
                : " text-white bg-dark-400 border-none"
            }`}
            onClick={onCloseUpdateAddressModal}
          >
            Hủy
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default UpdateAddressModal;
