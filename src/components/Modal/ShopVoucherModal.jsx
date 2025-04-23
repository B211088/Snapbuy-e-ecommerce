import React, { useState, useEffect } from "react";

const ShopVoucherModal = ({
  onClose,
  onSelectVoucher,
  shopId,
  isDarkMode,
  currentOrderTotal,
  vouchers = [],
  selectedVoucherId = null,
}) => {
  const [selectedId, setSelectedId] = useState(selectedVoucherId);

  // Format date to display in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSelectVoucher = (voucher) => {
    if (voucher.id === selectedId) {
      // If clicking the already selected voucher, deselect it
      setSelectedId(null);
      onSelectVoucher(null);
    } else {
      // Select the new voucher
      setSelectedId(voucher.id);
      onSelectVoucher(voucher);
    }
  };

  const isVoucherApplicable = (voucher) => {
    return currentOrderTotal >= voucher.minimum_order_value;
  };

  const calculateDiscount = (voucher) => {
    return (currentOrderTotal * voucher.discount_percent) / 100;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`relative w-[500px] mb:w-[90%] max-h-[80vh] rounded-lg shadow-lg overflow-hidden ${
          isDarkMode ? "bg-white text-black" : "bg-dark-100 text-white"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Chọn Voucher</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-500">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {vouchers.length === 0 ? (
            <div className="text-center py-8">
              <p>Không có voucher nào khả dụng cho shop này</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vouchers.map((voucher) => {
                const isApplicable = isVoucherApplicable(voucher);

                return (
                  <div
                    key={voucher.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedId === voucher.id
                        ? "border-primary shadow-md"
                        : isApplicable
                        ? "hover:border-primary"
                        : "opacity-60"
                    }`}
                    onClick={() => isApplicable && handleSelectVoucher(voucher)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-red-500">
                            Giảm {voucher.discount_percent}%
                          </span>
                          <span className="text-sm px-2 py-0.5 bg-red-100 text-red-600 rounded">
                            {voucher.code}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500">
                          {voucher.description}
                        </p>

                        <div className="mt-2 text-sm">
                          <p>
                            Đơn tối thiểu{" "}
                            {voucher.minimum_order_value.toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                          <p>
                            HSD: {formatDate(voucher.start_date)} -{" "}
                            {formatDate(voucher.end_date)}
                          </p>
                        </div>

                        {!isApplicable && (
                          <div className="mt-1 text-sm text-red-500">
                            Đơn hàng chưa đạt giá trị tối thiểu
                          </div>
                        )}
                      </div>

                      {isApplicable && (
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                          {selectedId === voucher.id && (
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedId === voucher.id && (
                      <div className="mt-2 pt-2 border-t text-sm">
                        <p className="text-green-500">
                          Tiết kiệm:{" "}
                          {calculateDiscount(voucher).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              const selectedVoucher = vouchers.find((v) => v.id === selectedId);
              onSelectVoucher(selectedVoucher || null);
              onClose();
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopVoucherModal;
