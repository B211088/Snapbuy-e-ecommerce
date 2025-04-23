import { useAuth } from "../../contexts/User/AuthContext";
import QuantityProduct from "../Header/QuantityProduct";
import { useConfirm } from "../Notify/ConfirmModal";
import { useNotify } from "../Notify/NotifyModal";
import { Link } from "react-router-dom";
import PriceDisplay from "./PriceDisplay";

const ProductItem = ({
  item,
  isDarkMode,
  selectedItems,
  handleItemSelect,
  handleQuantityChange,
}) => {
  const {
    authState: { user },
    deleteProductFromCart,
  } = useAuth();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const { confirm, ConfirmComponent } = useConfirm();
  const handleDeleteProductOutCart = async (cart_item_id) => {
    confirm({
      message: "Bạn có chắc chắn muốn xóa sản phẩm khỏi đơn giỏ hàng không?",
      onConfirm: async () => {
        try {
          const response = await deleteProductFromCart(user?.id, cart_item_id);
          if (response.success) {
            notifySuccess("Xóa sản phẩm ra khỏi giỏ hàng thành công");
            return;
          }
          notifyWarning("Xóa sản phẩm thất bại");
        } catch (error) {
          notifyError(`Lỗi: ${error.message}`);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  return (
    <div className="w-full flex flex-col border-b last:border-b-0 py-3">
      <ConfirmComponent />
      <div className="w-full flex mb:flex-col gap-[20px] mb:gap-[10px]">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            checked={!!selectedItems[item.cart_item_id]}
            onChange={() => handleItemSelect(item.cart_item_id)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        <div className="pc:max-w-[100px] pc:max-h-[100px] tl:max-w-[120px] tl:max-h-[140px] mb:min-w-full flex justify-between">
          {item.product_category_image && (
            <img
              className="w-full h-full aspect-square rounded-[5px] object-cover"
              src={item.product_category_image.avatar_url}
              alt={item.product_name}
            />
          )}
        </div>

        <div className="w-full flex items-center mb:flex-col gap-[20px] mb:gap-[10px] justify-between">
          <Link
            to={`/product/${encodeURIComponent(
              item.product_id
            )}?name=${encodeURIComponent(item.product_name)}`}
            className="pc:w-3/12 w-full font-nunito font-bold pc:text-[1rem] tl:text-[1rem] mb:text-[1rem]"
          >
            {item.product_name}
          </Link>
          <div className="pc:w-2/12  w-full flex items-center">
            <span> {item.product_category_name}</span>
            <span>,</span>
            {item.subcategory_name && (
              <span className="text-sm ">{item.subcategory_name}</span>
            )}
          </div>
          <PriceDisplay item={item} isDarkMode={isDarkMode} />
          <div className="pc:w-2/12 w-full flex items-center pc:justify-center">
            <div className="w-full h-[30px] flex">
              <QuantityProduct
                defaultQuantity={item.quantity}
                productId={item.cart_item_id}
                onQuantityChange={handleQuantityChange}
                maxQuantity={item.stock_quantity}
              />
            </div>
          </div>
          <div className="pc:w-2/12 w-full flex items-center pc:justify-center">
            <div className="flex items-center gap-[10px]">
              <span className="font-semibold pc:text-[1.2rem] tl:text-[1rem] mb:text-[1rem] text-[#ee2f2f]">
                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
          <div
            className="w-[42px] h-[42px] flex items-center justify-center text-red-500 cursor-pointer"
            onClick={() => handleDeleteProductOutCart(item.cart_item_id)}
          >
            <i className="fa-solid fa-trash"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
