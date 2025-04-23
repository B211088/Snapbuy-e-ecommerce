const PriceDisplay = ({ item, isDarkMode }) => {
  const discountedPrice =
    item.discount_percent > 0
      ? item.price * (1 - item.discount_percent / 100)
      : item.price;

  return (
    <div className="w-2/12 flex items-center justify-center">
      <div className="flex items-center gap-[10px]">
        {item.discount_percent > 0 && (
          <span
            className={`font-semibold mt-[3px] pc:text-[0.9rem] tl:text-[0.8rem] mb:text-[0.8rem] line-through ${
              isDarkMode ? "text-[#292929]" : "text-white"
            }`}
          >
            {item.price.toLocaleString("vi-VN")}đ
          </span>
        )}
        <span className="font-semibold pc:text-[1.1rem] tl:text-[1rem] mb:text-[1rem]">
          {discountedPrice?.toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  );
};

export default PriceDisplay;
