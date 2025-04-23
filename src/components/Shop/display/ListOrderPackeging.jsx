import React, { useState, useEffect } from "react";
import { useShop } from "../../../contexts/User/ShopContext";
import { useTheme } from "../../../Provider/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const ListOrderPackeging = () => {
  const {
    shopState: { shopInfo, shippingProviders },
    getShopOrderByStatus,
    deliverOrderToShippingProvider,
    addShipingProviderToOrder,
  } = useShop();
  const { isDarkMode = false } = useTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("PACKAGING");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState({});
  const [notification, setNotification] = useState(null);

  const [selectedShippingProviders, setSelectedShippingProviders] = useState(
    {}
  );

  const statusOptions = [{ value: "PACKAGING", label: "Đang đóng gói" }];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shopInfo?.id) return;

      setLoading(true);
      try {
        const result = await getShopOrderByStatus(shopInfo.id, status);
        if (result.success) {
          setOrders(result.data);

          const initialSelections = {};
          result.data.forEach((order) => {
            initialSelections[order.id] = 1;
          });
          setSelectedShippingProviders(initialSelections);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColorClass = (orderStatus) => {
    switch (orderStatus) {
      case "PACKAGING":
        return "text-blue-500";
      case "HANDED_OVER_TO_CARRIER":
        return "text-purple-500";
      case "SHIPPING":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusVietnamese = (status) => {
    const statusMap = {
      PACKAGING: "Đang đóng gói",
      HANDED_OVER_TO_CARRIER: "Đã giao cho đơn vị vận chuyển",
      SHIPPING: "Đang vận chuyển",
    };
    return statusMap[status] || status;
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
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const handleSelectShippingProvider = (orderId, providerId) => {
    setSelectedShippingProviders((prev) => ({
      ...prev,
      [orderId]: providerId,
    }));
  };

  const handleAddShippingProvider = async (orderId) => {
    if (!shopInfo?.id) return;

    setProcessingOrders((prev) => ({ ...prev, [orderId]: true }));

    try {
      const formData = {
        shop_id: shopInfo.id,
        shipping_provider_id: selectedShippingProviders[orderId],
        order_id: orderId,
      };

      const result = await addShipingProviderToOrder(formData);

      if (result.success) {
        // After adding shipping provider, deliver to shipping provider
        await handleDeliverToShippingProvider(orderId);
      } else {
        showNotification(
          `Lỗi: ${result.message || "Không thể thêm đơn vị vận chuyển"}`,
          "error"
        );
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
      }
    } catch (err) {
      showNotification(`Lỗi: ${err.message || "Đã xảy ra lỗi"}`, "error");
      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDeliverToShippingProvider = async (orderId) => {
    if (!shopInfo?.id) return;

    try {
      const result = await deliverOrderToShippingProvider(shopInfo.id, orderId);

      if (result.success) {
        // Update the status of the order in local state
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
        showNotification(
          "Đã giao hàng cho đơn vị vận chuyển thành công",
          "success"
        );
      } else {
        showNotification(
          `Lỗi: ${
            result.message || "Không thể giao hàng cho đơn vị vận chuyển"
          }`,
          "error"
        );
      }
    } catch (err) {
      showNotification(`Lỗi: ${err.message || "Đã xảy ra lỗi"}`, "error");
    } finally {
      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleProcessSelectedOrders = async () => {
    if (selectedOrders.length === 0 || !shopInfo?.id) return;

    const processing = {};
    selectedOrders.forEach((id) => {
      processing[id] = true;
    });
    setProcessingOrders((prev) => ({ ...prev, ...processing }));

    try {
      const results = await Promise.allSettled(
        selectedOrders.map((orderId) => {
          const formData = {
            shop_id: shopInfo.id,
            shipping_provider_id: selectedShippingProviders[orderId],
            order_id: orderId,
          };
          return addShipingProviderToOrder(formData).then((result) => {
            if (result.success) {
              return deliverOrderToShippingProvider(shopInfo.id, orderId);
            }
            return result;
          });
        })
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      const failed = selectedOrders.length - successful;

      // Update orders list by removing processed orders
      const processedOrderIds = results
        .map((result, index) =>
          result.status === "fulfilled" && result.value.success
            ? selectedOrders[index]
            : null
        )
        .filter(Boolean);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => !processedOrderIds.includes(order.id))
      );

      // Update selected orders
      setSelectedOrders((prev) =>
        prev.filter((id) => !processedOrderIds.includes(id))
      );

      if (successful > 0) {
        showNotification(
          `Đã xử lý ${successful} đơn hàng thành công${
            failed > 0 ? `, ${failed} thất bại` : ""
          }`,
          failed > 0 ? "warning" : "success"
        );
      } else {
        showNotification(`Không thể xử lý đơn hàng`, "error");
      }
    } catch (err) {
      showNotification(`Lỗi: ${err.message || "Đã xảy ra lỗi"}`, "error");
    } finally {
      const resetProcessing = {};
      selectedOrders.forEach((id) => {
        resetProcessing[id] = false;
      });
      setProcessingOrders((prev) => ({ ...prev, ...resetProcessing }));
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full font-nunito ${
        isDarkMode
          ? "bg-light-100 text-dark-100"
          : "bg-dark-200 text-light-100 rounded-[5px] overflow-hidden"
      }`}
    >
      <div className="border-b">
        <h2 className="text-2xl font-bold p-6 pb-4">Giao hàng</h2>

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

        {/* Status Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {statusOptions.map((option, index) => (
            <div key={option.value} className="relative">
              <button
                onClick={() => setStatus(option.value)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
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

      <div className="pc:p-6 p-[10px]">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              key="notification"
              variants={notificationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`mb-4 p-4  rounded ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : notification.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : notification.type === "warning"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch Processing Controls */}
        {orders.length > 0 && (
          <div
            className={`mb-6 flex items-center justify-between py-[5px] pc:px-[20px] px-[10px] rounded-[5px] border-[1px] ${
              isDarkMode ? "border-dark-900" : "bg-dark-300 border-transparent"
            }`}
          >
            <div className="flex items-center py-[10px]">
              <input
                type="checkbox"
                className="form-checkbox h-[18px] w-[18px] text-blue-600 mr-3 cursor-pointer"
                checked={
                  selectedOrders.length === orders.length && orders.length > 0
                }
                onChange={handleSelectAllOrders}
              />
              <span className="text-sm">
                {selectedOrders.length > 0
                  ? `Đã chọn ${selectedOrders.length} đơn hàng`
                  : "Chọn tất cả"}
              </span>
            </div>

            {selectedOrders.length > 0 && (
              <button
                onClick={handleProcessSelectedOrders}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Xử lý {selectedOrders.length} đơn hàng đã chọn
              </button>
            )}
          </div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-blue-500"
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            Lỗi: {error}
          </motion.div>
        )}

        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={` p-8 text-center rounded-[5px] ${
              isDarkMode
                ? "bg-dark-900 text-dark-200"
                : "bg-dark-400 text-light-300"
            }`}
          >
            <p className="text-dark-600">
              Không có đơn hàng nào với trạng thái:{" "}
              {getStatusVietnamese(status)}
            </p>
          </motion.div>
        )}

        {!loading && !error && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  variants={orderCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className={`rounded-[5px] border-[1px] overflow-hidden ${
                    isDarkMode
                      ? "bg-light-100 border-dark-900"
                      : "bg-dark-400 border-transparent"
                  }`}
                >
                  {/* Order Summary (always visible) */}
                  <motion.div
                    whileHover={{
                      backgroundColor: isDarkMode
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                    }}
                    className={`w-full flex px-[10px] py-[10px] cursor-pointer relative`}
                  >
                    <div className="w-full flex flex-col pc:flex-row  pc:justify-between pc:items-center">
                      {/* Checkbox column */}
                      <div
                        className="pc:px-2 mb:w-full flex mb:justify-start rounded-[5px] overflow-hidden"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectOrder(order.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-[18px] w-[18px] text-blue-600  cursor-pointer rounded-[5px]"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => {}}
                        />
                      </div>

                      <div className="w-full flex pc:flex-row flex-col ">
                        <div
                          className="flex-1 py-[5px]"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div>
                                <h3 className="text-[1rem] font-semibold mb:text-[0.9rem]">
                                  Đơn hàng #{order.id}
                                </h3>
                                <div className="flex gap-[5px] pc:mt-1 text-[0.9rem] ">
                                  <span
                                    className={`pc:mr-4 font-medium text-[0.9rem] ${getStatusColorClass(
                                      order.order_status
                                    )}`}
                                  >
                                    {getStatusVietnamese(order.order_status)}
                                  </span>
                                  <span>{getItemCount(order)} sản phẩm</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="pc:text-[1rem] text-[0.9rem] font-bold">
                                {formatPrice(order.total_money)}
                              </p>
                              <p className="text-sm ">
                                {order.user_village_response.receiver_name}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Shipping provider selector and ship button */}
                        <div className="pc:ml-4 flex items-center">
                          <select
                            className={`mr-3 px-2 py-2 text-sm rounded outline-none ${
                              isDarkMode
                                ? "bg-light-100 text-dark-100 border border-dark-900"
                                : "bg-dark-500 text-light-100 border border-dark-600"
                            }`}
                            value={selectedShippingProviders[order.id] || ""}
                            onChange={(e) =>
                              handleSelectShippingProvider(
                                order.id,
                                parseInt(e.target.value)
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          >
                            {shippingProviders.map((provider) => (
                              <option key={provider.id} value={provider.id}>
                                {provider.name}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddShippingProvider(order.id);
                            }}
                            disabled={processingOrders[order.id]}
                            className={`px-3 py-[9px] rounded text-white text-sm font-medium ${
                              processingOrders[order.id]
                                ? "bg-blue-400"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            {processingOrders[order.id] ? (
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Đang xử lý
                              </div>
                            ) : (
                              "Bàn giao"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border-t px-6 py-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h4 className="font-medium mb-2">
                              Thông tin giao hàng
                            </h4>
                            <motion.div
                              whileHover={{
                                y: -2,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                              className={` rounded-[5px] border-[1px] mb-4 ${
                                isDarkMode
                                  ? "border-dark-800"
                                  : "bg-dark-500 border-transparent"
                              }`}
                            >
                              <div className="flex flex-col gap-[2px] ] border-b-[1px] p-[10px] text-[0.9rem] ">
                                <div className=" flex items-center gap-[5px]">
                                  <span className="font-bold">Người nhận:</span>
                                  <p className="text-[0.9rem]">
                                    {order.user_village_response.receiver_name}
                                  </p>
                                </div>
                                <div className=" flex items-center gap-[5px] ">
                                  <span className="font-bold">
                                    Số điện thoại:
                                  </span>
                                  <p className="text-[0.9rem]">
                                    {order.user_village_response.phone_number}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-[2px] p-[10px]  mt-[5px] text-[0.9rem]">
                                <span className="font-bold">Địa chỉ:</span>
                                <p className="">
                                  {order.user_village_response.specific_address}
                                  , {order.user_village_response.village_name},{" "}
                                  {order.user_village_response.district_name},{" "}
                                  {order.user_village_response.province_name}
                                </p>
                              </div>
                            </motion.div>

                            <h4 className="font-medium  mb-2">
                              Phương thức vận chuyển
                            </h4>
                            <motion.div
                              whileHover={{
                                y: -2,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                              className={` p-4 rounded-[5px] border-[1px] mb-4 ${
                                isDarkMode
                                  ? "border-dark-800"
                                  : "bg-dark-500 border-transparent"
                              }`}
                            >
                              <p className="text-[0.86rem] font-medium">
                                {order.shipping_type_response.name} -{" "}
                                {formatPrice(
                                  order.shipping_type_response.price
                                )}
                              </p>
                              <p
                                className={`text-[0.86rem] ${
                                  isDarkMode
                                    ? "text-dark-500"
                                    : "text-light-200"
                                }`}
                              >
                                {order.shipping_type_response.description}
                              </p>
                            </motion.div>

                            {/* Shipping Provider Selection */}
                            <h4 className="font-medium mb-2">
                              Đơn vị vận chuyển
                            </h4>
                            <motion.div
                              whileHover={{
                                y: -2,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                              className={` p-4 rounded-[5px] border-[1px] mb-4 ${
                                isDarkMode
                                  ? "border-dark-800"
                                  : "bg-dark-500 border-transparent"
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <label className="text-sm">
                                  Chọn đơn vị vận chuyển:
                                </label>
                                <select
                                  className={`w-full p-2 rounded outline-none ${
                                    isDarkMode
                                      ? "bg-light-100 text-dark-100 border border-dark-900"
                                      : "bg-dark-500 text-light-100 border border-dark-600"
                                  }`}
                                  value={
                                    selectedShippingProviders[order.id] || ""
                                  }
                                  onChange={(e) =>
                                    handleSelectShippingProvider(
                                      order.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                >
                                  {shippingProviders.map((provider) => (
                                    <option
                                      key={provider.id}
                                      value={provider.id}
                                    >
                                      {provider.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() =>
                                    handleAddShippingProvider(order.id)
                                  }
                                  disabled={processingOrders[order.id]}
                                  className={`mt-2 w-full py-2 rounded text-white text-sm font-medium ${
                                    processingOrders[order.id]
                                      ? "bg-blue-400"
                                      : "bg-blue-500 hover:bg-blue-600"
                                  }`}
                                >
                                  {processingOrders[order.id] ? (
                                    <div className="flex items-center justify-center">
                                      <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Đang xử lý
                                    </div>
                                  ) : (
                                    "Bàn giao cho đơn vị vận chuyển"
                                  )}
                                </button>
                              </div>
                            </motion.div>

                            {order.note && (
                              <>
                                <h4 className="font-medium mb-2">Ghi chú</h4>
                                <motion.div
                                  whileHover={{
                                    y: -2,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                  }}
                                  className={` p-[10px] rounded-[5px] border-[1px] mb-4 text-[0.9rem] ${
                                    isDarkMode
                                      ? "border-dark-800"
                                      : "bg-dark-500 border-transparent"
                                  }`}
                                >
                                  <p className="italic">{order.note}</p>
                                </motion.div>
                              </>
                            )}
                          </motion.div>

                          {/* Right Column */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h4 className="font-medium mb-2">
                              Chi tiết đơn hàng
                            </h4>
                            <motion.div
                              whileHover={{
                                y: -2,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                              className={` rounded-[5px] border-[1px] mb-4 ${
                                isDarkMode
                                  ? "border-dark-800"
                                  : "bg-dark-500 border-transparent"
                              }`}
                            >
                              <div className="border-b px-4 py-2 text-[1rem] flex justify-between">
                                <span className="font-medium">Sản phẩm</span>
                                <span>Giá</span>
                              </div>

                              <AnimatePresence>
                                {order.order_detail_responses.map(
                                  (item, index) => (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.1 + index * 0.05 }}
                                      className="border-b last:border-0 px-4 py-3"
                                    >
                                      <div className="flex justify-between">
                                        <div className="pr-4">
                                          <p className="font-medium">
                                            {item.product_name}
                                          </p>
                                          <p className="text-xs mt-1">
                                            {item.product_category_name} &gt;{" "}
                                            {item.product_sub_category_name}
                                          </p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                          <p>{formatPrice(item.price)}</p>
                                          <p className="text-sm text-dark-500">
                                            x{item.quantity}
                                          </p>
                                          {item.discount_percent > 0 && (
                                            <p className="text-xs text-green-600">
                                              -{item.discount_percent}%
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )
                                )}
                              </AnimatePresence>

                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-dark-50 px-4 py-3 flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">Tổng tiền</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold">
                                    {formatPrice(order.total_money)}
                                  </p>
                                </div>
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ListOrderPackeging;
