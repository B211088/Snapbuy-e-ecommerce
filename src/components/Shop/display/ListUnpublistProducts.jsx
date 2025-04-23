import React from "react";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useAppData } from "../../../contexts/client/AppDataContext";

const ListUnpublistProducts = () => {
  const { isDarkMode } = useTheme();
  const {
    categoriesState: { categories },
  } = useAppData();
  return (
    <div className="w-full flex flex-col px-[20px]">
      <div className="w-full flex gap-[10px] py-[10px]">
        <div className="w-8/12 flex items-center gap-[10px] text-[0.9rem]">
          <div className="w-3/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
            <select
              className="w-full bg-transparent outline-none"
              name=""
              id=""
            >
              <option value="">Nghành hàng</option>
              {categories ? (
                categories.map((cat) => {
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  );
                })
              ) : (
                <option value="">Nghành hàng</option>
              )}
            </select>
          </div>
          <div className="w-3/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
            <select
              className="w-full bg-transparent outline-none"
              name=""
              id=""
            >
              <option value="">Loại sản phẩm</option>
            </select>
          </div>
          <div className="w-2/12 flex items-center gap-[5px] font-nunito font-bold text-[0.9rem] truncate">
            <span> {listProducts.length}</span> <span>Sản phẩm</span>
          </div>
        </div>
        <div className="w-4/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
          <input
            className="flex-1 outline-none border-none bg-transparent text-[0.9rem] "
            type="text"
            placeholder="Tìm kiếm"
          />
        </div>
      </div>
      <div
        className={`w-full flex flex-col font-nunito  rounded-[5px]  ${
          isDarkMode ? "border-[1px]" : " bg-dark-400"
        }`}
      >
        <div
          className={`w-full flex items-center gap-[10px] text-[0.9rem] px-[20px] py-[10px] font-bold  rounded-t-[5px] ${
            isDarkMode ? "bg-dark-800 " : "bg-dark-500"
          }`}
        >
          <div className="w-[20px] h-[20px] flex items-center justify-center">
            <input type="checkbox" />
          </div>
          <div className="w-4/12 flex items-center">
            <span>Tên sản phẩm</span>
          </div>
          <div className="w-1/12 flex items-center">
            <span>Doanh số</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Giá</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Còn lại</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Số đánh giá</span>
          </div>
          <div className="w-1/12 flex items-center ">
            <span>Thao tác</span>
          </div>
        </div>
        <ul
          style={{ height: "calc(100dvh - 350px)" }}
          className="w-full  flex flex-col gap-[10px] px-[10px] p-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom"
        >
          {listProducts.length > 0 ? (
            listProducts
              .filter((item) => item.status === "UNPUBLIC")
              .map((item) => {
                return (
                  <li
                    key={item.id}
                    className={`w-full flex items-center gap-[10px] text-[0.8rem] px-[10px] py-[10px] rounded-[5px] ${
                      isDarkMode ? " border-[1px] " : "bg-dark-300"
                    }`}
                  >
                    <div className="w-[20px] h-[20px] flex items-center justify-center">
                      <input type="checkbox" />
                    </div>
                    <div className="w-4/12 flex items-center">
                      <span>{item.name}</span>
                    </div>
                    <div className="w-1/12 flex items-center">
                      <span>{item.totalSales}</span>
                    </div>
                    <div className="w-2/12 flex items-center">
                      <span>{item.price.toLocaleString("vi-VN") + "đ"}</span>
                    </div>
                    <div className="w-2/12 flex items-center">
                      <span>{item.remaining}</span>
                    </div>
                    <div className="w-2/12 flex items-center">
                      <span>{item.rating}</span>
                    </div>{" "}
                    <div className="w-1/12 flex items-center justify-end"></div>
                  </li>
                );
              })
          ) : (
            <div className="w-full h-full flex items-center justify-center ">
              <div
                className={`flex flex-col items-center ${
                  isDarkMode ? " text-light-500" : "text-light-300"
                } `}
              >
                <i className="fa-solid fa-box-open text-[5rem]"></i>
                <p className="font-nunito text-[0.9rem]">
                  Không tìm thấy sản phẩm
                </p>
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ListUnpublistProducts;

const listProducts = [];
