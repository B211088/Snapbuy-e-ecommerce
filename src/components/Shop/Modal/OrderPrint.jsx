// OrderPrint.js
import { useRef } from "react";
import { useTheme } from "../../../Provider/ThemeProvider";

const OrderPrint = ({ orderData, onCloseModal }) => {
  const printRef = useRef();
  const { isDarkMode } = useTheme();

  const {
    id,
    order_detail_responses,
    shipping_type_response,
    total_money,
    voucher_response,
    note,
    user_village_response,
  } = orderData;

  // Handle printing using browser's print functionality
  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-[30] px-4"
      onClick={onCloseModal}
    >
      <div
        className={`w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden ${
          isDarkMode ? "dark" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={printRef}
          className=" h-[80vh] p-6 text-black font-nunito text-[15px] overflow-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            HÓA ĐƠN MUA HÀNG
          </h2>
          <div className="mb-4">
            <p>
              <strong>Mã đơn hàng:</strong> #{id}
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
                  <th className="border px-2 py-1">SL</th>
                  <th className="border px-2 py-1">Đơn giá</th>
                  <th className="border px-2 py-1">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order_detail_responses.map((item, idx) => {
                  const discounted =
                    item.price * (1 - item.discount_percent / 100);
                  return (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.product_name}</td>
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
            <div className="flex items-center gap-[5px] mb-4">
              <h3 className="text-lg font-semibold mb-1">Voucher áp dụng</h3>
              <p>
                <strong>Mã:</strong> {voucher_response.code}
              </p>
              <p>
                <strong>Chiết khấu:</strong> {voucher_response.discount_percent}
                %
              </p>
              <p>
                <strong>Mô tả:</strong> {voucher_response.description}
              </p>
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

        <div className="w-full flex flex-col p-[10px]">
          <button
            onClick={handlePrint}
            className="bg-blue-600 w-full text-white px-4 py-2 rounded"
          >
            In đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPrint;
