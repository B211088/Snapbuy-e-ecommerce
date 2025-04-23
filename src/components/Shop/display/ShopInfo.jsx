import React, { useState } from "react";
import { useShop } from "../../../contexts/User/ShopContext";
import { useTheme } from "../../../Provider/ThemeProvider";
import UpdateInfoShopModal from "../../Modal/UpdateInfoShopModal";

const ShopInfo = () => {
  const {
    shopState: { shopInfo },
  } = useShop();
  const { isDarkMode } = useTheme();
  console.log({ shopInfo });
  const [showModalUpdateInfoShop, setShowModalUpdateInfoShop] = useState(false);

  if (!shopInfo) {
    return (
      <div
        className={`w-full p-6 rounded-[5px] ${
          isDarkMode
            ? "bg-light-100 text-dark-100"
            : "bg-dark-200 text-light-100"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Thông tin cửa hàng</h2>
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-[5px]">
          Chưa có thông tin cửa hàng. Vui lòng hoàn thiện hồ sơ cửa hàng của
          bạn.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[5px] overflow-hidden ${
        isDarkMode
          ? "bg-light-100 text-dark-100"
          : "bg-dark-200 text-light-100 "
      }`}
    >
      {showModalUpdateInfoShop && (
        <UpdateInfoShopModal
          onCloseUpdateInfoUserModal={() => setShowModalUpdateInfoShop(false)}
        />
      )}
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
            <h1 className="font-bold text-[1.2rem]">Thông tin shop</h1>
            <p
              className={`font-normal text-[0.95rem] ${
                isDarkMode ? " text-dark-300" : "text-light-300"
              }`}
            >
              Quản lý thông tin hồ sơ của shop
            </p>
          </div>{" "}
        </div>
        <div
          className={`w-full flex  pc:justify-end font-normal text-[1rem] mb:py-[10px]`}
        >
          <div className=" flex items-center justify-center  gap-[7px] truncate rounded-[5px]  text-dark-1000  border-[1px] border-dark-700  p-[3px] cursor-pointer">
            <div
              className="w-full flex items-center justify-center gap-[5px] px-[20px] py-[5px]  rounded-[4px] bg-primary"
              onClick={() => setShowModalUpdateInfoShop(true)}
            >
              <span className="font-bold text-[0.8rem] uppercase">
                Cập nhật thông tin
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Shop Logo */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div
              className={`w-48 h-48 rounded-full overflow-hidden border-2 mb-4 ${
                isDarkMode ? "border-dark-100" : "border-light-300"
              }`}
            >
              {shopInfo.logo ? (
                <img
                  src={
                    shopInfo.logo.startsWith("http")
                      ? shopInfo.logo
                      : `/${shopInfo.logo}`
                  }
                  alt={shopInfo.shop_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-4xl font-bold ${
                    isDarkMode
                      ? "bg-light-100 text-light-700"
                      : "bg-light-300 text-dark-700 "
                  }`}
                >
                  {shopInfo.shop_name?.charAt(0).toUpperCase() || "S"}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-center">
              {shopInfo.shop_name}
            </h3>
          </div>

          {/* Shop Details */}
          <div className="w-full md:w-2/3">
            <div
              className={`p-5 rounded-[5px] mb-6  border ${
                isDarkMode ? "bg-light-100 " : "bg-dark-300 border-transparent "
              }`}
            >
              <h3 className="text-lg font-bold mb-3">Thông tin chung</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-500 "
                    }`}
                  >
                    Tên cửa hàng
                  </p>
                  <p className="font-medium">{shopInfo.shop_name}</p>
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-500"
                    }`}
                  >
                    Số điện thoại
                  </p>
                  <p className="font-medium">{shopInfo.phone_number}</p>
                </div>

                <div className="md:col-span-2">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-500"
                    }`}
                  >
                    Mô tả
                  </p>
                  <p className="font-medium">{shopInfo.description}</p>
                </div>

                <div className="md:col-span-2">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-500"
                    }`}
                  >
                    Ngày tạo
                  </p>
                  <p className="font-medium">
                    {new Date(shopInfo.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-[5px] border ${
                isDarkMode
                  ? "bg-light-100 text-light-1000"
                  : "bg-dark-300 text-dark-1000 border-transparent"
              }`}
            >
              <h3 className="text-lg font-bold mb-3">Địa chỉ cửa hàng</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-100"
                    }`}
                  >
                    Địa chỉ cụ thể
                  </p>
                  <p className="font-medium">{shopInfo.specific_address}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-dark-500" : "text-light-100"
                      }`}
                    >
                      Phường/Xã
                    </p>
                    <p className="font-medium">
                      {shopInfo.address_response?.village_name}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-dark-500" : "text-light-100"
                      }`}
                    >
                      Quận/Huyện
                    </p>
                    <p className="font-medium">
                      {shopInfo.address_response?.district_name}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-dark-500" : "text-light-100"
                      }`}
                    >
                      Tỉnh/Thành phố
                    </p>
                    <p className="font-medium">
                      {shopInfo.address_response?.province_name}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-dark-500" : "text-light-100"
                    }`}
                  >
                    Địa chỉ đầy đủ
                  </p>
                  <p className="font-medium">
                    {shopInfo.specific_address},{" "}
                    {shopInfo.address_response?.village_name},{" "}
                    {shopInfo.address_response?.district_name},{" "}
                    {shopInfo.address_response?.province_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
