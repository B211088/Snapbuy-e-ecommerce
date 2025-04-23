const CheckoutBar = ({
  isDarkMode,
  selectAll,
  handleSelectAll,
  totalSelectedItems,
  calculateTotal,
  calculateTotalDiscount,
  handleOrder,
}) => (
  <div
    className={`w-full fixed bottom-0 left-0 flex justify-center z-50 shadow-lg ${
      isDarkMode ? "bg-white" : "bg-dark-200 text-white"
    }`}
  >
    <div
      className={`w-full max-w-[90%] h-[80px] flex items-center justify-between px-6`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="font-medium">Chọn tất cả</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              Tổng thanh toán ({totalSelectedItems} sản phẩm):
            </span>
            <span className="text-xl font-bold text-red-500">
              {calculateTotal().toLocaleString("vi-VN")}đ
            </span>
          </div>
          {calculateTotalDiscount() > 0 && (
            <span className="text-sm text-gray-400">
              Đã giảm {calculateTotalDiscount().toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <button
          onClick={handleOrder}
          className={`px-10 py-3 rounded-md font-medium ${
            totalSelectedItems === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          disabled={totalSelectedItems === 0}
        >
          Đặt hàng ({totalSelectedItems})
        </button>
      </div>
    </div>
  </div>
);

export default CheckoutBar;
