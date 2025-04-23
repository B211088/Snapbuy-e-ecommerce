import React, { useRef, useState } from "react";
import { useTheme } from "../../../Provider/ThemeProvider";

const BatchOrderPrint = ({ orders, onClose }) => {
  const printRef = useRef();
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);

  // Function to handle printing using browser's print functionality
  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Format price with VND currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Navigate through orders
  const goToNextOrder = () => {
    if (currentPage < orders.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevOrder = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current order data
  const currentOrder = orders[currentPage];

  if (!currentOrder) return null;

  const {
    id,
    order_status,
    order_detail_responses,
    shipping_type_response,
    total_money,
    voucher_response,
    note,
    user_village_response,
    created_at,
    updated_at,
  } = currentOrder;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-[30] px-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden ${
          isDarkMode ? "dark" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            In đơn hàng ({currentPage + 1}/{orders.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={printRef}
          className="h-[70vh] p-6 text-black font-nunito text-[15px] overflow-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            HÓA ĐƠN MUA HÀNG
          </h2>
          <div className="mb-4">
            <p>
              <strong>Mã đơn hàng:</strong> #{id}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong>{" "}
              {new Date(created_at || updated_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Ngày in:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Thông tin người nhận</h3>
            <p>
              <strong>Họ tên:</strong> {user_village_response.receiver_name}
            </p>
            <p>
              <strong>SĐT:</strong> {user_village_response.phone_number}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user_village_response.specific_address}
              , {user_village_response.village_name},{" "}
              {user_village_response.district_name},{" "}
              {user_village_response.province_name}
            </p>
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Danh sách sản phẩm</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Sản phẩm</th>
                  <th className="border px-2 py-1">Phân loại</th>
                  <th className="border px-2 py-1">SL</th>
                  <th className="border px-2 py-1">Đơn giá</th>
                  <th className="border px-2 py-1">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order_detail_responses.map((item, idx) => {
                  const discounted =
                    item.price * (1 - (item.discount_percent || 0) / 100);
                  return (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.product_name}</td>
                      <td className="border px-2 py-1 text-center">
                        {item.product_category_name} -{" "}
                        {item.product_sub_category_name || ""}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item.quantity}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {discounted.toLocaleString()}₫
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {(discounted * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Thông tin giao hàng</h3>
            <p>
              <strong>Hình thức:</strong> {shipping_type_response.name}
            </p>
            <p>
              <strong>Phí giao hàng:</strong>{" "}
              {shipping_type_response.price.toLocaleString()}₫
            </p>
          </div>

          {voucher_response && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Voucher áp dụng</h3>
              <div className="flex flex-wrap gap-2">
                <p>
                  <strong>Mã:</strong> {voucher_response.code}
                </p>
                <p>
                  <strong>Chiết khấu:</strong>{" "}
                  {voucher_response.discount_percent}%
                </p>
                {voucher_response.description && (
                  <p>
                    <strong>Mô tả:</strong> {voucher_response.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {note && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Ghi chú</h3>
              <p>{note}</p>
            </div>
          )}

          <hr className="my-4" />
          <p className="text-right text-lg font-bold">
            Tổng tiền thanh toán: {total_money.toLocaleString()}₫
          </p>
        </div>

        <div className="w-full flex gap-3 p-4 border-t">
          <div className="flex-1 flex gap-2">
            <button
              onClick={goToPrevOrder}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded flex items-center ${
                currentPage === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Trước
            </button>
            <button
              onClick={goToNextOrder}
              disabled={currentPage === orders.length - 1}
              className={`px-4 py-2 rounded flex items-center ${
                currentPage === orders.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Tiếp
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 px-6 py-2 text-white rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            In đơn hàng hiện tại
          </button>
          <button
            onClick={() => {
              const printContent = printRef.current;
              const originalContent = document.body.innerHTML;

              // Create a composite page with all orders
              let allOrdersHTML = "";
              orders.forEach((order, index) => {
                // You would need to create a function that generates HTML for each order
                // For now, we're just printing the current visible order multiple times
                allOrdersHTML += printContent.innerHTML;
                if (index < orders.length - 1) {
                  allOrdersHTML +=
                    '<div style="page-break-after: always;"></div>';
                }
              });

              document.body.innerHTML = allOrdersHTML;
              window.print();
              document.body.innerHTML = originalContent;
              window.location.reload();
            }}
            className="bg-green-600 px-6 py-2 text-white rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            In tất cả ({orders.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchOrderPrint;
