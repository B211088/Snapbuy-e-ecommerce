import React from "react";
import { useTheme } from "../../../Provider/ThemeProvider";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useAppData } from "../../../contexts/client/AppDataContext";

const ListBannedProducts = () => {
  const { isDarkMode } = useTheme();
  const {
    categoriesState: { categories },
  } = useAppData();
  return (
    <OutLetContainer>
      <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
        <div className="flex items-center  font-nunito gap-[10px] pb-[10px]">
          <div
            className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-bold text-[1.2rem]">Sản phẩm vi phạm</h1>
            <p
              className={`font-normal text-[0.95rem] ${
                isDarkMode ? " text-dark-300" : "text-light-300"
              }`}
            >
              Quản lý sản phẩm vi phạm của bạn
            </p>
          </div>
        </div>
      </div>
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
              <span> {violationProducts.length}</span> <span>Sản phẩm</span>
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
            <div className="w-3/12 flex items-center">
              <span>Tên sản phẩm</span>
            </div>
            <div className="w-2/12 flex items-center">
              <span>Thời gian</span>
            </div>
            <div className="w-3/12 flex items-center">
              <span>Loại vi phạm</span>
            </div>
            <div className="w-2/12 flex items-center">
              <span>Hạn cấm</span>
            </div>

            <div className="w-2/12 flex items-center">
              <span>Thao tác</span>
            </div>
          </div>
          <ul
            style={{ height: "calc(100dvh - 300px)" }}
            className="w-full  flex flex-col gap-[10px] px-[10px] p-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom"
          >
            {violationProducts && violationProducts.length > 0 ? (
              violationProducts.map((item) => (
                <li
                  key={item.id}
                  className={`w-full flex items-center gap-[10px] text-[0.8rem] px-[10px] py-[10px] rounded-[5px] ${
                    isDarkMode ? "border-[1px]" : "bg-dark-300"
                  }`}
                >
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <input type="checkbox" />
                  </div>
                  <div className="w-3/12 flex items-center">
                    <span>{item.name}</span>
                  </div>
                  <div className="w-2/12 flex items-center">
                    <span>
                      {new Date(item.time).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="w-3/12 flex items-center">
                    <span>{item.violationType}</span>
                  </div>
                  <div className="w-2/12 flex items-center">
                    <span>{item.banDuration}</span>
                  </div>
                  <div className="w-2/12 flex items-center justify-end">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => console.log(`Xem chi tiết ${item.name}`)}
                    >
                      {item.action}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`flex flex-col items-center ${
                    isDarkMode ? "text-light-500" : "text-light-300"
                  }`}
                >
                  <i className="fa-solid fa-box-open text-[5rem]"></i>
                  <p className="font-nunito text-[0.9rem]">
                    Không tìm thấy sản phẩm vi phạm
                  </p>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </OutLetContainer>
  );
};

export default ListBannedProducts;

const violationProducts = [];
