import { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import ModalContainer from "./ModalContainer";
import InputField from "./InputField";
import SelectField from "./SelectField";
import DateField from "./DateField";
import Button from "./Button";
import { useNotify } from "../Notify/NotifyModal";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_TOKEN_NAME } from "../../contexts/contants";
import { useShop } from "../../contexts/User/ShopContext";
import LocationSelector from "./LocationSelector";

const UpdateInfoShopModal = ({ onCloseUpdateInfoUserModal }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const {
    authState: { user },
  } = useAuth();

  const {
    shopState: { shopInfo },
    updateShopInfo,
  } = useShop();

  const [localAddress, setLocalAddress] = useState({
    province: shopInfo.address_response?.province_id,
    district: shopInfo.address_response?.district_id,
    village: shopInfo.address_response?.village_id,
  });

  const [formData, setFormData] = useState({
    shop_name: "",
    description: "",
    village_id: "",
    specific_address: "",
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      shop_name: shopInfo.shop_name,
      description: shopInfo.description,
      village_id: shopInfo.address_response?.village_id,
      specific_address: shopInfo.specific_address,
      phone_number: "",
      email: "",
    });
  }, [user, shopInfo]);

  console.log({ formData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUserInfo = async () => {
    try {
      const response = await updateShopInfo(user?.id, formData);
      if (response.success) {
        notifySuccess("Cập nhật thông tin thành công");
        onCloseUpdateInfoUserModal();
        return;
      }
      notifyWarning(response.message);
      return;
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <ModalContainer onCloseModal={onCloseUpdateInfoUserModal}>
      <div
        className={`w-full flex flex-col gap-[2px] pt-[10px] pb-[15px] px-[30px] border-b-[1px] border-dashed `}
      >
        <h1 className="font-nunito font-bold text-[1.2rem] ">
          <span>Cập nhật thông tin shop</span>
        </h1>
        <p className="text-[0.9rem] ">
          Nhập và bấm xác nhận để cập nhật thông tin của bạn
        </p>
      </div>
      <div
        className={`w-full flex flex-col gap-[20px] py-[20px] px-[30px] font-nunito text-[0.95rem]  `}
      >
        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập tên shop",
            name: "shop_name",
            value: formData.shop_name,
          }}
          onChange={handleChange}
        />

        <InputField
          payload={{
            type: "text",
            placeholder: "Nhập mô tả shop",
            name: "description",
            value: formData.description,
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
          <Button onClick={handleUpdateUserInfo}>
            <span>Cập nhật</span>
          </Button>
          <button
            className={`w-full py-[5px] border-[1px] rounded-[5px] font-bold ${
              isDarkMode
                ? "border-[#141414]  bg-white text-dark-100 "
                : " text-white bg-dark-400 border-none"
            }`}
            onClick={onCloseUpdateInfoUserModal}
          >
            Hủy
          </button>
        </div>
      </div>{" "}
    </ModalContainer>
  );
};

export default UpdateInfoShopModal;
