import React, { useState, useEffect } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import { useNotify } from "../../components/Notify/NotifyModal";
import { useConfirm } from "../Notify/ConfirmModal";
import ModalContainer from "../Modal/ModalContainer";

const Order = () => {
  const {
    authState: { user },
    getOrders,
    cancelOrder,
    createFeedBack,
    updateFeedBack,
  } = useAuth();
  const { isDarkMode } = useTheme();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const { confirm, ConfirmComponent } = useConfirm();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    order_detail_id: null,
    order_id: null,
    user_id: null,
    content: "",
    rating: 5,
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentOrderDetail, setCurrentOrderDetail] = useState(null);
  const [isEditFeedback, setIsEditFeedback] = useState(false);

  // Map status values to tab display names
  const tabsMap = {
    PENDING: "Chưa xác nhận",
    PREPARING: "Đang chuẩn bị",
    HANDED_OVER_TO_CARRIER: "Đã giao cho vận chuyển",
    SHIPPING: "Đang giao hàng",
    COMPLETED: "Đã giao",
    CANCEL: "Đã hủy",
  };

  console.log({ orders });

  // Navigation tabs data
  const tabs = [
    { id: "PENDING", label: "Chưa xác nhận" },
    { id: "PACKAGING", label: "Đang chuẩn bị" },
    { id: "HANDED_OVER_TO_CARRIER", label: "Giao cho vận chuyển" },
    { id: "SHIPPING", label: "Đang giao" },
    { id: "COMPLETED", label: "Đã giao" },
    { id: "CANCEL", label: "Đã hủy" },
  ];

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleGetOrderByStatus = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await getOrders(user?.id, activeTab);
      if (result.success) {
        setOrders(result.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      handleGetOrderByStatus();
    };

    fetchOrders();
  }, [activeTab, user?.id, getOrders]);

  const handleCancleOrder = async (orderId) => {
    confirm({
      message: "Bạn có thật sự muốn hủy hàng không?",
      onConfirm: async () => {
        try {
          const response = await cancelOrder(user?.id, orderId);
          if (response.success) {
            notifySuccess("Huỷ đơn hàng thành công");
            await handleGetOrderByStatus();
            return;
          }
          notifyWarning("Hủy đơn hàng không thành công");
          return;
        } catch (error) {
          notifyError("Lỗi khi hủy đơn hàng");
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  // Open feedback modal
  const openFeedbackModal = (orderDetail, orderId, isEdit = false) => {
    setCurrentOrderDetail(orderDetail);
    setIsEditFeedback(isEdit);

    setFeedbackData({
      order_detail_id: orderDetail.id,
      order_id: orderId,
      user_id: user?.id,
      content: orderDetail.feedback?.content || "",
      rating: orderDetail.feedback?.rating || 5,
    });

    setShowFeedbackModal(true);
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setCurrentOrderDetail(null);
    setFeedbackData({
      order_detail_id: null,
      order_id: null,
      user_id: null,
      content: "",
      rating: 5,
    });
  };

  // Handle feedback input change
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    try {
      let response;

      if (isEditFeedback) {
        response = await updateFeedBack(user?.id, feedbackData);
      } else {
        response = await createFeedBack(feedbackData);
      }

      if (response.success) {
        notifySuccess(
          isEditFeedback
            ? "Cập nhật đánh giá thành công"
            : "Đánh giá thành công"
        );
        await handleGetOrderByStatus();
        closeFeedbackModal();
      } else {
        notifyWarning(
          isEditFeedback
            ? "Cập nhật đánh giá không thành công"
            : "Đánh giá không thành công"
        );
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  // Render feedback modal
  const renderFeedbackModal = () => {
    if (!showFeedbackModal || !currentOrderDetail) return null;

    return (
      <ModalContainer>
        <div className="flex justify-between items-center py-[10px] px-[20px]  border-b-[1px] border-dashed">
          <div className=" flex items-center gap-[10px] ">
            <h3 className="text-[1.1rem] font-medium">
              {isEditFeedback ? "Cập nhật đánh giá" : "Đánh giá sản phẩm"}
            </h3>
          </div>

          <button
            onClick={closeFeedbackModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="py-[10px] px-[20px]">
          <div className="flex items-center ">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={currentOrderDetail.product_category_image_url}
                alt={currentOrderDetail.product_name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">{currentOrderDetail.product_name}</h4>
              <p className="text-sm text-dark-700">
                {currentOrderDetail.product_category_name}{" "}
                {currentOrderDetail.product_sub_category_name
                  ? `> ${currentOrderDetail.product_sub_category_name}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="w-full flex items-center gap-[10px] py-[10px]">
            <label className="block text-sm font-medium ">Đánh giá</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFeedbackData({ ...feedbackData, rating: star })
                  }
                  className="focus:outline-none"
                >
                  <i
                    className={`text-[1rem] fa-solid fa-star ${
                      star <= feedbackData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  ></i>
                </button>
              ))}
            </div>
          </div>

          <div className="">
            <textarea
              name="content"
              value={feedbackData.content}
              onChange={handleFeedbackChange}
              rows="3"
              className={`w-full border rounded-md p-2 outline-none min-h-[100px] max-h-[120px] text-[0.86rem] ${
                isDarkMode ? "border-gray-300 " : "border-gray-700 bg-dark-400 "
              }`}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col  gap-[10px] py-[10px] px-[20px]">
          <button
            onClick={handleSubmitFeedback}
            className="w-full px-4 py-[8px] bg-primary text-white rounded-md  font-bold"
          >
            {isEditFeedback ? "Cập nhật" : "Gửi đánh giá"}
          </button>{" "}
          <button
            onClick={closeFeedbackModal}
            className={`w-full px-4 py-[6px] border rounded-md font-bold ${
              isDarkMode
                ? "border-dark-300 text-gray-700 "
                : "border-transparent bg-dark-400 text-gray-300 "
            }`}
          >
            Hủy
          </button>
        </div>
      </ModalContainer>
    );
  };

  // Render order items
  const renderOrderItems = (orderDetails, orderId) => {
    return orderDetails.map((item) => (
      <div key={item.id} className="flex items-center py-2 border-b">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={item.product_category_image_url}
            alt={item.product_name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-medium">{item.product_name}</h3>
          <p className="text-sm text-gray-500">
            {item.product_category_name}{" "}
            {item.product_sub_category_name
              ? `> ${item.product_sub_category_name}`
              : ""}
          </p>
          <div className="flex justify-between mt-1">
            <span className="text-sm">
              {formatPrice(item.price)} x {item.quantity}
            </span>
            <span className="font-medium">{formatPrice(item.total_price)}</span>
          </div>

          {/* Feedback buttons for completed orders */}
          {activeTab === "COMPLETED" && (
            <div className="mt-2">
              {item.feedback ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`w-4 h-4 ${
                            index < item.feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {item.feedback.content}
                    </p>
                  </div>
                  <button
                    onClick={() => openFeedbackModal(item, orderId, true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openFeedbackModal(item, orderId)}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
                >
                  Đánh giá
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    ));
  };

  // Render order card
  const renderOrderCard = (order) => {
    return (
      <div
        key={order.order_id}
        className={`mb-4 rounded-lg shadow overflow-hidden border ${
          isDarkMode
            ? "bg-white text-dark-100 border-gray-200"
            : "bg-dark-400 text-white border-gray-700"
        }`}
      >
        <div
          className={`px-4 py-3 border-b flex justify-between items-center ${
            isDarkMode
              ? "border-gray-200 bg-gray-50"
              : "border-gray-700 bg-dark-300"
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium mr-2">Cửa hàng:</span>
            <span>{order.shop_name}</span>
          </div>
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
              {tabsMap[activeTab]}
            </span>
          </div>
        </div>

        <div className="p-4">
          {renderOrderItems(order.order_details_responses, order.order_id)}

          <div className="mt-4 flex justify-between items-center pt-3 ">
            <div>
              <span className="text-sm">Mã đơn: #{order.order_id}</span>
            </div>
            <div className="text-right">
              <div className="text-sm">Tổng tiền:</div>
              <div className="text-lg font-bold text-red-600">
                {formatPrice(order.orderPrice)}
              </div>
            </div>
          </div>

          {activeTab === "PENDING" && (
            <div className="mt-3 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                onClick={() => handleCancleOrder(order?.order_id)}
              >
                Hủy đơn
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium">Không có đơn hàng</h3>
        <p className="mt-1 text-sm text-gray-500">
          Chưa có đơn hàng nào trong trạng thái này.
        </p>
      </div>
    );
  };

  // Render tab content based on orders data
  const renderTabContent = () => {
    if (loading) return renderLoading();
    if (!orders || orders.length === 0) return renderEmpty();

    return (
      <div className="p-4">{orders.map((order) => renderOrderCard(order))}</div>
    );
  };

  return (
    <div className="w-full flex gap-[20px]">
      <ConfirmComponent />
      {renderFeedbackModal()}
      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-white text-dark-100" : "bg-dark-200 text-white"
        }`}
      >
        <div className="w-full">
          <div className="w-full flex mb:flex-col items-center justify-between pc:p-[20px] mb:p-[10px] border-b-[1px] border-dashed">
            <div className="w-full flex items-center font-nunito gap-[10px]">
              <div
                className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
                  isDarkMode ? "text-dark-300" : "text-light-300"
                }`}
              >
                <i className="fa-solid fa-clipboard-list"></i>
              </div>
              <div className="flex flex-col truncate">
                <h1 className="font-bold text-[1.2rem]">Đơn hàng</h1>
                <p
                  className={`font-normal text-[0.95rem] ${
                    isDarkMode ? " text-dark-300" : "text-light-300"
                  }`}
                >
                  Quản lý các đơn hàng của bạn
                </p>
              </div>
            </div>
            <div
              className={`w-full flex pc:justify-end font-normal text-[1rem] mb:py-[10px]`}
            ></div>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "border-b-2 border-blue-400 text-blue-400"
                    : isDarkMode
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div
            className={`rounded-[5px] ${
              isDarkMode ? "bg-gray-50" : "bg-dark-300"
            }`}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
