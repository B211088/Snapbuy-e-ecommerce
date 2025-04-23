import React, { useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";

const Payment = () => {
  const { isDarkMode } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: "bank", // "bank" hoặc "momo"
    name: "",
    accountNumber: "",
    owner: "",
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMethod({
      ...newMethod,
      [name]: value,
    });
  };

  const handleAddMethod = () => {
    // Kiểm tra tất cả các trường bắt buộc
    if (newMethod.type === "bank" && !newMethod.name) {
      setError("Vui lòng nhập tên ngân hàng");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!newMethod.accountNumber) {
      setError("Vui lòng nhập số tài khoản");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!newMethod.owner) {
      setError("Vui lòng nhập tên chủ tài khoản");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Tất cả dữ liệu hợp lệ, tiến hành thêm
    setPaymentMethods([...paymentMethods, { ...newMethod, id: Date.now() }]);
    setNewMethod({
      type: "bank",
      name: "",
      accountNumber: "",
      owner: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  return (
    <div className="w-full flex gap-[20px]">
      {/* Thông báo lỗi */}
      {showError && (
        <div className="fixed top-[20px] right-[20px] z-50 p-[15px] rounded-[5px] bg-red-500 text-white shadow-lg animate-fadeIn">
          <div className="flex items-center gap-[10px]">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
            <button
              onClick={() => setShowError(false)}
              className="ml-[10px] text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      <div
        className={`w-full flex flex-col rounded-[5px] ${
          isDarkMode ? "bg-white text-dark-100" : "bg-dark-200 text-white"
        }`}
      >
        {/* Header */}
        <div className="w-full flex mb:flex-col items-center justify-between pc:p-[20px] mb:p-[10px] border-b-[1px] border-dashed">
          <div className="w-full flex items-center font-nunito gap-[10px]">
            <div
              className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
                isDarkMode ? "text-dark-300" : "text-light-300"
              }`}
            >
              <i className="fa-solid fa-wallet"></i>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="font-bold text-[1.2rem]">
                Phương thức thanh toán
              </h1>
              <p
                className={`font-normal text-[0.95rem] ${
                  isDarkMode ? " text-dark-300" : "text-light-300"
                }`}
              >
                Quản lý các phương thức thanh toán của bạn
              </p>
            </div>
          </div>
          <div
            className={`w-full flex pc:justify-end font-normal text-[1rem] mb:py-[10px]`}
          >
            {!showAddForm && (
              <div
                className="flex items-center justify-center gap-[7px] truncate rounded-[5px] text-dark-1000 border-[1px] border-dark-700 p-[3px] cursor-pointer"
                onClick={() => setShowAddForm(true)}
              >
                <div className="w-full flex items-center justify-center gap-[5px] px-[20px] py-[5px] rounded-[4px] bg-primary">
                  <span className="font-bold text-[0.8rem] uppercase">
                    Thêm phương thức thanh toán
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-[20px]">
          {/* Danh sách phương thức thanh toán */}
          {paymentMethods.length > 0 ? (
            <div className="w-full">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`mb-[15px] p-[15px] rounded-[5px] ${
                    isDarkMode
                      ? "bg-light-100 border-[1px] border-light-300"
                      : "bg-dark-300 border-[1px] border-dark-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[15px]">
                      <div
                        className={`w-[40px] h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-[1.2rem] ${
                          isDarkMode
                            ? "bg-light-300 text-dark-500"
                            : "bg-dark-400 text-light-300"
                        }`}
                      >
                        <i
                          className={
                            method.type === "bank"
                              ? "fa-solid fa-building-columns"
                              : "fa-solid fa-wallet"
                          }
                        ></i>
                      </div>
                      <div>
                        <div className="font-bold">
                          {method.type === "bank"
                            ? `Ngân hàng ${method.name}`
                            : "Ví MoMo"}
                        </div>
                        <div
                          className={`text-[0.9rem] ${
                            isDarkMode ? "text-dark-400" : "text-light-400"
                          }`}
                        >
                          Số tài khoản: {method.accountNumber}
                        </div>
                        <div
                          className={`text-[0.9rem] ${
                            isDarkMode ? "text-dark-400" : "text-light-400"
                          }`}
                        >
                          Chủ tài khoản: {method.owner}
                        </div>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDeleteMethod(method.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`w-full p-[20px] text-center rounded-[5px] ${
                isDarkMode
                  ? "bg-light-200 text-dark-400"
                  : "bg-dark-300 text-light-400"
              }`}
            >
              Bạn chưa có phương thức thanh toán nào
            </div>
          )}

          {/* Form thêm phương thức thanh toán */}
          {showAddForm && (
            <div
              className={`mt-[20px] p-[20px] rounded-[5px] ${
                isDarkMode
                  ? "bg-light-100 border-[1px] border-light-300"
                  : "bg-dark-300 border-[1px] border-dark-400"
              }`}
            >
              <h3 className="font-bold text-[1.1rem] mb-[15px]">
                Thêm phương thức thanh toán mới
              </h3>

              <div className="mb-[15px]">
                <label
                  className={`block mb-[5px] ${
                    isDarkMode ? "text-dark-300" : "text-light-500"
                  }`}
                >
                  Loại phương thức
                </label>
                <select
                  name="type"
                  value={newMethod.type}
                  onChange={handleInputChange}
                  className={`w-full p-[10px] rounded-[5px] border-[1px] outline-none text-[0.9rem] ${
                    isDarkMode
                      ? "bg-white border-light-400 text-dark-300"
                      : "bg-dark-200 border-dark-500 text-light-100"
                  }`}
                >
                  <option value="bank">Ngân hàng</option>
                  <option value="momo">Ví MoMo</option>
                </select>
              </div>

              {newMethod.type === "bank" && (
                <div className="mb-[15px]">
                  <label
                    className={`block mb-[5px] ${
                      isDarkMode ? "text-dark-500" : "text-light-500"
                    }`}
                  >
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="VCB, BIDV, Agribank,..."
                    value={newMethod.name}
                    onChange={handleInputChange}
                    className={`w-full p-[10px] rounded-[5px] border-[1px] outline-none text-[0.9rem]  ${
                      isDarkMode
                        ? "bg-white border-light-400 text-dark-300"
                        : "bg-dark-200 border-dark-500 text-light-100"
                    }`}
                  />
                </div>
              )}

              <div className="mb-[15px]">
                <label
                  className={`block mb-[5px] ${
                    isDarkMode ? "text-dark-500" : "text-light-500"
                  }`}
                >
                  Số tài khoản
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Nhập số tài khoản hoặc số điện thoại"
                  value={newMethod.accountNumber}
                  onChange={handleInputChange}
                  className={`w-full p-[10px] rounded-[5px] border-[1px] outline-none text-[0.9rem]  ${
                    isDarkMode
                      ? "bg-white border-light-400 text-dark-300"
                      : "bg-dark-200 border-dark-500 text-light-100"
                  }`}
                />
              </div>

              <div className="mb-[15px]">
                <label
                  className={`block mb-[5px] ${
                    isDarkMode ? "text-dark-500" : "text-light-500"
                  }`}
                >
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  name="owner"
                  placeholder="Nhập tên chủ tài khoản"
                  value={newMethod.owner}
                  onChange={handleInputChange}
                  className={`w-full p-[10px] rounded-[5px] border-[1px] outline-none text-[0.9rem]  ${
                    isDarkMode
                      ? "bg-white border-light-400 text-dark-300"
                      : "bg-dark-200 border-dark-500 text-light-100"
                  }`}
                />
              </div>

              <div className="flex gap-[10px]">
                <button
                  onClick={handleAddMethod}
                  className="px-[80px] py-[8px] bg-primary text-dark-1000 rounded-[5px] font-bold text-[0.9rem]"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-[60px] py-[8px] rounded-[5px] font-bold text-[0.9rem] border ${
                    isDarkMode
                      ? "bg-light-100 text-dark-300 border-dark-500"
                      : "bg-dark-400 text-light-800 border-transparent"
                  }`}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
