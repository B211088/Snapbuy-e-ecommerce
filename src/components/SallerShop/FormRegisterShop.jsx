import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import { useNotify } from "../../components/Notify/NotifyModal";
import InputField from "../Modal/InputField";
import LocationSelector from "../Modal/LocationSelector";
import Button from "../Modal/Button";
import { ToastContainer } from "react-toastify";
import ModalCrop from "../Modal/ModalCropImage";
import Loading from "../../views/client/pages/Loading";

// Khai báo đường dẫn cho model Teachable Machine
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/tWBZuCvmo/";
const tfjsScript =
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
const tmImageScript =
  "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

const FormRegisterShop = () => {
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const {
    authState: { user },
    registerShop,
    sendCodeToEmail,
    confirmEmail,
  } = useAuth();

  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [frontCccd, setFrontCccd] = useState(null);
  const [behindCccdPreview, setBehindCccdPreview] = useState(null);
  const [behindCccd, setBehindCccd] = useState(null);
  const [frontCccdPreview, setFrontCccdPreview] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null);
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

  // Lưu trữ file ảnh tạm thời trước khi phân tích
  const [tempImageFile, setTempImageFile] = useState(null);

  // Thêm state cho logo shop
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  // Thêm state cho tỷ lệ crop ảnh logo
  const [cropAspectRatio, setCropAspectRatio] = useState(null);

  // Trạng thái cho model
  const [model, setModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

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
    logo: null, // Thêm trường logo vào formData
  });

  // Tải model Teachable Machine khi component mount
  useEffect(() => {
    loadModel();
  }, []);

  // Hàm tải script và model
  const loadScripts = () => {
    return new Promise((resolve) => {
      if (window.tmImage) {
        resolve();
        return;
      }

      const script1 = document.createElement("script");
      script1.src = tfjsScript;
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src = tmImageScript;
        script2.onload = resolve;
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    });
  };

  const loadModel = async () => {
    try {
      setLoading(true);
      await loadScripts();
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";
      const loadedModel = await window.tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setIsModelLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải model:", error);
      notifyError("Không thể tải model nhận dạng CCCD!", 3000);
      setLoading(false);
    }
  };

  // Hàm phân tích ảnh sử dụng model
  const analyzeImage = async (imageElement) => {
    if (!model) {
      notifyWarning("Model nhận dạng chưa được tải!", 3000);
      return null;
    }

    try {
      const predictions = await model.predict(imageElement);

      // Sắp xếp predictions theo xác suất cao nhất
      const sortedPredictions = [...predictions].sort(
        (a, b) => b.probability - a.probability
      );

      // Lấy kết quả cao nhất
      const topPrediction = sortedPredictions[0];

      console.log("Kết quả nhận dạng:", sortedPredictions);

      // Chỉ chấp nhận nếu độ tin cậy trên 70%
      if (topPrediction.probability > 0.7) {
        return {
          className: topPrediction.className,
          probability: topPrediction.probability,
        };
      } else if (
        topPrediction.probability > 0.4 &&
        topPrediction.className === "blurryphoto"
      ) {
        return {
          className: "blurryphoto",
          probability: topPrediction.probability,
        };
      } else {
        return {
          className: "anotherentity",
          probability: topPrediction.probability,
        };
      }
    } catch (error) {
      console.error("Lỗi khi phân tích ảnh:", error);
      return null;
    }
  };

  const handleChangeAccessibility = (e) => {
    setAccessibility(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler xử lý tải lên logo shop
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    setCropImage(objectURL);
    setCropType("logo");
    // Thiết lập tỷ lệ crop 1:1 cho logo
    setCropAspectRatio(1);
    setIsCropOpen(true);
  };

  // Sửa đổi để cho phép crop trước, rồi validate sau
  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Lưu loại ảnh và file tạm thời
    setTempImageFile(file);
    setCropType(type);

    // Tạo URL cho ảnh crop
    const objectURL = URL.createObjectURL(file);
    setCropImage(objectURL);

    // Thiết lập tỷ lệ crop cho CCCD
    setCropAspectRatio(16 / 10);

    // Mở modal crop
    setIsCropOpen(true);
  };

  // Xử lý khi crop xong
  const handleCropDone = async (croppedImage) => {
    const blob = await fetch(croppedImage).then((res) => res.blob());
    const file = new File([blob], `${cropType}.jpg`, { type: "image/jpeg" });

    if (cropType === "front" || cropType === "behind") {
      // Cho CCCD/CMND, phân tích ảnh sau khi crop
      validateIdCard(file, cropType);
    } else if (cropType === "logo") {
      // Xử lý ảnh logo sau khi crop (không cần phân tích)
      const objectURL = URL.createObjectURL(file);
      setLogo(file);
      setLogoPreview(objectURL);
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  // Hàm mới để phân tích ảnh CCCD sau khi đã crop
  const validateIdCard = async (file, type) => {
    if (!isModelLoaded) {
      notifyWarning("Model nhận dạng đang tải, vui lòng thử lại sau!", 3000);
      return;
    }

    setProcessingImage(true);

    try {
      // Tạo đối tượng Image để phân tích
      const img = new Image();
      const objectURL = URL.createObjectURL(file);
      img.src = objectURL;

      img.onload = async () => {
        // Phân tích ảnh
        const result = await analyzeImage(img);

        if (!result) {
          notifyWarning("Không thể phân tích ảnh, vui lòng thử lại!", 3000);
          setProcessingImage(false);
          return;
        }

        if (result.className === "blurryphoto") {
          notifyWarning("Ảnh quá mờ, vui lòng chụp lại ảnh rõ nét hơn!", 3000);
          setProcessingImage(false);
          return;
        }

        // Kiểm tra kết quả phù hợp với loại ảnh
        const isValidFront =
          type === "front" && result.className === "frontcccd";
        const isValidBehind =
          type === "behind" && result.className === "behindcccd";

        if (isValidFront || isValidBehind) {
          // Ảnh hợp lệ, lưu lại
          if (type === "front") {
            setFrontCccd(file);
            setFrontCccdPreview(objectURL);
            notifySuccess("Xác thực thành công mặt trước CCCD!", 3000);
          } else if (type === "behind") {
            setBehindCccd(file);
            setBehindCccdPreview(objectURL);
            notifySuccess("Xác thực thành công mặt sau CCCD!", 3000);
          }
        } else {
          // Hiển thị thông báo tùy theo loại lỗi
          if (type === "front" && result.className === "behindcccd") {
            notifyWarning(
              "Đây là mặt sau CCCD. Vui lòng tải lên mặt trước CCCD!",
              3000
            );
          } else if (type === "behind" && result.className === "frontcccd") {
            notifyWarning(
              "Đây là mặt trước CCCD. Vui lòng tải lên mặt sau CCCD!",
              3000
            );
          } else {
            notifyWarning(
              `Ảnh không hợp lệ, vui lòng tải lên đúng ảnh CCCD ${
                type === "front" ? "mặt trước" : "mặt sau"
              }!`,
              3000
            );
          }
        }

        setProcessingImage(false);
      };

      img.onerror = () => {
        notifyWarning("Không thể đọc file ảnh!", 3000);
        setProcessingImage(false);
      };
    } catch (error) {
      console.error("Lỗi xử lý ảnh:", error);
      notifyError("Đã xảy ra lỗi khi xử lý ảnh!", 3000);
      setProcessingImage(false);
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
    setLoading(true);
    if (!frontCccd || !behindCccd) {
      notifyWarning("Vui lòng tải lên cả hai ảnh CMND/CCCD!", 2000);
      setLoading(false);
      return;
    }

    if (!formData.shopName || !formData.phoneNumber || !formData.email) {
      notifyWarning("Vui lòng điền đầy đủ thông tin cửa hàng!", 2000);
      setLoading(false);
      return;
    }

    if (!logo) {
      notifyWarning("Vui lòng tải lên ảnh đại diện cho Shop!", 2000);
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "logo") {
          // Xử lý logo riêng
          form.append(key, value);
        }
      });

      form.append("frontCccd", frontCccd);
      form.append("behindCccd", behindCccd);
      form.append("logo", logo);

      const response = await registerShop(user.id, form);
      if (response.success) {
        notifySuccess("Đăng ký shop thành công!", 3000);
        setLoading(false);

        return;
      } else {
        notifyWarning(response.message, 3000);
        setLoading(false);
        return;
      }
    } catch (error) {
      notifyError("Đã xảy ra lỗi khi đăng ký shop!", 3000);
      setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col items-center py-[40px]">
      <ToastContainer />
      <div
        className={`pc:w-[90%] mb:w-full flex flex-col items-center font-nunito ${
          isDarkMode
            ? "bg-light-100 text-dark-100 "
            : "bg-dark-200 text-light-100"
        } rounded-[5px] py-[20px]`}
      >
        <div className="w-full px-[20px] py-[10px] flex flex-col gap-[5px] border-b-[1px] border-dashed">
          <h1 className="font-nunito font-black text-[1.9rem] text-primary">
            Đăng ký shop
          </h1>
          <p className="">
            Điền đầy đủ thông tin để trở thành người bán hàng trên shoppe
          </p>
        </div>
        <div className="w-full py-[20px] flex flex-col gap-[20px] border-b-[1px] border-dashed px-[20px]">
          {" "}
          <div className="flex items-center gap-[5px] font-nunito font-bold text-red-600 ">
            <div className="w-[28px] h-[28px] rounded-full border-[1px] border-dark-300 flex items-center justify-center text-[0.75rem]">
              <i className="fa-solid fa-store"></i>
            </div>
            <span className="text-[0.85rem]">Thông tin Shop</span>
          </div>
          <div className="w-full flex mb:flex-col gap-[20px]">
            <div className="pc:w-6/12 mb:w-full flex flex-col gap-[20px]">
              <div className="flex items-center ">
                <InputField
                  payload={{
                    type: "text",
                    placeholder: "Nhập tên shop của bạn",
                    name: "shopName",
                    value: formData.shopName,
                  }}
                  onChange={handleChange}
                />
              </div>
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
                  placeholder="Nhập địa chỉ chi tiết của bạn"
                  name="specificAddress"
                  onChange={handleChange}
                  value={formData.specificAddress}
                ></textarea>
              </div>
            </div>
            <div className="pc:w-6/12 mb:w-full flex flex-col gap-[20px]">
              <div className="flex items-center">
                <InputField
                  payload={{
                    type: "email",
                    name: "email",
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

                {timer === 0 && reSendCode && (
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
                      type="phone"
                      inputMode="numeric"
                      maxLength={6}
                      value={dataConfirmEmail.code}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          setDataConfirmEmail({
                            ...dataConfirmEmail,
                            code: value,
                          });
                        }
                      }}
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
              </div>{" "}
              <div className="w-full flex flex-col items-center">
                <h1 className="w-full text-[0.9rem]">Ảnh đại diện Shop</h1>
                <label
                  htmlFor="logo-upload"
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed ${"border-gray-400 hover:border-blue-500"} rounded-lg py-[20px] cursor-pointer transition duration-300`}
                >
                  <span className="text-[0.9rem] text-gray-500">
                    Thêm ảnh đại diện Shop
                  </span>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <div className="w-full py-[10px] flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo Shop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Thêm phần tải lên avatar Shop */}
          <div className="w-full flex mb:flex-col gap-[20px] ">
            <div className="pc:w-6/12 mb:w-full flex flex-col items-center">
              <h1 className="w-full text-[0.9rem]">Mặt trước CCCD/CMND</h1>
              <label
                htmlFor="front-upload"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed ${
                  processingImage && cropType === "front"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-400 hover:border-blue-500"
                } rounded-lg py-[20px] cursor-pointer transition duration-300`}
              >
                {processingImage && cropType === "front" ? (
                  <span className="text-[0.9rem] text-yellow-600">
                    Đang xử lý ảnh...
                  </span>
                ) : (
                  <span className="text-[0.9rem] text-gray-500">
                    Thêm ảnh mặt trước CMND/CCCD
                  </span>
                )}
                <input
                  id="front-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "front")}
                  className="hidden"
                  disabled={processingImage}
                />
              </label>
              {frontCccd && (
                <div className="w-full py-[20px] px-[100px]">
                  <img
                    src={frontCccdPreview}
                    alt="Front CCCD"
                    className="w-full rounded-[5px]"
                  />
                </div>
              )}
            </div>
            <div className="pc:w-6/12 mb:w-full flex flex-col items-center">
              <h1 className="w-full text-[0.9rem]">Mặt sau CCCD/CMND</h1>
              <label
                htmlFor="behind-upload"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed ${
                  processingImage && cropType === "behind"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-400 hover:border-blue-500"
                } rounded-lg py-[20px] cursor-pointer transition duration-300`}
              >
                {processingImage && cropType === "behind" ? (
                  <span className="text-[0.9rem] text-yellow-600">
                    Đang xử lý ảnh...
                  </span>
                ) : (
                  <span className="text-[0.9rem] text-gray-500">
                    Thêm ảnh mặt sau CMND/CCCD
                  </span>
                )}
                <input
                  id="behind-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "behind")}
                  className="hidden"
                  disabled={processingImage}
                />
              </label>
              {behindCccd && (
                <div className="w-full py-[20px] px-[100px]">
                  <img
                    src={behindCccdPreview}
                    alt="Behind CCCD"
                    className="w-full rounded-[5px]"
                  />
                </div>
              )}
            </div>
          </div>
          {isCropOpen && (
            <ModalCrop
              image={cropImage}
              onClose={() => setIsCropOpen(false)}
              onCropDone={handleCropDone}
              aspectRatio={cropAspectRatio}
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
              Bạn có đồng ý với
              <span className="text-primary">điều khoản & dịch vụ</span> của
              chúng tôi không?
            </span>
          </div>
        </div>
        <div className="w-full flex justify-end px-[20px] py-[20px]">
          <button
            onClick={handleRegisterShop}
            disabled={!accessibility}
            className={`w-full bg-primary text-light-100 py-[8px] font-bold rounded-[5px] ${
              !accessibility ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormRegisterShop;
