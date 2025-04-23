import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useShop } from "../../../contexts/User/ShopContext";
import { Link } from "react-router-dom";

const ShopHome = () => {
  const { isDarkMode } = useTheme();
  const {
    shopState: { shopInfo },
    getShopOrderByStatus,
    getAllProducts,
  } = useShop();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [packaginOrders, setPackagingOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await getShopOrderByStatus(shopInfo?.id, "PENDING");
        if (response.success) {
          setPendingOrders(response.data);
        }
      } catch (error) {
        setPackagingOrders([]);
      }
    };

    const fetchPackagingOrders = async () => {
      try {
        const response = await getShopOrderByStatus(shopInfo?.id, "PACKAGING");
        if (response.success) {
          setPackagingOrders(response.data);
        }
      } catch (error) {
        setPackagingOrders([]);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(shopInfo?.id);
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        setProducts([]);
      }
    };
    fetchPendingOrders();
    fetchPackagingOrders();
    fetchProducts();
  }, [shopInfo]);

  const chartOptions = {
    tooltip: { trigger: "axis" },
    legend: {
      data: [
        "Doanh số",
        "Lượt truy cập",
        "Lượt xem",
        "Đơn hàng",
        "Tỷ lệ chuyển đổi",
      ],
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Doanh số",
        type: "line",
        smooth: true,
        data: [
          500, 800, 600, 1000, 1100, 1300, 1500, 1400, 1200, 1000, 900, 1100,
        ],
      },
      {
        name: "Lượt truy cập",
        type: "bar",
        data: [
          3000, 4000, 3500, 5000, 5500, 6000, 6500, 6200, 6100, 5800, 5600,
          6000,
        ],
      },
      {
        name: "Lượt xem",
        type: "bar",
        data: [
          7000, 8000, 8500, 9500, 10000, 11000, 10500, 10200, 9800, 9500, 9400,
          9700,
        ],
      },
      {
        name: "Đơn hàng",
        type: "line",
        smooth: true,
        data: [120, 150, 140, 170, 180, 200, 190, 180, 170, 160, 150, 160],
      },
      {
        name: "Tỷ lệ chuyển đổi",
        type: "line",
        smooth: true,
        data: [2, 2.5, 2.2, 2.8, 3, 3.2, 3.1, 3, 2.9, 2.7, 2.6, 2.8],
      },
    ],
  };

  return (
    <div className="w-full flex flex-col gap-[20px]">
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-light-100 " : "bg-dark-200 text-light-100"
        }`}
      >
        <div className="w-full flex flex-col  gap-[20px] font-nunito px-[20px] pt-[10px] pb-[20px]">
          <div className="w-full flex items-center">
            <h1 className="font-bold">Danh sách việc cần làm</h1>
          </div>
          <div className="w-full flex items-center gap-[20px] ">
            <div className="w-3/12 flex flex-col  px-[20px] py-[15px] border-[1px] shadow-sm rounded-[5px]">
              <Link
                to="/shopdashboard/orders"
                className="w-full flex justify-between"
              >
                <h1 className="text-[0.8rem] font-bold h-[32px]">
                  Đơn chờ xác nhận
                </h1>
                <div className="text-[0.8rem] text-gray-500">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
              </Link>
              <div className="w-full flex justify-between text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {pendingOrders.length}
                </span>
              </div>
            </div>
            <div className="w-3/12 flex flex-col  px-[20px] py-[15px] border-[1px] shadow-sm rounded-[5px]">
              <Link
                to="/shopdashboard/orders/shipping"
                className="w-full flex justify-between"
              >
                <h1 className="text-[0.8rem] font-bold h-[32px]">
                  Cần giao hàng
                </h1>
                <div className="text-[0.8rem] text-gray-500">
                  <i className="fa-solid fa-square-check"></i>
                </div>
              </Link>
              <div className="w-full flex justify-between text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {packaginOrders.length}
                </span>
              </div>
            </div>
            <div className="w-3/12 flex flex-col  px-[20px] py-[15px] border-[1px] shadow-sm rounded-[5px]">
              <div className="w-full flex justify-between">
                <h1 className="text-[0.8rem] font-bold h-[32px]">
                  Đơn hủy/hoàn tiền/trả hàng
                </h1>
                <div className="text-[0.8rem] text-gray-500">
                  <i className="fa-solid fa-money-bill-transfer"></i>
                </div>
              </div>
              <div className="w-full flex justify-between text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">0</span>
              </div>
            </div>
            <div className="w-3/12 flex flex-col  px-[20px] py-[15px] border-[1px] shadow-sm rounded-[5px]">
              <div className="w-full flex justify-between">
                <h1 className="text-[0.8rem] font-bold h-[32px]">
                  Sản phẩm tạm khóa
                </h1>
                <div className="text-[0.8rem] text-gray-500">
                  <i className="fa-solid fa-lock"></i>
                </div>
              </div>
              <div className="w-full flex justify-between text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-light-100 " : "bg-dark-200 text-light-100"
        }`}
      >
        <div className="w-full flex flex-col  gap-[20px] font-nunito px-[20px] pt-[10px] pb-[20px]">
          <div className="w-full flex items-center">
            <h1 className="font-bold">Kho sản phẩm</h1>
          </div>{" "}
          <div className="w-full flex items-center gap-[20px]">
            {" "}
            <Link
              to="/shopdashboard/products/list/all"
              className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]"
            >
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Tổng sản phẩm</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {products.length}
                  <span className="text-[0.9rem] ml-[5px]">sản phẩm</span>
                </span>
              </div>
            </Link>{" "}
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Đang bán</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {products.length}
                  <span className="text-[0.9rem] ml-[5px]">sản phẩm</span>
                </span>
              </div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Chưa đăng bán</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {0}
                  <span className="text-[0.9rem] ml-[5px]">sản phẩm</span>
                </span>
              </div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Chờ duyệt</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {0}
                  <span className="text-[0.9rem] ml-[5px]">sản phẩm</span>
                </span>
              </div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Vi phạm</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {0}
                  <span className="text-[0.9rem] ml-[5px]">sản phẩm</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-light-100 " : "bg-dark-200 text-light-100"
        }`}
      >
        <div className="w-full flex flex-col  gap-[20px] font-nunito px-[20px] pt-[10px] pb-[20px]">
          <div className="w-full flex items-center">
            <h1 className="font-bold">Phân tích bán hàng</h1>
          </div>{" "}
          <div className="w-full flex items-center gap-[20px]">
            {" "}
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Doanh số</span>
              </div>
              <div className="w-full flex   text-[1.3rem] font-bold">
                <span className="text-blue-600 font-kanit">
                  {(0).toLocaleString("vi-VN")}
                  <span className="text-[0.9rem]">đ</span>
                </span>
              </div>
              <div className="text-[0.8rem] text-gray-500">-0.00%</div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Lượt truy cập</span>
              </div>
              <div className="w-full flex  text-[1.3rem] font-bold">
                <div className=" text-blue-600 font-kanit">
                  <span>{(0).toLocaleString("de-DE")}</span>
                  <span className="text-[0.9rem] ml-[5px]">lượt</span>
                </div>
              </div>
              <div className="text-[0.8rem] text-gray-500">-0.00%</div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Lượt xem</span>
              </div>
              <div className="w-full flex  text-[1.3rem] font-bold">
                <div className=" text-blue-600 font-kanit">
                  <span>{(0).toLocaleString("de-DE")}</span>
                  <span className="text-[0.9rem] ml-[5px]">lượt</span>
                </div>
              </div>
              <div className="text-[0.8rem] text-gray-500">-0.00%</div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">Đơn hàng</span>
              </div>
              <div className="w-full flex  text-[1.3rem] font-bold">
                <div className=" text-blue-600 font-kanit">
                  <span>{(0).toLocaleString("de-DE")}</span>
                  <span className="text-[0.9rem] ml-[5px]">đơn</span>
                </div>
              </div>
              <div className="text-[0.8rem] text-gray-500">-0.00%</div>
            </div>
            <div className="w-[20%] flex flex-col  px-[0px] py-[0px]  rounded-[5px]">
              <div className="w-full flex items-center  ">
                <span className="text-[0.8rem] font-bold ">
                  Tỷ lệ chuyển đổi
                </span>
              </div>
              <div className="w-full flex  text-[1.3rem] font-bold">
                <div className=" text-blue-600 font-kanit">
                  <span>{0}</span>
                  <span className="text-[0.9rem] ml-[5px]">%</span>
                </div>
              </div>
              <div className="text-[0.8rem] text-gray-500">-0.00%</div>
            </div>
          </div>
          <div
            className={`w-full mt-[30px] p-[20px] rounded-[5px] shadow ${
              isDarkMode ? "bg-light-100" : "bg-dark-300 text-light-100"
            }`}
          >
            <h2 className="font-bold mb-[20px]">Bản thống kê theo tháng</h2>
            <ReactECharts
              option={chartOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHome;
