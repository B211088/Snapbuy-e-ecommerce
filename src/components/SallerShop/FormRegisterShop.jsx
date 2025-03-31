import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../utils/client/Notify";
import InputField from "../Modal/InputField";
import LocationSelector from "../Modal/LocationSelector";
import Button from "../Modal/Button";
import { ToastContainer } from "react-toastify";
import { useShop } from "../../contexts/User/ShopContext";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/client/cropImage";
import ModalCrop from "../Modal/ModalCropImage";

const FormRegisterShop = () => {
  const {
    authState: { user },
    registerShop,
    sendCodeToEmail,
    confirmEmail,
  } = useAuth();

  const {
    shopState: { shopInfo, statusShop },
  } = useShop();
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();
  const [image, setImage] = useState(null);
  const [frontCccd, setFrontCccd] = useState(null);
  const [behindCccdPreview, setBehindCccdPreview] = useState(null);
  const [behindCccd, setBehindCccd] = useState(null);
  const [frontCccdPreview, setFrontCccdPreview] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null); // "front" hoặc "behind"
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [accessibility, setAccessibility] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [disabledEmail, setDisabledEmail] = useState(user.email ? true : false);
  const [buttonSendCode, setButtonSendCode] = useState(false);
  const [showInputCodeEmail, setShowInputCodeEmail] = useState(false);
  const [reSendCode, setReSendCode] = useState(false);
  const [textShowSendCodeEmail, setTextShowSendCodeEmail] =
    useState("Gửi mã xác nhận");
  const [dataConfirmEmail, setDataConfirmEmail] = useState({
    email: "",
    code: "",
  });

  const [localAddress, setLocalAddress] = useState({
    province: "",
    district: "",
    village: "",
  });

  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    villageId: parseInt(localAddress.village),
    specificAddress: "",
    phoneNumber: "",
    email: "",
  });

  const handleChangeAccessibility = (e) => {
    setAccessibility(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setCropImage(objectURL);
      setCropType(type);
      setIsCropOpen(true);
    }
  };

  const handleCropDone = async (croppedImage) => {
    const blob = await fetch(croppedImage).then((res) => res.blob());
    const file = new File([blob], `${cropType}.jpg`, { type: "image/jpeg" });

    if (cropType === "front") {
      const objectURL = URL.createObjectURL(file);
      setFrontCccd(file);
      setFrontCccdPreview(objectURL);
    } else {
      const objectURL = URL.createObjectURL(file);
      setBehindCccd(file);
      setBehindCccdPreview(objectURL);
    }
  };

  const startCountdown = () => {
    setTimer(120);
    setReSendCode(false);
    setDisabledEmail(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setReSendCode(true);
          setDisabledEmail(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendMail = async () => {
    if (!email) {
      notifyWarning("Vui lòng nhập địa chỉ email", 3000);
      return;
    }

    if (!isValidEmail(email)) {
      notifyWarning("Địa chỉ email không hợp lệ", 3000);
      return;
    }

    setTextShowSendCodeEmail("Đang gửi code");

    try {
      const response = await sendCodeToEmail(user.id, email);
      if (response.success) {
        setButtonSendCode(false);
        startCountdown();
        setShowInputCodeEmail(true);
        return;
      }
      notifyWarning(response.message || "Gửi mã xác nhận email thất bại", 3000);
    } catch (error) {
      notifyWarning(error.message || "Lỗi server");
    }
  };

  const handleConfirmEmail = async () => {
    if (!dataConfirmEmail.code) {
      notifyWarning("Vui lòng nhập mã xác nhận email", 3000);
      return;
    }

    try {
      const response = await confirmEmail(user.id, {
        email,
        code: parseInt(dataConfirmEmail.code),
      });

      if (response.success) {
        setFormData({
          ...formData,
          email: email,
        });
        notifySuccess("Xác nhận email thành công!", 3000);
        clearInterval(timerRef.current);
        setTimer(0);
        setShowInputCodeEmail(false);
        setButtonSendCode(false);
        setDisabledEmail(true);
        return;
      }
      notifyWarning(response.message || "Xác nhận email thất bại", 3000);
    } catch (error) {
      notifyWarning(error.message || "Lỗi server");
    }
  };

  const handleRegisterShop = async () => {
    if (!frontCccd || !behindCccd) {
      notifyWarning("Vui lòng tải lên cả hai ảnh CMND/CCCD!", 2000);
      return;
    }

    if (!formData.shopName || !formData.phoneNumber || !formData.email) {
      notifyWarning("Vui lòng điền đầy đủ thông tin cửa hàng!", 2000);
      return;
    }

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      form.append("frontCccd", frontCccd);
      form.append("behindCccd", behindCccd);

      const response = await registerShop(user.id, form);
      if (response.success) {
        notifySuccess("Đăng ký shop thành công!", 3000);
      } else {
        notifyWarning(response.message, 3000);
      }
    } catch (error) {
      notifyError("Đã xảy ra lỗi khi đăng ký shop!", 3000);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      villageId: parseInt(localAddress.village),
      email: user.email ? user.email : email,
    }));
  }, [localAddress.village]);

  const isValidEmail = (email) => {
    return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  useEffect(() => {
    if (user?.email) {
      setButtonSendCode(true);
      return;
    }

    if (isValidEmail(email)) {
      setButtonSendCode(true);
    } else {
      setButtonSendCode(false);
    }
  }, [email]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-[40px]">
      <ToastContainer />
      <div
        className={`pc:w-[35%] pc:max-w-[600px] pc:min-w-[400px] mb:w-full flex flex-col items-center ${
          isDarkMode
            ? "bg-light-100 text-dark-100 "
            : "bg-dark-200 text-light-100"
        } rounded-[5px] py-[20px]`}
      >
        <div className="w-full px-[20px] py-[10px] flex flex-col gap-[5px] border-b-[1px] border-dashed">
          <h1 className="font-nunito font-black text-[1.9rem] text-primary">
            Đăng ký shop
          </h1>
          <p className="   ">
            Điền đầy đủ thông tin để trở thành người bán hàng trên shoppe
          </p>
        </div>
        <div className="w-full py-[20px] flex flex-col gap-[20px] border-b-[1px] border-dashed px-[20px]">
          <div className="flex items-center gap-[5px] font-nunito font-bold text-red-600 ">
            <div className="w-[28px] h-[28px] rounded-full border-[1px] border-dark-300 flex items-center justify-center text-[0.75rem]">
              <i className="fa-solid fa-store"></i>
            </div>
            <span className="text-[0.85rem]">Thông tin Shop</span>
          </div>
          <form className="flex items-center ">
            <InputField
              payload={{
                type: "text",
                placeholder: "Nhập tên shop của bạn",
                name: "shopName",
                value: formData.shopName,
              }}
              onChange={handleChange}
            />
          </form>
          <div className="flex items-center">
            <InputField
              payload={{
                type: "text",
                placeholder: "Nhập mô tả shop của bạn",
                name: "description",
                value: formData.description,
              }}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col ">
            <div className="pc:w-3/12 mb:w-full flex mt-[5px] truncate mb:pb-[10px] text-[0.9rem] pb-[10px]">
              <span>Địa chỉ lấy hàng</span>
            </div>
            <div className="flex-1">
              <LocationSelector
                localAddress={localAddress}
                onChange={setLocalAddress}
              />
            </div>
          </div>
          <div className="flex ">
            <textarea
              className={`flex-1 min-h-[100px] max-h-[100px] outline-none rounded-[5px] px-[10px] py-[5px] text-[0.9rem] ${
                isDarkMode ? "bg-light-100 border-[1px]" : "bg-dark-400 "
              }`}
              id=""
              type="text"
              placeholder="Nhập địa chỉ chi tiết  của bạn"
              name="specificAddress"
              onChange={handleChange}
              value={formData.specificAddress}
            ></textarea>
          </div>
          <div className="flex items-center">
            <InputField
              payload={{
                type: "email",
                placeholder: "Nhập địa chỉ email của bạn",
                value: email,
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
            {buttonSendCode && (
              <div
                className="flex items-center font-nunito text-[0.8rem] px-[5px] cursor-pointer hover:text-blue-500"
                onClick={handleSendMail}
              >
                <span>{textShowSendCodeEmail}</span>
              </div>
            )}

            {reSendCode && (
              <div
                className="flex items-center font-nunito text-[0.8rem] px-[5px] cursor-pointer hover:text-blue-500"
                onClick={handleSendMail}
              >
                <span>gửi lại mã</span>
              </div>
            )}

            {timer > 0 && (
              <div
                className="flex items-center font-nunito text-[0.8rem] px-[5px] cursor-pointer hover:text-blue-500"
                onClick={handleSendMail}
              >
                <span>Mã hết hạn sau: {timer}</span>
              </div>
            )}
          </div>
          {showInputCodeEmail && (
            <div className="flex items-center gap-[10px]">
              <div
                className={`w-7/12  rounded-[5px] py-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400"
                }`}
              >
                <input
                  className="w-full outline-none border-none bg-transparent text-[0.9rem] px-[10px]"
                  type="number"
                  maxLength={6}
                  name=""
                  onChange={(e) =>
                    setDataConfirmEmail({
                      ...dataConfirmEmail,
                      code: e.target.value,
                    })
                  }
                />
              </div>
              <button
                className="flex flex-1 items-center justify-center font-nunito text-[0.8rem] cursor-pointer bg-primary py-[8px] px-[20px] rounded-[5px]"
                onClick={handleConfirmEmail}
              >
                <span>Xác nhận</span>
              </button>
            </div>
          )}
          <div className="flex items-center">
            <InputField
              payload={{
                type: "tel",
                placeholder: "Nhập số điện thoại của bạn",
                name: "phoneNumber",
                value: formData.phoneNumber,
              }}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="w-full">Mặt trước CCCD/CMND</h1>
            <label
              htmlFor="front-upload"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg py-[20px] cursor-pointer transition duration-300"
            >
              <span className="text-sm text-gray-500">Thêm ảnh CMND/CCCD</span>
              <input
                id="front-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "front")}
                className="hidden"
              />
            </label>
            {frontCccd && (
              <div className="w-full p-[20px]">
                <img
                  src={frontCccdPreview}
                  alt="Front CCCD"
                  className="w-full rounded-[5px]"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <h1 className="w-full">Mặt sau CCCD/CMND</h1>
            <label
              htmlFor="behind-upload"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg py-[20px] cursor-pointer transition duration-300"
            >
              <span className="text-sm text-gray-500">Thêm ảnh CMND/CCCD</span>
              <input
                id="behind-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "behind")}
                className="hidden"
              />
            </label>
            {behindCccd && (
              <div className="w-full p-[20px]">
                <img
                  src={behindCccdPreview}
                  alt="Behind CCCD"
                  className="w-full rounded-[5px]"
                />
              </div>
            )}
          </div>

          {isCropOpen && (
            <ModalCrop
              image={cropImage}
              onClose={() => setIsCropOpen(false)}
              onCropDone={handleCropDone}
            />
          )}

          <div className="flex gap-[5px] ">
            <div className="">
              <input
                className="outline-none bg-transparent"
                type="checkbox"
                name="accessibility"
                onChange={handleChangeAccessibility}
                checked={accessibility}
              />
            </div>
            <span className="text-[0.8rem] font-nunito font-normal mt-[2px]">
              Bạn có đồng ý với{" "}
              <a className="text-blue-600 font-bold" href="">
                chính sách
              </a>{" "}
              và{" "}
              <a className="text-blue-600 font-bold" href="">
                điều khoản sử dụng
              </a>{" "}
              của chúng tôi
            </span>
          </div>
          <div className="w-full flex flex-col items-center gap-[15px] mt-[20px]">
            <Button onClick={handleRegisterShop}>
              <span>Xác nhận</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRegisterShop;
