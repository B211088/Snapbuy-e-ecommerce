import { useTheme } from "../../../Provider/ThemeProvider";
import { useAppData } from "../../../contexts/client/AppDataContext";

const ListAllProduct = () => {
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
            <span>Trạng Thái</span>
          </div>
        </div>
        <ul
          style={{ height: "calc(100dvh - 350px)" }}
          className="w-full  flex flex-col gap-[10px] px-[10px] p-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom"
        >
          {listProducts.map((item) => {
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
                <div className="w-1/12 flex items-center justify-end">
                  <div
                    className={`w-full rounded-[5px] font-bold cursor-pointer ${
                      item.status === "LIVE"
                        ? "text-green-600"
                        : item.status === "REVIEWING"
                        ? "text-orange-600"
                        : item.status === "VIOLATION"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    <span>
                      {item.status === "LIVE"
                        ? "ĐANG BÁN"
                        : item.status === "REVIEWING"
                        ? "CHỜ DUYỆT"
                        : item.status === "VIOLATION"
                        ? "VI PHẠM"
                        : "CHƯA BÁN"}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ListAllProduct;

const listProducts = [
  {
    id: 1,
    name: "Thức ăn cho chó",
    price: 100000,
    totalSales: 1000,
    remaining: 123,
    rating: 123,
    status: "LIVE",
  },
  {
    id: 2,
    name: "Thức ăn cho mèo",
    price: 90000,
    totalSales: 800,
    remaining: 50,
    rating: 110,
    status: "LIVE",
  },
  {
    id: 3,
    name: "Vòng cổ cho chó",
    price: 50000,
    totalSales: 600,
    remaining: 75,
    rating: 98,
    status: "LIVE",
  },
  {
    id: 4,
    name: "Đồ chơi bóng cho mèo",
    price: 30000,
    totalSales: 700,
    remaining: 60,
    rating: 105,
    status: "LIVE",
  },
  {
    id: 5,
    name: "Lồng vận chuyển cho chó mèo",
    price: 250000,
    totalSales: 350,
    remaining: 20,
    rating: 85,
    status: "LIVE",
  },
  {
    id: 6,
    name: "Sữa tắm cho chó",
    price: 120000,
    totalSales: 450,
    remaining: 40,
    rating: 99,
    status: "LIVE",
  },
  {
    id: 7,
    name: "Thức ăn hạt cho chim",
    price: 45000,
    totalSales: 200,
    remaining: 80,
    rating: 60,
    status: "UNPUBLIC",
  },
  {
    id: 8,
    name: "Xương gặm cho chó",
    price: 40000,
    totalSales: 550,
    remaining: 100,
    rating: 97,
    status: "VIOLATION",
  },
  {
    id: 9,
    name: "Cát vệ sinh cho mèo",
    price: 75000,
    totalSales: 900,
    remaining: 130,
    rating: 115,
    status: "LIVE",
  },
  {
    id: 10,
    name: "Áo quần cho chó mèo",
    price: 150000,
    totalSales: 250,
    remaining: 30,
    rating: 80,
    status: "REVIEWING",
  },
  {
    id: 11,
    name: "Bình nước tự động cho chó mèo",
    price: 180000,
    totalSales: 300,
    remaining: 45,
    rating: 92,
    status: "REVIEWING",
  },
];
