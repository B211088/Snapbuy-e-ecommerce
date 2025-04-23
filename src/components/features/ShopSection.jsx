import ProductItem from "./ProductItem";
import ShopVouchers from "./ShopVouchers";

const ShopSection = ({
  shop,
  selectedItems,
  handleShopSelect,
  handleItemSelect,
  handleQuantityChange,
  isDarkMode,
}) => {
  return (
    <li
      key={shop.shopInfo.id}
      className={`w-full flex flex-col items-center pt-[0px] pb-[15px] px-[10px] rounded-[5px] ${
        isDarkMode
          ? "bg-white text-dark-100 border-[1px]"
          : "bg-dark-400 text-white"
      }`}
    >
      <div className="w-full flex items-center justify-between border-b py-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={shop.products.every(
              (product) => selectedItems[product.cart_item_id]
            )}
            onChange={() => handleShopSelect(shop.shopInfo.id)}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <span className="font-medium">{shop.shopInfo.name}</span>
          </div>
        </div>
      </div>

      <ShopVouchers shop={shop} isDarkMode={isDarkMode} />

      {shop.products.map((item) => (
        <ProductItem
          key={item.cart_item_id}
          item={item}
          isDarkMode={isDarkMode}
          selectedItems={selectedItems}
          handleItemSelect={handleItemSelect}
          handleQuantityChange={handleQuantityChange}
        />
      ))}
    </li>
  );
};

export default ShopSection;
