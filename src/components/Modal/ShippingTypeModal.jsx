const ShippingTypeModal = ({
  shippingTypes,
  onSelect,
  onClose,
  currentType,
  isDarkMode,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-[500px] rounded-lg shadow-lg ${
          isDarkMode ? "bg-white" : "bg-dark-200 text-white"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Chọn phương thức vận chuyển</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>
        <div className="p-4">
          {shippingTypes?.map((type) => (
            <div
              key={type.id}
              className={`p-3 mb-2 border rounded cursor-pointer hover:bg-gray-100 ${
                currentType === type.id ? "border-primary border-2" : ""
              }`}
              onClick={() => {
                onSelect(type);
                onClose();
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{type.name}</div>
                  <div className="text-sm">{type.description}</div>
                  <div className="text-sm text-green-500">
                    Nhận hàng trong {type.estimated_time} ngày
                  </div>
                </div>
                <div className="font-bold">
                  {type.price.toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingTypeModal;
