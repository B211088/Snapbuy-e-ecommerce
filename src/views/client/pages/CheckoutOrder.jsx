import { useEffect, useState } from "react";
import LayoutModeBackground from "../layout/LayoutModeBackground";
import HeaderTop from "../../../components/header/HeaderTop";
import Header from "../../../components/header/Header";
import { useTheme } from "../../../Provider/ThemeProvider";
import sanpham1 from "../../../assets/images/sanpham1.webp";
import { useLocation, useNavigate } from "react-router-dom";
import GetAddressReceiver from "../../../components/Modal/GetAddressReceiver";
import { useAuth } from "../../../contexts/User/AuthContext";
import { useNotify } from "../../../components/Notify/NotifyModal";
import ShippingTypeModal from "../../../components/Modal/ShippingTypeModal";
import { useShop } from "../../../contexts/User/ShopContext";
import ShopVoucherModal from "../../../components/Modal/ShopVoucherModal";

const CheckoutOrder = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const {
    placeOrder,
    fetchAddress,
    authState: { user },
  } = useAuth();
  const { getVouchersByShop } = useShop();

  const location = useLocation();
  const [addressSelected, setAddressSelected] = useState({});
  const [addressSelectedModal, setAddressSelectedModal] = useState(false);
  const [orderProductList, setOrderProductList] = useState([]);
  const [addressReceiver, setAddressReceiver] = useState({});
  const [notes, setNotes] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingTypeModal, setShippingTypeModal] = useState(false);
  const [currentShopId, setCurrentShopId] = useState(null);
  const [selectedShippingTypes, setSelectedShippingTypes] = useState({});
  const [voucherDiscounts, setVoucherDiscounts] = useState({});
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [currentShopForVoucher, setCurrentShopForVoucher] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const [shopVouchers, setShopVouchers] = useState({});

  const productListOrdersState = location.state?.orderProductListState;

  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    const fetchAddressReciver = async () => {
      try {
        const response = await fetchAddress(user.id);
        if (response.success) {
          setAddresses(response.data);
          return;
        }
      } catch (error) {
        setAddresses([]);
      }
    };
    fetchAddressReciver();
  }, [productListOrdersState]);

  console.log(addresses);

  useEffect(() => {
    if (!productListOrdersState || productListOrdersState.length === 0) return;

    // Fetch vouchers for each shop
    const fetchAllShopVouchers = async () => {
      try {
        const vouchersPromises = productListOrdersState.map((order) =>
          getVouchersByShop(order.shop_id)
        );

        const results = await Promise.all(vouchersPromises);

        const vouchersByShop = {};
        productListOrdersState.forEach((order, index) => {
          vouchersByShop[order.shop_id] = results[index]?.data || [];
        });

        setShopVouchers(vouchersByShop);
      } catch (error) {
        console.error("Error fetching shop vouchers:", error);
        notifyError("Không thể tải voucher của shop. Vui lòng thử lại sau.");
      }
    };

    fetchAllShopVouchers();
  }, [productListOrdersState]);

  // Add this function to open the voucher modal
  const openVoucherModal = (shopId) => {
    setCurrentShopForVoucher(shopId);
    setVoucherModalOpen(true);
  };

  // Add this function to handle voucher selection
  const handleSelectVoucher = (voucher) => {
    if (!currentShopForVoucher) return;

    setSelectedVouchers((prev) => ({
      ...prev,
      [currentShopForVoucher]: voucher,
    }));

    // Calculate and update the voucher discount
    if (voucher) {
      const shopOrder = orderProductList.find(
        (order) => order.shop_id === currentShopForVoucher
      );
      const orderTotal = calculateTotalPerShop(shopOrder);
      const discountAmount = (orderTotal * voucher.discount_percent) / 100;

      setVoucherDiscounts((prev) => ({
        ...prev,
        [currentShopForVoucher]: discountAmount,
      }));
    } else {
      // If voucher is removed, reset the discount
      setVoucherDiscounts((prev) => ({
        ...prev,
        [currentShopForVoucher]: 0,
      }));
    }
  };

  useEffect(() => {
    if (Object.keys(addressReceiver).length > 0) {
      setAddressSelected(addressReceiver);
    } else if (addresses.length > 0) {
      setAddressSelected(addresses[0]);
    }
  }, [addresses, addressReceiver]);

  // In the useEffect where you initialize shipping types
  useEffect(() => {
    if (!Array.isArray(productListOrdersState) || !addressSelected) return;

    const updatedOrders = productListOrdersState.map((order) => ({
      ...order,
      address_id: addressSelected.address_id,
    }));

    setOrderProductList(updatedOrders);

    // Initialize notes for each shop
    const initialNotes = {};
    // Initialize shipping types for each shop with default (first shipping type)
    const initialShippingTypes = {};
    // Initialize voucher discounts
    const initialVoucherDiscounts = {};

    productListOrdersState.forEach((order) => {
      initialNotes[order.shop_id] = "";

      // Get the first shipping type ID if available
      const firstShippingTypeId =
        order.shipping_types && order.shipping_types.length > 0
          ? order.shipping_types[0].id
          : 1;

      initialShippingTypes[order.shop_id] = firstShippingTypeId;
      initialVoucherDiscounts[order.shop_id] = 0;
    });

    setNotes(initialNotes);
    setSelectedShippingTypes(initialShippingTypes);
    setVoucherDiscounts(initialVoucherDiscounts);
  }, [productListOrdersState, addressSelected]);

  // Fix the getShippingCostForShop function
  const getShippingCostForShop = (shopId) => {
    if (!orderProductList || orderProductList.length === 0) return 0;

    const shop = orderProductList.find((order) => order.shop_id === shopId);
    if (!shop) return 0;

    // Get shipping types from the shop
    if (!shop.shipping_types || shop.shipping_types.length === 0) return 30000;

    const shippingTypeId =
      selectedShippingTypes[shopId] || shop.shipping_types[0].id;
    const selectedType = shop.shipping_types.find(
      (type) => type.id === shippingTypeId
    );

    return selectedType ? selectedType.price : 30000;
  };

  // Fix the getSelectedShippingType function
  const getSelectedShippingType = (shopId) => {
    if (!orderProductList || orderProductList.length === 0) return null;

    const shop = orderProductList.find((order) => order.shop_id === shopId);
    if (!shop) return null;

    // Get shipping types from the shop
    if (!shop.shipping_types || shop.shipping_types.length === 0) return null;

    const shippingTypeId =
      selectedShippingTypes[shopId] || shop.shipping_types[0].id;
    return shop.shipping_types.find((type) => type.id === shippingTypeId);
  };

  const calculateTotalPerShop = (shopOrder) => {
    return shopOrder.order_detail_dtos.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateGrandTotal = () => {
    if (!orderProductList.length) return 0;

    const itemsTotal = orderProductList.reduce((total, shopOrder) => {
      return total + calculateTotalPerShop(shopOrder);
    }, 0);

    const totalShipping = orderProductList.reduce((total, shopOrder) => {
      return total + getShippingCostForShop(shopOrder.shop_id);
    }, 0);

    const totalDiscounts = Object.values(voucherDiscounts).reduce(
      (sum, discount) => sum + discount,
      0
    );

    return itemsTotal + totalShipping - totalDiscounts;
  };

  const handleNoteChange = (shopId, value) => {
    setNotes((prev) => ({
      ...prev,
      [shopId]: value,
    }));
  };

  const openShippingModal = (shopId) => {
    setCurrentShopId(shopId);
    setShippingTypeModal(true);
  };

  const handleSelectShippingType = (type) => {
    if (!currentShopId) return;

    setSelectedShippingTypes((prev) => ({
      ...prev,
      [currentShopId]: type.id,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!addressSelected.address_id) {
      notifyWarning("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderPromises = orderProductList.map((shopOrder) => {
        const formData = {
          shop_id: shopOrder.shop_id,
          user_address_id: addressSelected.address_id,
          user_id: user.id,
          product_shipping_type_id:
            selectedShippingTypes[shopOrder.shop_id] || 1,
          quantity:
            shopOrder.quantityProduct ||
            shopOrder.order_detail_dtos.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
          voucherId: selectedVouchers[shopOrder.shop_id]?.id || "",
          note: notes[shopOrder.shop_id] || "Không có ghi chú",
          order_detail_dtos: shopOrder.order_detail_dtos.map((item) => ({
            product_id: item?.product_id,
            quantity: item?.quantity,
            product_category_id: item?.product_option?.id || "",
            product_sub_category_id: item?.sub_product_option?.id || "",
          })),
        };

        return placeOrder(formData);
      });

      const results = await Promise.all(orderPromises);

      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        notifySuccess("Đặt hàng thành công!");
        navigate("/userinfo/order"); // Navigate to orders after successful placement
      } else {
        const failedResults = results.filter((result) => !result.success);
        notifyError(
          `Đặt hàng thất bại: ${
            failedResults[0]?.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (error) {
      notifyError("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day} Tháng ${month}`;
  };

  const getEstimatedDeliveryDates = (shopId) => {
    const selectedType = getSelectedShippingType(shopId);
    if (!selectedType) return { start: 2, end: 4 };

    const estimatedDays = selectedType.estimated_time;
    return {
      start: estimatedDays - 1 > 0 ? estimatedDays - 1 : 1,
      end: estimatedDays + 1,
    };
  };

  return (
    <LayoutModeBackground>
      <HeaderTop />
      <Header />
      <div className="pc:w-full flex justify-center pc:my-[20px] mb:px-[0px]">
        <div className="pc:w-[90%] tl:w-full mb:w-full flex mb:flex-col mb:justify-center gap-[20px] mb:px-[10px] shadow-sm">
          <div
            className={`pc:w-full tl:w-full mb:w-full ${
              isDarkMode ? "bg-white" : "bg-dark-200 text-white"
            } py-[10px] pc:px-[20px] tl:px-[10px] mb:px-[10px] rounded-[5px]`}
          >
            <div className="w-full font-bold text-primary text-[1.2rem] py-[10px] ">
              <h1>Địa chỉ nhận hàng</h1>
            </div>
            <div className="w-full flex items-center justify-between gap-[10px]">
              {addressSelected && Object.keys(addressSelected).length > 0 ? (
                <div className="flex items-center gap-[10px] font-nunito">
                  <div className="font-bold ">
                    {addressSelected.receiver_name}
                  </div>
                  <div className="font-bold">
                    {addressSelected?.phone_number}
                  </div>
                  <div className="flex items-center gap-[5px] text-[0.9rem]">
                    <div className="">{addressSelected?.specific_address}</div>
                    <div className="">{addressSelected?.village_name}</div>
                    <div className="">{addressSelected?.district_name}</div>
                    <div className="">{addressSelected?.province_name}</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-500">
                  Vui lòng thêm địa chỉ nhận hàng
                </div>
              )}
              <div
                className="flex items-center gap-[10px] text-blue-500 cursor-pointer"
                onClick={() => setAddressSelectedModal(true)}
              >
                <span className="text-[0.9rem] ">
                  Thay đổi địa chỉ nhận hàng
                </span>
                <i className="fa-solid fa-pen-to-square"></i>
              </div>

              {addressSelectedModal && (
                <GetAddressReceiver
                  addressIdSelected={addressSelected.address_id}
                  onCloseModal={() => setAddressSelectedModal(false)}
                  onSelect={(address) => setAddressReceiver(address)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {orderProductList?.length === 0 ? (
        <div className="w-full text-center py-8">
          <div className="text-xl font-bold">
            Không có sản phẩm nào trong giỏ hàng
          </div>
          <button
            className="mt-4 bg-primary text-white px-6 py-2 rounded"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        orderProductList?.map((listOrder) => (
          <div
            key={listOrder.shop_id}
            className="pc:w-full flex justify-center mb:px-[0px] py-[20px]"
          >
            <div className="pc:w-[90%] tl:w-full mb:w-full flex mb:flex-col mb:justify-center gap-[20px] mb:px-[10px] shadow-sm">
              <div
                className={`pc:w-full tl:w-full mb:w-full rounded-[5px] font-nunito ${
                  isDarkMode ? "bg-white" : "bg-dark-200 text-white"
                } `}
              >
                <div className="w-full flex items-center border-b-[1px] border-dashed py-[10px] px-[20px]">
                  <div className="flex items-center justify-center gap-[10px]">
                    <div className="w-[42px] h-[42px] aspect-square rounded-full overflow-hidden">
                      <img
                        className="w-full h-full min-w-full object-cover"
                        src={listOrder.infoShop.logo}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col ">
                      <h1 className="font-nunito font-bold">
                        {listOrder.infoShop.shop_name}
                      </h1>
                      <p className="text-[0.8rem] truncate">
                        {listOrder.infoShop.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full py-[20px] px-[20px] flex flex-col border-b-[1px]  ">
                  <div className="w-full flex items-center pt-[10px] pb-[20px]">
                    <div className="w-7/12 flex items-center font-bold">
                      <span>Sản phẩm</span>
                    </div>
                    <div className="w-5/12 flex items-center text-[0.9rem]">
                      <div className="w-4/12 flex justify-end">
                        <span>Đơn giá</span>
                      </div>
                      <div className="w-4/12 flex justify-end ">
                        <span>Số lượng</span>
                      </div>
                      <div className="w-4/12 flex justify-end  ">
                        <span>Thành tiền</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center flex-col gap-[20px]">
                    {listOrder.order_detail_dtos.map((item) => (
                      <div
                        key={
                          item.cart_item_id
                            ? `${item.cart_item_id}-${item.product_id}-${item.product_option_id}-${item.sub_product_option_id}`
                            : `${item.product_id}-${item.product_option_id}-${item.sub_product_option_id} `
                        }
                        className="flex w-full mb-2"
                      >
                        {/* Phần ảnh + tên sản phẩm */}
                        <div className="w-7/12 flex items-center font-bold gap-[10px]">
                          <div className="w-[60px] aspect-square rounded-[5px] overflow-hidden">
                            <img
                              className="w-full min-w-full h-full object-cover"
                              src={item.thumbnail || sanpham1}
                              alt={item.name}
                            />
                          </div>
                          <div className="w-full">
                            {item.name || "Tên sản phẩm"}
                            {item.product_option?.id && (
                              <div className="text-sm font-normal text-gray-500">
                                Tùy chọn:{" "}
                                {item.sub_product_option
                                  ? item.product_option?.name
                                  : item.product_option?.value}
                                ,
                                {item.sub_product_option?.name
                                  ? ` - ${item.sub_product_option.name}`
                                  : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Phần số lượng, đơn giá, tổng giá */}
                        <div className="w-5/12 flex items-center text-[0.9rem]">
                          <div className="w-4/12 flex justify-end">
                            <span>{item.price?.toLocaleString("vi-VN")}đ</span>
                          </div>
                          <div className="w-4/12 flex justify-end">
                            <span>{item.quantity}</span>
                          </div>
                          <div className="w-4/12 flex justify-end">
                            <span>
                              {(item.quantity * item.price)?.toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full py-[20px] px-[20px] flex items-center justify-end border-b-[1px]  ">
                  <div className="w-7/12 flex items-center justify-between gap-[10px]">
                    <div className="w-4/12 flex items-center gap-[10px] text-[0.9rem] font-bold text-red-500">
                      <i className="fa-solid fa-ticket"></i>
                      <span className="">Voucher của shop:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedVouchers[listOrder.shop_id] ? (
                        <div className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          <span>
                            Giảm{" "}
                            {
                              selectedVouchers[listOrder.shop_id]
                                .discount_percent
                            }
                            %
                          </span>
                          <button
                            className="text-xs hover:text-red-700"
                            onClick={() => handleSelectVoucher(null)}
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <span>Không có voucher được chọn</span>
                      )}
                      <div
                        className="text-[0.9rem] text-blue-500 cursor-pointer"
                        onClick={() => openVoucherModal(listOrder.shop_id)}
                      >
                        Chọn voucher
                      </div>
                    </div>
                  </div>
                </div>
                {voucherModalOpen && currentShopForVoucher && (
                  <ShopVoucherModal
                    onClose={() => setVoucherModalOpen(false)}
                    onSelectVoucher={handleSelectVoucher}
                    shopId={currentShopForVoucher}
                    isDarkMode={isDarkMode}
                    currentOrderTotal={calculateTotalPerShop(
                      orderProductList.find(
                        (order) => order.shop_id === currentShopForVoucher
                      )
                    )}
                    vouchers={shopVouchers[currentShopForVoucher] || []}
                    selectedVoucherId={
                      selectedVouchers[currentShopForVoucher]?.id
                    }
                  />
                )}
                <div className="w-full py-[20px] px-[20px] flex items-center justify-end border-b-[1px] ">
                  <div className="w-7/12 flex items-center justify-between gap-[10px]">
                    <div className="w-4/12 flex items-center gap-[10px] text-[0.9rem] font-bold text-green-500">
                      <i className="fa-solid fa-truck"></i>
                      <span className="">Phương thức vận chuyển: </span>
                    </div>
                    <div className="">
                      <div className=" flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-[1rem] font-bold">
                            {getSelectedShippingType(listOrder.shop_id)?.name ||
                              "Tiêu chuẩn"}
                          </span>
                          <span
                            className="text-[0.85rem] text-blue-500 cursor-pointer"
                            onClick={() => openShippingModal(listOrder.shop_id)}
                          >
                            Thay đổi
                          </span>
                        </div>
                        <div className="text-[0.85rem]">
                          {getSelectedShippingType(listOrder.shop_id)
                            ?.description || ""}
                        </div>
                        <div className="text-[0.85rem]">
                          {(() => {
                            const { start, end } = getEstimatedDeliveryDates(
                              listOrder.shop_id
                            );
                            return `Đảm bảo nhận hàng từ ${formatDate(
                              start
                            )} - ${formatDate(end)}`;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="w-2/12 flex justify-end text-[0.9rem]">
                      <span>
                        {getShippingCostForShop(
                          listOrder.shop_id
                        ).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full py-[20px] px-[20px] flex items-center justify-end border-b-[1px] ">
                  <div className="w-7/12 flex flex-col gap-[10px]">
                    <div className="w-full text-[0.9rem] font-bold">
                      <span>Lời nhắn</span>
                    </div>
                    <div className="w-full h-[120px] min-h-[120px] border-[1px] rounded-[5px] p-[5px] ">
                      <textarea
                        className="w-full h-full min-h-full max-h-full bg-transparent outline-none text-[0.85rem] overflow-auto scrollbar-custom"
                        value={notes[listOrder.shop_id] || ""}
                        onChange={(e) =>
                          handleNoteChange(listOrder.shop_id, e.target.value)
                        }
                        placeholder="Ví dụ: Hàng dễ vỡ xin nhẹ tay"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="w-full py-[20px] px-[20px] flex items-center justify-end gap-[10px] border-b-[1px] ">
                  <div className="text-[0.9rem]">
                    <span>
                      Tổng số tiền {"("}
                      {listOrder.order_detail_dtos.length} sản phẩm {")"}:
                    </span>
                  </div>
                  <div className="font-bold text-[1.2rem] text-red-500">
                    {calculateTotalPerShop(listOrder).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {orderProductList?.length > 0 && (
        <div className="w-full flex justify-center mb:px-[0px] py-[20px]">
          <div className="pc:w-[90%] tl:w-full mb:w-full flex mb:flex-col mb:justify-center gap-[20px] mb:px-[10px] shadow-sm">
            <div
              className={`pc:w-full tl:w-full mb:w-full rounded-[5px] font-nunito ${
                isDarkMode ? "bg-white" : "bg-dark-200 text-white"
              } `}
            >
              <div className="w-full py-[20px] px-[20px] flex flex-col items-end gap-[10px] border-b-[1px] ">
                <div className="w-4/12 mb:w-full flex flex-col gap-[10px]">
                  <div className="w-full flex items-center gap-[5px] py-[10px]">
                    <div className="w-5/12 text-[0.9rem] font-bold">
                      <span>Tổng tiền hàng</span>
                    </div>
                    <div className="w-7/12 text-[0.9rem] flex justify-end ">
                      <span>
                        {orderProductList
                          .reduce(
                            (total, shop) =>
                              total + calculateTotalPerShop(shop),
                            0
                          )
                          .toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-[5px] py-[10px]">
                    <div className="w-5/12 text-[0.9rem] font-bold">
                      <span>Tổng tiền vận chuyển</span>
                    </div>
                    <div className="w-7/12 text-[0.9rem] flex justify-end ">
                      <span>
                        {orderProductList
                          .reduce((total, shop) => {
                            return total + getShippingCostForShop(shop.shop_id);
                          }, 0)
                          .toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-[5px] py-[10px]">
                    <div className="w-5/12 text-[0.9rem] font-bold">
                      <span>Tổng tiền voucher giảm giá</span>
                    </div>
                    <div className="w-7/12 text-[0.9rem] flex justify-end ">
                      <span>
                        {Object.values(voucherDiscounts)
                          .reduce((sum, discount) => sum + discount, 0)
                          .toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-[5px] py-[10px]">
                    <div className="w-5/12 text-[0.9rem] font-bold">
                      <span>Tổng thanh toán</span>
                    </div>
                    <div className="w-7/12 text-[1.2rem] font-bold flex justify-end text-red-500">
                      <span>
                        {calculateGrandTotal().toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full py-[20px] px-[20px] flex items-center justify-end gap-[10px] border-b-[1px] ">
                <button
                  className={`bg-primary px-[100px] py-[10px] text-light-100 font-bold rounded-[5px] ${
                    isPlacingOrder
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Type Modal */}
      {shippingTypeModal && currentShopId && (
        <ShippingTypeModal
          shippingTypes={
            orderProductList.find((order) => order.shop_id === currentShopId)
              ?.shipping_types || []
          }
          onSelect={handleSelectShippingType}
          onClose={() => setShippingTypeModal(false)}
          currentType={selectedShippingTypes[currentShopId]}
          isDarkMode={isDarkMode}
        />
      )}
    </LayoutModeBackground>
  );
};

export default CheckoutOrder;
