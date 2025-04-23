import React, { useState } from "react";
import LayoutModeBackground from "../../views/client/layout/LayoutModeBackground";
import { useTheme } from "../../Provider/ThemeProvider";

import { useNotify } from "../Notify/NotifyModal";

const Voucher = () => {
  const { isDarkMode } = useTheme();
  const { notifySuccess } = useNotify();
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      notifySuccess(`Đã sao chéo mã: ${code} Thành công`);
    });
  };

  return (
    <div className="w-full flex flex-col">
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
              <i className="fa-solid fa-ticket"></i>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="font-bold text-[1.2rem]">Kho voucher</h1>
              <p
                className={`font-normal text-[0.95rem] ${
                  isDarkMode ? " text-dark-300" : "text-light-300"
                }`}
              >
                Quản lý thông tin voucher của bạn
              </p>
            </div>
          </div>
        </div>
        <div className="w-full min-h-[500px] flex flex-wrap pr-[20px]  pb-[20px] overflow-y-auto">
          {vouchers.map((voucher, index) => (
            <div
              key={voucher.id}
              className={`voucher flex flex-col ml-[20px] mt-[20px] pb-[5px] rounded-[5px] ${
                isDarkMode
                  ? "bg-light-100 border-[1px] border-dashed"
                  : "bg-dark-400"
              }`}
            >
              <div className="w-full flex items-center justify-center p-[10px] ">
                <div
                  className={`w-full aspect-[16/6] flex items-center justify-center rounded-[5px] uppercase text-[1.6rem] font-black border-[1px] relative `}
                >
                  <span style={{ color: voucher.color }}>{voucher.type}</span>
                  <div className="absolute top-[5%] left-[3%] flex items-center justify-center font-bold text-[1.4rem] text-red-600 ">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex flex-col px-[10px]">
                <div className="w-full h-full font-nunito flex flex-col  justify-between gap-[10px] py-[5px]">
                  <div className="w-full h-full  flex flex-col justify-between gap-[8px]">
                    <div className="w-full ">
                      <h1 className="font-bold text-[0.9rem] line-clamp-2">
                        {voucher.name}
                      </h1>
                    </div>
                    <div className="text-[0.8rem] flex gap-[5px]">
                      <span>HSD:</span>
                      <span>{voucher.expiry}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {" "}
                    <div className="w-full text-[0.9rem]">
                      <div
                        className={`w-full flex items-center gap-[10px] px-[5px] py-[5px] ${
                          isDarkMode
                            ? "bg-dark-900 text-dark-100"
                            : "bg-dark-200 text-white"
                        } rounded-[5px]`}
                      >
                        <span className="text-[0.87rem]">Mã:</span>
                        <span className="flex-1 font-bold text-[0.9rem]">
                          {voucher.code}
                        </span>
                        <div
                          className="flex items-center justify-center px-[2px] py-[4px] cursor-pointer"
                          onClick={() => handleCopy(voucher.code)}
                        >
                          <i className="fa-solid fa-copy"></i>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center py-[5px] bg-primary text-white font-bold font-nunito rounded-[5px] text-[0.9rem] cursor-pointer">
                      Sử dụng
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Voucher;

const vouchers = [
  {
    id: 1,
    name: "Giảm giá 30% các mặt hàng thời trang",
    type: "discount",
    expiry: "03/03/2025 đến 15/03/2025",
    code: "JSUW12SDW3",
    color: "#E53935",
  },
  {
    id: 2,
    name: "Miễn phí vận chuyển cho đơn từ 200K",
    type: "freeship",
    expiry: "05/03/2025 đến 20/03/2025",
    code: "FREESHIP200",
    color: "#4CAF50",
  },
  {
    id: 3,
    name: "Giảm 50K cho đơn từ 500K",
    type: "discount",
    expiry: "10/03/2025 đến 25/03/2025",
    code: "DISCOUNT50",
    color: "#E53935",
  },
  {
    id: 4,
    name: "Giảm 15% khi mua đồ điện tử",
    type: "discount",
    expiry: "12/03/2025 đến 30/03/2025",
    code: "ELEC15OFF",
    color: "#E53935",
  },
  {
    id: 5,
    name: "Nhận 100K khi giới thiệu bạn bè",
    type: "reward",
    expiry: "01/03/2025 đến 31/03/2025",
    code: "REF100K",
    color: "#FFB300",
  },
  {
    id: 6,
    name: "Giảm 20% tất cả các sản phẩm nội thất",
    type: "discount",
    expiry: "08/03/2025 đến 18/03/2025",
    code: "HOME20OFF",
    color: "#E53935",
  },
  {
    id: 7,
    name: "Giảm 10% khi mua sách",
    type: "discount",
    expiry: "05/03/2025 đến 25/03/2025",
    code: "BOOKS10",
    color: "#E53935",
  },
  {
    id: 8,
    name: "Tặng quà khi mua hóa đơn trên 1 triệu",
    type: "gift",
    expiry: "07/03/2025 đến 22/03/2025",
    code: "GIFT1M",
    color: "#9C27B0",
  },
  {
    id: 9,
    name: "Giảm 70K cho đơn từ 700K",
    type: "discount",
    expiry: "09/03/2025 đến 29/03/2025",
    code: "DISCOUNT70",
    color: "#E53935",
  },
  {
    id: 10,
    name: "Giảm 5% khi mua thực phẩm",
    type: "discount",
    expiry: "06/03/2025 đến 28/03/2025",
    code: "FOOD5OFF",
    color: "#E53935",
  },
];
