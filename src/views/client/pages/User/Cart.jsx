import { useEffect, useMemo } from "react";
import HeaderTop from "../../../../components/header/HeaderTop";
import Header from "../../../../components/header/Header";
import { useTheme } from "../../../../Provider/ThemeProvider";
import SuggestionsSlide from "../../../../components/header/SuggestionsSlide";
import PathAccess from "../../../../components/features/PathAccess";
import LayoutModeBackground from "../../layout/LayoutModeBackground";
import { useAuth } from "../../../../contexts/User/AuthContext";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../pages/Loading";
import CheckoutBar from "../../../../components/features/CheckoutBar";
import ShopSection from "../../../../components/features/ShopSection";
import EmptyCart from "../../../../components/Shop/display/EmptyCart ";
import { useNotify } from "../../../../components/Notify/NotifyModal";
import { useConfirm } from "../../../../components/Notify/ConfirmModal";

const Cart = () => {
  const { isDarkMode } = useTheme();
  const { confirm, ConfirmComponent } = useConfirm();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const {
    authState: { user },
    cartState: { carts },
    deleteProductFromCart,
  } = useAuth();

  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [productListSelected, setProductListSelected] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [productListDelete, setProductListDelete] = useState([]);

  // Transform and flatten the cart data structure for easier handling
  useEffect(() => {
    if (!carts || carts.length === 0) {
      setCartProducts([]);
      setTotalCartItems(0);
      return;
    }

    let flattenedProducts = [];
    let count = 0;

    carts.forEach((shop) => {
      if (shop.cart_item_response && Array.isArray(shop.cart_item_response)) {
        const productsWithShopInfo = shop.cart_item_response.map((item) => ({
          ...item,
          shop_id: shop.shop_info_response?.id,
          shop_name: shop.shop_info_response?.shop_name,
        }));

        flattenedProducts = [...flattenedProducts, ...productsWithShopInfo];
        count += shop.cart_item_response.length;
      }
    });

    setCartProducts(flattenedProducts);
    setTotalCartItems(count);

    // Group products by shop
    const groupedByShop = {};
    flattenedProducts.forEach((product) => {
      const shopId = product.shop_id;
      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = {
          shopInfo: {
            id: product.shop_id,
            name: product.shop_name,
          },
          products: [],
        };
      }
      groupedByShop[shopId].products.push(product);
    });

    setGroupedProducts(groupedByShop);
  }, [carts]);

  const handleDeleteAllProductOutCart = async () => {
    confirm({
      message: "Bạn có chắc chắn muốn xóa sản phẩm khỏi đơn giỏ hàng không?",
      onConfirm: async () => {
        try {
          const cartDeletePromise = productListDelete.map((product) => {
            return deleteProductFromCart(user?.id, product);
          });

          const results = await Promise.all(cartDeletePromise);
          const allSuccess = results.every((result) => result.success);
          if (allSuccess) {
            notifySuccess("Xóa sản phẩm khỏi giỏ hàng thành công");
            setSelectAll(false);

            return;
          } else {
            notifyWarning("Xóa sản phẩm thất bại");
            return;
          }
        } catch (error) {
          console.error("Error placing order:", error);
          notifyError("Xóa sản phẩm thất bại. Vui lòng thử lại sau.");
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleOrder = useCallback(() => {
    navigate("/checkout", {
      state: { orderProductListState: productListSelected },
    });
  }, [navigate, productListSelected]);

  const handleRemoveAllProductSelected = useCallback(() => {
    setSelectAll(false);
    setSelectedItems({});
    setProductListSelected([]);
  }, []);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.cart_item_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const updateSelectedProductList = useCallback(
    (selectedItemsMap) => {
      const selectedProducts = cartProducts.filter(
        (product) => selectedItemsMap[product.cart_item_id]
      );

      const groupedByShop = {};

      // First, make sure we can map each cart_item_id to its correct shop_id
      const shopIdMapping = {};
      carts.forEach((shopData) => {
        const shopInfo = shopData.shop_info_response;
        shopData.cart_item_response.forEach((item) => {
          shopIdMapping[item.cart_item_id] = shopInfo.id;
        });
      });

      selectedProducts.forEach((product) => {
        // Use the mapping to get the correct shop_id
        const shopId = shopIdMapping[product.cart_item_id];

        if (!groupedByShop[shopId]) {
          const shopInfo = carts.find(
            (shopData) => shopData.shop_info_response.id === shopId
          )?.shop_info_response;
          const shipingTypes = carts.find(
            (shopData) => shopData.shop_info_response.id === shopId
          )?.shipping_type_responses;

          groupedByShop[shopId] = {
            user_id: user?.id,
            shop_id: shopId,
            quantityProduct: 0,
            order_detail_dtos: [],
            infoShop: {
              shop_name: shopInfo?.shop_name || "",
              logo: shopInfo?.logo || "",
              description: shopInfo?.description || "",
            },
            shipping_types: shipingTypes,
          };
        }

        groupedByShop[shopId].order_detail_dtos.push({
          cart_item_id: product.cart_item_id,
          product_id: product.product_id,
          thumbnail: product.product_category_image?.avatar_url || "",
          name: product.product_name,
          product_option: {
            id: product?.product_category_id,
            name: product?.product_category_name,
          },
          sub_product_option: {
            id: product?.subcategory_id,
            name: product?.subcategory_name,
          },
          quantity: product.quantity,
          price: product.price,
        });

        groupedByShop[shopId].quantityProduct += product.quantity;
      });

      const result = Object.values(groupedByShop);
      setProductListSelected(result);
    },
    [cartProducts, carts, user]
  );

  // Memoized functions to prevent unnecessary recalculations
  const getMaxEligibleDiscount = useCallback((item) => {
    if (item.discount_percent <= 0) return 0;

    const eligibleDiscount = item.discount_percent;

    if (eligibleDiscount <= 0) return 0;

    return eligibleDiscount;
  }, []);

  const calculateTotal = useCallback(() => {
    return cartProducts.reduce((total, item) => {
      if (!selectedItems[item.cart_item_id]) return total;

      const discountPercent = getMaxEligibleDiscount(item);
      if (discountPercent) {
        const discountedPrice = item.price * (1 - discountPercent / 100);
        return total + discountedPrice * item.quantity;
      }
      const discountedPrice = item.price;
      return total + discountedPrice * item.quantity;
    }, 0);
  }, [cartProducts, selectedItems, getMaxEligibleDiscount]);

  const calculateTotalDiscount = useCallback(() => {
    if (!cartProducts || cartProducts.length === 0) return 0;

    return cartProducts.reduce((total, item) => {
      if (!selectedItems[item.cart_item_id]) return total;

      const discountPercent = getMaxEligibleDiscount(item);
      if (!discountPercent) return total;

      const discountAmount =
        item.price * (discountPercent / 100) * item.quantity;
      return total + discountAmount;
    }, 0);
  }, [cartProducts, selectedItems, getMaxEligibleDiscount]);

  // Selection handlers
  const handleItemSelect = useCallback(
    (productId) => {
      setSelectedItems((prev) => {
        const newSelectedItems = {
          ...prev,
          [productId]: !prev[productId],
        };

        // Call updateSelectedProductList with the new state
        setTimeout(() => updateSelectedProductList(newSelectedItems), 0);

        return newSelectedItems;
      });
      setProductListDelete([...productListDelete, productId]);
    },
    [updateSelectedProductList]
  );

  const handleShopSelect = useCallback(
    (shopId) => {
      const shopProducts = groupedProducts[shopId].products;
      const allSelected = shopProducts.every(
        (product) => selectedItems[product.cart_item_id]
      );

      setSelectedItems((prev) => {
        const newSelectedItems = { ...prev };
        shopProducts.forEach((product) => {
          newSelectedItems[product.cart_item_id] = !allSelected;
        });

        // Cập nhật danh sách sản phẩm đã chọn
        const selectedIds = Object.entries(newSelectedItems)
          .filter(([_, value]) => value === true)
          .map(([key]) => Number(key));

        setProductListDelete(selectedIds);

        // Gọi callback sau khi cập nhật
        setTimeout(() => updateSelectedProductList(newSelectedItems), 0);

        return newSelectedItems;
      });
    },
    [groupedProducts, selectedItems, updateSelectedProductList]
  );

  const handleSelectAll = useCallback(() => {
    const newSelectAll = !selectAll;

    setSelectAll(newSelectAll);

    const newSelectedItems = {};
    cartProducts.forEach((product) => {
      newSelectedItems[product.cart_item_id] = newSelectAll;
    });

    setSelectedItems(newSelectedItems);
    setProductListDelete(
      Object.entries(newSelectedItems)
        .filter(([_, value]) => value === true)
        .map(([key]) => Number(key))
    );
    updateSelectedProductList(newSelectedItems);
  }, [selectAll, cartProducts, updateSelectedProductList]);

  // Calculate total items selected
  const totalSelectedItems = useMemo(
    () => Object.values(selectedItems).filter(Boolean).length,
    [selectedItems]
  );

  if (!carts) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      {" "}
      <HeaderTop />
      <Header />
      <SuggestionsSlide />{" "}
      <LayoutModeBackground>
        <PathAccess />
        <ConfirmComponent />
        <div className="pc:w-full flex justify-center mb:px-[0px] pb-[120px]">
          <div className="pc:w-[90%] tl:w-full mb:w-full flex mb:flex-col mb:justify-center gap-[20px] mb:px-[10px] shadow-sm">
            <div
              className={`pc:w-full h-fit tl:w-full mb:w-full ${
                isDarkMode ? "bg-white" : "bg-dark-200 text-white"
              }   rounded-[5px]`}
            >
              {/* Select All Header */}
              <div
                className={`w-full flex justify-between items-center pc:p-[20px] tl:px-[10px] mb:px-[10px] mb-4 border-b-[1px] border-dashed ${
                  isDarkMode ? "border-dark-200" : "border-dark-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-medium">
                    Chọn tất cả ({totalCartItems} sản phẩm)
                  </span>
                </div>
                <button
                  onClick={handleDeleteAllProductOutCart}
                  className={`text-red-500 font-medium ${
                    totalSelectedItems === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={totalSelectedItems === 0}
                >
                  Xóa đã chọn ra khỏi giỏ hàng
                </button>
              </div>

              {/* Shops and their products */}
              {cartProducts.length > 0 ? (
                <ul className="w-full flex flex-col items-center gap-[20px] mt-[20px] pc:px-[10px] pt-[10px] pb-[20px]  tl:px-[10px] mb:px-[10px]">
                  {Object.values(groupedProducts).map((shop) => (
                    <ShopSection
                      key={shop.shopInfo.id}
                      shop={shop}
                      selectedItems={selectedItems}
                      handleShopSelect={handleShopSelect}
                      handleItemSelect={handleItemSelect}
                      handleQuantityChange={handleQuantityChange}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </ul>
              ) : (
                <EmptyCart navigate={navigate} />
              )}
            </div>

            {/* Checkout Fixed Bottom Bar */}
            {cartProducts.length > 0 && (
              <CheckoutBar
                isDarkMode={isDarkMode}
                selectAll={selectAll}
                handleSelectAll={handleSelectAll}
                totalSelectedItems={totalSelectedItems}
                calculateTotal={calculateTotal}
                calculateTotalDiscount={calculateTotalDiscount}
                handleOrder={handleOrder}
              />
            )}
          </div>
        </div>
      </LayoutModeBackground>
    </div>
  );
};

export default Cart;
