const ShopVouchers = ({ shop, isDarkMode }) => {
  if (!shop?.products[0]?.voucher_responses?.length) return null;

  return (
    <div
      className={`w-full flex items-center px-[10px] py-[10px] mt-[10px] rounded-[5px] ${
        isDarkMode ? "border-[1px] bg-[#f1cece]" : "bg-dark-400"
      }`}
    >
      <div className="flex overflow-x-auto gap-2">
        {shop.products[0].voucher_responses
          .filter((voucher) => {
            const currentDate = new Date();
            const startDate = new Date(voucher.start_date);
            const endDate = new Date(voucher.end_date);
            return currentDate >= startDate && currentDate <= endDate;
          })
          .slice(0, 3)
          .map((voucher, idx) => (
            <div
              key={`${shop.shopInfo.id}-voucher-${idx}`}
              className="flex-shrink-0 px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
            >
              {voucher.description || "Giảm giá"}: Giảm{" "}
              {voucher.discount_percent}% (đơn tối thiểu{" "}
              {voucher.minimum_order_value?.toLocaleString("vi-VN") || 0}đ)
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShopVouchers;
