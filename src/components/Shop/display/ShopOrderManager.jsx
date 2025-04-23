import React, { useState, useEffect } from "react";
import { useShop } from "../../../contexts/User/ShopContext";
import { useTheme } from "../../../Provider/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import OrderPrint from "../Modal/OrderPrint";
import BatchOrderPrint from "../Modal/BatchOrderPrint";

const ShopOrderManager = () => {
  const {
    shopState: { shopInfo },
    getShopOrderByStatus,
    confirmOrder,
  } = useShop();

  const { isDarkMode = false } = useTheme();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [confirmingOrders, setConfirmingOrders] = useState({});
  const [notification, setNotification] = useState(null);
  const [showPrintOrder, setShowPrintOrder] = useState(false);
  const [printOrderData, setPrintOrderData] = useState({});

  const [showBatchPrint, setShowBatchPrint] = useState(false);
  const [batchPrintData, setBatchPrintData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  console.log({ orders });

  const statusOptions = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "PACKAGING", label: "Đang đóng gói" },
    { value: "HANDED_OVER_TO_CARRIER", label: "Đã giao cho ĐVVC" },
    { value: "SHIPPING", label: "Đang vận chuyển" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCEL", label: "Đã hủy" },
    { value: "RETURN", label: "Trả hàng" },
    { value: "RETURNED", label: "Đã trả hàng" },
  ];

  const handleShowPrintOrder = (order) => {
    setShowPrintOrder(true);
    setPrintOrderData(order);
  };

  const handleShowBatchPrint = () => {
    if (selectedOrders.length === 0) {
      showNotification("Vui lòng chọn ít nhất một đơn hàng để in", "warning");
      return;
    }

    const selectedOrdersData = filteredOrders.filter((order) =>
      selectedOrders.includes(order.id)
    );

    setBatchPrintData(selectedOrdersData);
    setShowBatchPrint(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shopInfo?.id) return;

      setLoading(true);
      try {
        const result = await getShopOrderByStatus(shopInfo.id, status);
        if (result.success) {
          setOrders(result.data);
          setFilteredOrders(result.data);

          setSelectedOrders([]);
        } else {
          setError(result.message || "Không thể tải đơn hàng");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopInfo?.id, status, getShopOrderByStatus]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, dateRange, priceRange, orders]);

  const applyFiltersAndSearch = () => {
    let result = [...orders];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          String(order.id).includes(lowerSearchTerm) ||
          order.user_village_response.receiver_name
            .toLowerCase()
            .includes(lowerSearchTerm) ||
          order.user_village_response.phone_number.includes(lowerSearchTerm) ||
          order.user_village_response.specific_address
            .toLowerCase()
            .includes(lowerSearchTerm) ||
          order.order_detail_responses.some((item) =>
            item.product_name.toLowerCase().includes(lowerSearchTerm)
          )
      );
    }

    if (dateRange.startDate || dateRange.endDate) {
      result = result.filter((order) => {
        const orderDate = new Date(order.created_at || order.updated_at);

        if (dateRange.startDate && dateRange.endDate) {
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          end.setHours(23, 59, 59); // Set to end of day
          return orderDate >= start && orderDate <= end;
        } else if (dateRange.startDate) {
          const start = new Date(dateRange.startDate);
          return orderDate >= start;
        } else if (dateRange.endDate) {
          const end = new Date(dateRange.endDate);
          end.setHours(23, 59, 59); // Set to end of day
          return orderDate <= end;
        }

        return true;
      });
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      result = result.filter((order) => {
        const totalMoney = parseFloat(order.total_money);

        if (priceRange.min && priceRange.max) {
          return (
            totalMoney >= parseFloat(priceRange.min) &&
            totalMoney <= parseFloat(priceRange.max)
          );
        } else if (priceRange.min) {
          return totalMoney >= parseFloat(priceRange.min);
        } else if (priceRange.max) {
          return totalMoney <= parseFloat(priceRange.max);
        }

        return true;
      });
    }

    setFilteredOrders(result);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ startDate: "", endDate: "" });
    setPriceRange({ min: "", max: "" });
    setFilteredOrders(orders);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColorClass = (orderStatus) => {
    switch (orderStatus) {
      case "PENDING":
        return "text-yellow-500";
      case "PACKAGING":
        return "text-blue-500";
      case "HANDED_OVER_TO_CARRIER":
        return "text-indigo-500";
      case "SHIPPING":
        return "text-purple-500";
      case "COMPLETED":
        return "text-green-500";
      case "CANCEL":
        return "text-red-500";
      case "RETURN":
        return "text-orange-500";
      case "RETURNED":
        return "text-orange-700";
      default:
        return "text-dark-500";
    }
  };

  const getStatusVietnamese = (status) => {
    const found = statusOptions.find((option) => option.value === status);
    return found ? found.label : status;
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getItemCount = (order) => {
    return order.order_detail_responses.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const handleToggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleConfirmOrder = async (orderId) => {
    if (!shopInfo?.id) return;

    setConfirmingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      const result = await confirmOrder(shopInfo.id, orderId);
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
        showNotification("Xác nhận đơn hàng thành công", "success");
      } else {
        showNotification(
          `Lỗi: ${result.message || "Không thể xác nhận đơn hàng"}`,
          "error"
        );
      }
    } catch (err) {
      showNotification(`Lỗi: ${err.message || "Đã xảy ra lỗi"}`, "error");
    } finally {
      setConfirmingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleConfirmSelectedOrders = async () => {
    if (selectedOrders.length === 0 || !shopInfo?.id) return;

    const confirming = {};
    selectedOrders.forEach((id) => {
      confirming[id] = true;
    });
    setConfirmingOrders((prev) => ({ ...prev, ...confirming }));

    try {
      const results = await Promise.allSettled(
        selectedOrders.map((orderId) => confirmOrder(shopInfo.id, orderId))
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      const failed = selectedOrders.length - successful;

      // Update orders list by removing confirmed orders
      const confirmedOrderIds = results
        .map((result, index) =>
          result.status === "fulfilled" && result.value.success
            ? selectedOrders[index]
            : null
        )
        .filter(Boolean);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => !confirmedOrderIds.includes(order.id))
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => !confirmedOrderIds.includes(order.id))
      );

      // Update selected orders
      setSelectedOrders((prev) =>
        prev.filter((id) => !confirmedOrderIds.includes(id))
      );

      if (successful > 0) {
        showNotification(
          `Đã xác nhận ${successful} đơn hàng thành công${
            failed > 0 ? `, ${failed} thất bại` : ""
          }`,
          failed > 0 ? "warning" : "success"
        );
      } else {
        showNotification(`Không thể xác nhận đơn hàng`, "error");
      }
    } catch (err) {
      showNotification(`Lỗi: ${err.message || "Đã xảy ra lỗi"}`, "error");
    } finally {
      const resetConfirming = {};
      selectedOrders.forEach((id) => {
        resetConfirming[id] = false;
      });
      setConfirmingOrders((prev) => ({ ...prev, ...resetConfirming }));
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const caculateTotalProductProducts = (OrdersDetail) => {
    const result = OrdersDetail.reduce((totalPriceProduct, product) => {
      return totalPriceProduct + product.price * product.quantity;
    }, 0);
    return result;
  };

  // Animation variants
  const orderCardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };
  const detailsVariants = {
    hidden: {
      height: 0,

      overflow: "hidden",
      transition: { duration: 0.3 },
    },
    visible: {
      height: "auto",

      overflow: "hidden",
      transition: { duration: 0.3 },
    },
  };

  const tabIndicatorVariants = {
    initial: { width: 0, opacity: 0 },
    animate: (index) => ({
      width: "100%",
      opacity: 1,
      transition: { duration: 0.3 },
    }),
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full rounded-[5px] overflow-hidden ${
        isDarkMode
          ? "bg-light-100 text-dark-100"
          : "bg-dark-200 text-light-100 rounded-[5px] overflow-hidden"
      }`}
    >
      <div className="border-b">
        <h2 className="text-2xl font-bold p-6 pb-4">Quản lý đơn hàng</h2>

        {!shopInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-6 mb-4 bg-yellow-100 text-yellow-700 p-4 rounded"
          >
            Chưa có thông tin cửa hàng. Vui lòng hoàn thiện hồ sơ cửa hàng của
            bạn.
          </motion.div>
        )}

        <div className="flex overflow-x-auto scrollbar-hide">
          {statusOptions.map((option, index) => (
            <div key={option.value} className="relative">
              <button
                onClick={() => setStatus(option.value)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap  ${
                  status === option.value
                    ? `${!isDarkMode ? "text-blue-400" : "text-blue-600"}`
                    : "text-dark-500 hover:text-dark-700"
                }`}
              >
                {option.label}
              </button>
              {status === option.value && (
                <motion.div
                  initial="initial"
                  animate="animate"
                  custom={index}
                  variants={tabIndicatorVariants}
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/2">
            <div
              className={`flex items-center rounded-[5px] border ${
                isDarkMode
                  ? "border-dark-600"
                  : "border-transparent bg-dark-400"
              }`}
            >
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, tên khách hàng, sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2 px-3 rounded-l-[5px] focus:outline-none text-[0.9rem] bg-transparent ${
                  isDarkMode
                    ? "bg-white text-dark-400"
                    : "bg-dark-600 text-light-100"
                }`}
              />
              <button
                className={`px-3 py-2 ${
                  isDarkMode
                    ? "bg-white text-dark-300"
                    : "bg-transparent text-light-100"
                }`}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border-l ${
                  isDarkMode
                    ? "bg-white text-blue-600 border-dark-900"
                    : "bg-transparent text-light-100 border-dark-500"
                } rounded-r-[5px]`}
              >
                <i className="fa-solid fa-filter"></i>
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex gap-2 justify-end">
            <button
              onClick={handleConfirmSelectedOrders}
              disabled={selectedOrders.length === 0 || status !== "PENDING"}
              className={`px-4 py-2 bg-green-500 text-white rounded-[5px] flex items-center gap-2 text-sm ${
                selectedOrders.length === 0 || status !== "PENDING"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Xác nhận{" "}
              {selectedOrders.length > 0 && `(${selectedOrders.length})`}
            </button>

            <button
              onClick={handleShowBatchPrint}
              disabled={selectedOrders.length === 0}
              className={`px-4 py-2 bg-blue-500 text-white rounded-[5px] flex items-center gap-2 text-sm ${
                selectedOrders.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              <i className="fa-solid fa-print"></i>
              In hàng loạt{" "}
              {selectedOrders.length > 0 && `(${selectedOrders.length})`}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={filterVariants}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Date Range Filter */}
              <div>
                <h3 className="font-medium text-sm mb-2">Thời gian</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                    className={`p-2 border rounded-[5px] w-full text-sm outline-none ${
                      isDarkMode
                        ? "bg-white text-dark-200 border-dark-600"
                        : "bg-dark-400 text-light-100 border-transparent "
                    }`}
                  />
                  <span>đến</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                    className={`p-2 border rounded-[5px] w-full text-sm outline-none ${
                      isDarkMode
                        ? "bg-white text-dark-200 border-dark-600"
                        : "bg-dark-400 text-light-100 border-transparent "
                    }`}
                  />
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-sm mb-2">Giá trị đơn hàng</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className={`p-2 border rounded-[5px] w-full text-sm outline-none ${
                      isDarkMode
                        ? "bg-white text-dark-200 border-dark-600"
                        : "bg-dark-400 text-light-100 border-transparent "
                    }`}
                  />
                  <span>đến</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className={`p-2 border rounded-[5px] w-full text-sm outline-none ${
                      isDarkMode
                        ? "bg-white text-dark-200 border-dark-600"
                        : "bg-dark-400 text-light-100 border-transparent "
                    }`}
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-dark-500 hover:text-dark-700 mr-2"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => applyFiltersAndSearch()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-[5px] text-sm hover:bg-blue-600"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orders List */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <p className="text-lg font-medium">
              Không có đơn hàng nào ở trạng thái này
            </p>
            {searchTerm ||
            dateRange.startDate ||
            dateRange.endDate ||
            priceRange.min ||
            priceRange.max ? (
              <p className="mt-2 text-gray-500">
                Thử điều chỉnh lại bộ lọc của bạn
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            {/* Orders header */}
            <div
              className={`flex items-center mb-4 py-[10px]  px-[18px] border text-sm font-nunito rounded-[5px] ${
                isDarkMode
                  ? "border-dark-800"
                  : "bg-dark-400 border-transparent text-dark-700"
              }`}
            >
              <div className="w-8 flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedOrders.length === filteredOrders.length &&
                    filteredOrders.length > 0
                  }
                  onChange={handleSelectAllOrders}
                  className="form-checkbox h-[18px] w-[18px] text-blue-600 mr-3 cursor-pointer"
                />
              </div>
              <div className="flex-1 font-medium">Chọn tất cả</div>
              <div className="w-5/12 flex items-center justify-end">
                <div className="w-4/12  text-right">Tổng tiền</div>
                <div className="w-4/12  text-right">Trạng thái</div>
                <div className="w-4/12  text-right">Thao tác</div>
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={orderCardVariants}
                  initial="hidden"
                  animate="visible"
                  className={`border rounded-[5px] ${
                    isDarkMode
                      ? "border-dark-800 bg-white"
                      : "border-transparent bg-dark-400 text-light-100"
                  }`}
                >
                  {/* Order header */}
                  <div className="p-4 flex flex-col pc:flex-row   items-center">
                    <div className="pc:w-8 w-full">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleToggleSelectOrder(order.id)}
                        className="form-checkbox h-[18px] w-[18px] text-blue-600 mr-3 cursor-pointer"
                      />
                    </div>
                    <div className="flex w-full">
                      <div
                        className="flex-1 cursor-pointer flex flex-col"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="font-medium mb:text-[0.9rem]">
                            #{order.id} ·{" "}
                            {order.user_village_response.receiver_name}
                          </div>
                          {/* <div className=" text-sm md:ml-2">
                            {new Date(
                              order.created_at || order.updated_at
                            ).toLocaleDateString()}
                          </div> */}
                        </div>
                        <div className="text-dark-500 text-sm flex flex-wrap items-center mt-1 ">
                          <span className="mr-4">
                            {order.user_village_response.phone_number}
                          </span>
                          <div className="flex items-center gap-[5px]">
                            <span>{getItemCount(order)} sản phẩm</span>
                            <div
                              className={`${
                                expandedOrderId !== order.id
                                  ? "rotate-[0deg]"
                                  : "rotate-[180deg]"
                              } w-[14px] h-[14px] flex items-center justify-center transition-all duration-300`}
                            >
                              <i className="fa-solid fa-angle-down"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-5/12  flex mb:flex-col items-center">
                        <div className="w-4/12 text-right font-medium mb:text-[0.9rem]">
                          <span>{formatPrice(order.total_money)}</span>
                        </div>
                        <div
                          className={`text-right pc:w-4/12 w-full mb:py-[5px] font-medium text-[0.9rem] ${getStatusColorClass(
                            order.order_status
                          )}`}
                        >
                          {getStatusVietnamese(order.order_status)}
                        </div>

                        <div className="pc:w-4/12 w-full flex justify-end gap-[5px]">
                          <div className="w-full flex justify-end space-x-2">
                            {order.order_status === "PENDING" && (
                              <button
                                onClick={() => handleConfirmOrder(order.id)}
                                disabled={confirmingOrders[order.id]}
                                className={`px-[10px] py-[6px] bg-green-500 text-white rounded-[5px] ${
                                  confirmingOrders[order.id]
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-600"
                                }`}
                              >
                                {confirmingOrders[order.id] ? (
                                  <div className="spinner-sm"></div>
                                ) : (
                                  <i className="fa-solid fa-check"></i>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleShowPrintOrder(order)}
                              className="px-[10px] py-[6px] bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 text-left"
                            >
                              <i className="fa-solid fa-print"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order details (expanded) */}
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border-t px-4 py-3 "
                      >
                        {/* Customer Info */}
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">
                            Thông tin khách hàng
                          </h3>
                          <div
                            className={`flex flex-col gap-[10px] text-sm border-[1px] rounded-[5px] p-[10px] ${
                              isDarkMode ? "" : "bg-dark-300 border-transparent"
                            }`}
                          >
                            <div>
                              <span className="font-bold">Họ tên:</span>{" "}
                              {order.user_village_response.receiver_name}
                            </div>
                            <div>
                              <span className="font-bold">Số điện thoại:</span>{" "}
                              {order.user_village_response.phone_number}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-bold">Địa chỉ:</span>{" "}
                              {order.user_village_response.specific_address},{" "}
                              {order.user_village_response.ward_name},{" "}
                              {order.user_village_response.district_name},{" "}
                              {order.user_village_response.province_name}
                            </div>
                          </div>
                        </div>

                        {/* Product List */}
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">
                            Danh sách sản phẩm
                          </h3>
                          <div
                            className={`space-y-1 text-sm border-[1px] rounded-[5px] p-[10px] ${
                              isDarkMode ? "" : "bg-dark-300 border-transparent"
                            }`}
                          >
                            {order.order_detail_responses.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start py-2 border-b last:border-0"
                              >
                                <div className="w-12 h-12 rounded bg-gray-200 mr-3 overflow-hidden">
                                  {item.product_category_image_url && (
                                    <img
                                      src={item.product_category_image_url}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {item.product_name}
                                  </div>
                                  <div className="text-[0.9rem]">
                                    {item.product_category_name}{" "}
                                    {item.product_sub_category_name
                                      ? ` - ${item.product_sub_category_name}`
                                      : ""}
                                  </div>
                                  <div className="text-sm text-dark-500">
                                    {item.options_name &&
                                      Object.entries(
                                        JSON.parse(item.options_name)
                                      ).map(([key, value], i, arr) => (
                                        <span key={key}>
                                          {key}: {value}
                                          {i < arr.length - 1 ? ", " : ""}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div>{formatPrice(item.price)}</div>
                                  <div className="text-sm text-dark-500">
                                    x{item.quantity}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h3 className="font-medium mb-2 text-[1rem]">
                            Tổng quan đơn hàng
                          </h3>
                          <div
                            className={`space-y-1 text-sm border-[1px] rounded-[5px] p-[10px] ${
                              isDarkMode ? "" : "bg-dark-300 border-transparent"
                            }`}
                          >
                            <div className="flex justify-between py-[5px]">
                              <span>Tổng tiền hàng:</span>
                              <span>
                                {formatPrice(
                                  caculateTotalProductProducts(
                                    order.order_detail_responses
                                  )
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí vận chuyển:</span>
                              <span>
                                {formatPrice(
                                  order.shipping_type_response.price
                                )}
                              </span>
                            </div>
                            {order.voucher_response?.discount_percent > 0 && (
                              <div className="flex justify-between py-[5px]">
                                <span>Voucher</span>
                                <div className="flex items-center gap-[10px]">
                                  <div className="bg-red-500 text-light-100 px-[20px] rounded-[10px] text-[0.8rem] font-bold ">
                                    {order.voucher_response.discount_percent} %
                                  </div>
                                  <span>
                                    -
                                    {formatPrice(
                                      caculateTotalProductProducts(
                                        order.order_detail_responses
                                      ) *
                                        (order.voucher_response
                                          .discount_percent /
                                          100)
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}

                            {order.discount_money > 0 && (
                              <div className="flex justify-between py-[5px]">
                                <span>Giảm giá:</span>
                                <span>
                                  -{formatPrice(order.discount_money)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium pt-2 border-t py-[5px]">
                              <span>Tổng thanh toán:</span>
                              <span>{formatPrice(order.total_money)}</span>
                            </div>
                            <div className="flex justify-between text-dark-500">
                              <span>Phương thức thanh toán:</span>
                              <span>
                                {order.payment_method === "COD"
                                  ? "Thanh toán khi nhận hàng"
                                  : order.payment_method === "VNPAY"
                                  ? "Thanh toán qua VNPay"
                                  : order.payment_method}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Print Order Modal */}
      {showPrintOrder && (
        <OrderPrint
          orderData={printOrderData}
          onCloseModal={() => setShowPrintOrder(false)}
        />
      )}

      {/* Batch Print Modal */}
      {showBatchPrint && (
        <BatchOrderPrint
          orders={batchPrintData}
          onClose={() => setShowBatchPrint(false)}
        />
      )}

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
            className={`fixed bottom-4 right-4 p-4 rounded-[5px] shadow-lg max-w-xs z-50 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500 text-dark-900"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {notification.type === "error" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {notification.type === "warning" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {notification.type === "info" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div>{notification.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for spinners */}
    </motion.div>
  );
};

export default ShopOrderManager;
