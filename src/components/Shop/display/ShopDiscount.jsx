import React, { useState, useEffect } from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useConfirm } from "../../Notify/ConfirmModal";

const ShopDiscount = () => {
  const { isDarkMode } = useTheme();
  const [vouchers, setVouchers] = useState([]);
  const { confirm, ConfirmComponent } = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState({
    id: null,
    code: "",
    discount: 0,
    type: "percentage", // percentage or fixed
    minPurchase: 0,
    expiryDate: "",
    isActive: true,
  });

  // Fake data for demonstration
  useEffect(() => {
    const demoVouchers = [
      {
        id: 1,
        code: "SUMMER25",
        discount: 25,
        type: "percentage",
        minPurchase: 100000,
        expiryDate: "2025-06-30",
        isActive: true,
      },
      {
        id: 2,
        code: "WELCOME50K",
        discount: 50000,
        type: "fixed",
        minPurchase: 200000,
        expiryDate: "2025-05-15",
        isActive: true,
      },
    ];
    setVouchers(demoVouchers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentVoucher({
      ...currentVoucher,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addVoucher = () => {
    setCurrentVoucher({
      id: null,
      code: "",
      discount: 0,
      type: "percentage",
      minPurchase: 0,
      expiryDate: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const editVoucher = (voucher) => {
    setCurrentVoucher(voucher);
    setShowForm(true);
  };

  const deleteVoucher = (id) => {
    confirm({
      message: "Bạn có chắc muốn chương trình giảm giá này?",
      onConfirm: async () => {
        return;
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentVoucher.id) {
      // Update existing voucher
      setVouchers(
        vouchers.map((voucher) =>
          voucher.id === currentVoucher.id ? currentVoucher : voucher
        )
      );
    } else {
      // Add new voucher
      const newVoucher = {
        ...currentVoucher,
        id: Date.now(),
      };
      setVouchers([...vouchers, newVoucher]);
    }

    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <OutLetContainer>
      <ConfirmComponent />
      <div
        className={`w-full flex flex-col px-5 py-3 border-b border-dashed ${
          isDarkMode ? "border-light-300" : "border-dark-300"
        }`}
      >
        <div className="flex items-center font-nunito gap-3 pb-3">
          <div
            className={`w-12 h-12 min-w-12 flex items-center justify-center rounded-full border ${
              isDarkMode
                ? "text-light-1000 border-light-300"
                : "text-dark-300 border-dark-300"
            }`}
          >
            <i className="fa-solid fa-tags"></i>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-bold text-xl">Quản lý mã giảm giá</h1>
            <p
              className={`font-normal text-sm ${
                isDarkMode ? "text-light-900" : "text-dark-300"
              }`}
            >
              Tạo và quản lý voucher giảm giá cho cửa hàng
            </p>
          </div>
        </div>
      </div>

      <div className={`p-5 ${isDarkMode ? "bg-light-100" : "bg-dark-300"}`}>
        <div className="flex justify-between mb-5">
          <h2
            className={`text-lg font-bold ${
              isDarkMode ? "text-light-900" : "text-dark-900"
            }`}
          >
            Danh sách mã giảm giá
          </h2>
          <button
            onClick={addVoucher}
            className={`px-4 py-2 rounded-md ${
              isDarkMode
                ? "bg-primary text-light-100 hover:bg-light-800"
                : "bg-dark-500 text-dark-100 hover:bg-dark-400"
            }`}
          >
            <i className="fa-solid fa-plus mr-2"></i>Thêm voucher
          </button>
        </div>

        {showForm && (
          <div
            className={`mb-6 p-4 rounded-md border ${
              isDarkMode
                ? "bg-light-200 border-light-300"
                : "bg-dark-400 border-dark-500"
            }`}
          >
            <h3
              className={`text-md font-bold mb-3 ${
                isDarkMode ? "text-light-900" : "text-dark-900"
              }`}
            >
              {currentVoucher.id ? "Chỉnh sửa voucher" : "Thêm voucher mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Mã voucher:
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={currentVoucher.code}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-light-100 border-light-300 text-light-900"
                        : "bg-dark-300 border-dark-400 text-dark-100"
                    }`}
                    placeholder="VD: SUMMER25"
                  />
                </div>
                <div>
                  <label
                    className={`block mb-1 ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Loại giảm giá:
                  </label>
                  <select
                    name="type"
                    value={currentVoucher.type}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-light-100 border-light-300 text-light-900"
                        : "bg-dark-300 border-dark-400 text-dark-100"
                    }`}
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VND)</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block mb-1 ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    {currentVoucher.type === "percentage"
                      ? "Phần trăm giảm:"
                      : "Số tiền giảm (VND):"}
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={currentVoucher.discount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={currentVoucher.type === "percentage" ? "100" : ""}
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-light-100 border-light-300 text-light-900"
                        : "bg-dark-300 border-dark-400 text-dark-100"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-1 ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Giá trị đơn hàng tối thiểu (VND):
                  </label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={currentVoucher.minPurchase}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-light-100 border-light-300 text-light-900"
                        : "bg-dark-300 border-dark-400 text-dark-100"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-1 ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Ngày hết hạn:
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={currentVoucher.expiryDate}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-light-100 border-light-300 text-light-900"
                        : "bg-dark-300 border-dark-400 text-dark-100"
                    }`}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={currentVoucher.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="isActive"
                    className={!isDarkMode ? "text-light-700" : "text-dark-300"}
                  >
                    Kích hoạt voucher
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-primary text-light-100 hover:bg-light-800"
                      : "bg-dark-500 text-dark-100 hover:bg-dark-400"
                  }`}
                >
                  {currentVoucher.id ? "Cập nhật" : "Tạo mới"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-light-300 text-light-700 hover:bg-light-400"
                      : "bg-dark-400 text-dark-300 hover:bg-dark-500"
                  }`}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {vouchers.length > 0 ? (
          <div
            className={`overflow-x-auto rounded-md border ${
              isDarkMode ? "border-light-300" : "border-dark-400"
            }`}
          >
            <table className="w-full text-[0.8rem]">
              <thead className={isDarkMode ? "bg-light-200" : "bg-dark-400"}>
                <tr>
                  <th
                    className={`py-3 px-4 text-left ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Mã
                  </th>
                  <th
                    className={`py-3 px-4 text-left ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Giảm giá
                  </th>
                  <th
                    className={`py-3 px-4 text-left ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Đơn tối thiểu
                  </th>
                  <th
                    className={`py-3 px-4 text-left ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Hết hạn
                  </th>
                  <th
                    className={`py-3 px-4 text-left ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Trạng thái
                  </th>
                  <th
                    className={`py-3 px-4 text-right ${
                      isDarkMode ? "text-light-700" : "text-dark-300"
                    }`}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr
                    key={voucher.id}
                    className={
                      isDarkMode
                        ? "border-t border-light-300"
                        : "border-t border-dark-400"
                    }
                  >
                    <td
                      className={`py-3 px-4 ${
                        isDarkMode ? "text-light-900" : "text-dark-100"
                      }`}
                    >
                      <span className="font-bold">{voucher.code}</span>
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        isDarkMode ? "text-light-900" : "text-dark-100"
                      }`}
                    >
                      {voucher.type === "percentage"
                        ? `${voucher.discount}%`
                        : formatCurrency(voucher.discount)}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        isDarkMode ? "text-light-900" : "text-dark-100"
                      }`}
                    >
                      {formatCurrency(voucher.minPurchase)}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        isDarkMode ? "text-light-900" : "text-dark-100"
                      }`}
                    >
                      {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className={`py-3 px-4`}>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          voucher.isActive
                            ? isDarkMode
                              ? "bg-green-600 text-light-100"
                              : "bg-dark-500 text-dark-100"
                            : isDarkMode
                            ? "bg-light-300 text-light-600"
                            : "bg-dark-400 text-dark-300"
                        }`}
                      >
                        {voucher.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => editVoucher(voucher)}
                        className={`mr-2 ${
                          isDarkMode
                            ? "text-light-600 hover:text-light-700"
                            : "text-dark-300 hover:text-dark-200"
                        }`}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button
                        onClick={() => deleteVoucher(voucher.id)}
                        className={
                          isDarkMode
                            ? "text-light-500 hover:text-light-600"
                            : "text-dark-400 hover:text-dark-300"
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className={`text-center py-8 ${
              isDarkMode ? "text-light-400" : "text-dark-400"
            }`}
          >
            <i className="fa-solid fa-receipt text-4xl mb-3"></i>
            <p>Chưa có mã giảm giá nào. Hãy tạo voucher đầu tiên!</p>
          </div>
        )}
      </div>
    </OutLetContainer>
  );
};

export default ShopDiscount;
