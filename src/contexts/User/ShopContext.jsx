import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";
import { shopReducer } from "../../reducers/User/ShopReducer";
import {
  ADD_VOUCHER_SUCCESS,
  apiUrl,
  CREATE_PRODUCT,
  DELETE_VOUCHER_SUCCESS,
  GET_VOUCHERS_SUCCESS,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_ERROR,
  SET_LOADING,
  SET_SHIPPING_PROVIDER,
  SET_SHOP_INFO,
  UPDATE_VOUCHER_SUCCESS,
} from "../contants";
import setAuthToken from "../../utils/User/setAuthToken";

import { useAuth } from "./AuthContext";

const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [shopState, dispatch] = useReducer(shopReducer, {
    loading: false,
    shopInfo: null,
    products: [],
    vouchers: [],
    selectedVoucher: null,
    shippingProviders: [],
  });

  const {
    authState: { user, roles },
  } = useAuth();

  const loadShopInfo = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    if (!token || !user?.id) {
      dispatch({
        type: SET_SHOP_INFO,
        payload: { statusShop: "", shopInfo: null },
      });
      return;
    }

    if (!roles?.includes("shop")) {
      return;
    }

    if (roles?.includes("admin")) {
      return;
    }

    setAuthToken(token);

    try {
      const response = await axios.get(`${apiUrl}/api/v1/shop/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        dispatch({
          type: SET_SHOP_INFO,
          payload: {
            statusShop: response.data.status,
            shopInfo: response.data,
          },
        });
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching shop info:", error);

      dispatch({
        type: SET_SHOP_INFO,
        payload: { statusShop: "", shopInfo: null },
      });

      return null;
    }
  };

  useEffect(() => {
    if (user?.roles.includes("shop")) {
      loadShopInfo();
    }
  }, [user?.roles]);

  const updateShopInfo = async (userId, formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/shop/update_shop/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({
          type: SET_SHOP_INFO,
          payload: {
            shopInfo: response.data,
          },
        });

        return { success: true, data: response.data };
      }

      return { success: false, message: "Có lỗi xảy ra khi tạo sản phẩm!" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi không xác định!",
      };
    }
  };

  const createProduct = async (shopId, formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product/create_product/${shopId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: CREATE_PRODUCT, payload: response.data });

        return { success: true, data: response.data };
      }

      return { success: false, message: "Có lỗi xảy ra khi tạo sản phẩm!" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi không xác định!",
      };
    }
  };

  const addMultipleAttributes = async (
    productId,
    shopId,
    product_attribute
  ) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_attribute_value/add_multiple?productId=${productId}&shopId=${shopId}`,
        product_attribute,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: "Có lỗi xảy ra khi thêm thuộc tính" };
    } catch (error) {
      console.error("Error adding multiple attributes:", error);
    }
  };

  const addInfoProductsSellerLv1 = async (productId, shopId, formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_category/add_multiple/one_level?productId=${productId}&shopId=${shopId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return {
        success: false,
        message: "Có lỗi xảy ra khi thêm thông tin bán hàng",
      };
    } catch (error) {
      console.error("Error adding info products seller:", error);
    }
  };

  const addInfoProductsSellerLv2 = async (productId, shopId, formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_category/add_multiple/two_level?productId=${productId}&shopId=${shopId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }

      return {
        success: false,
        message: "Có lỗi xảy ra khi thêm thông tin bán hàng",
      };
    } catch (error) {
      console.error("Error adding info products seller:", error);
      return {
        success: false,
        message: "Lỗi khi gọi API",
        error,
      };
    }
  };

  const getShipingType = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/shipping_type`);
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return {
        success: false,
        message: "Có lỗi xảy ra khi lấy thông tin shiping",
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi gọi API",
        error,
      };
    }
  };

  const caculateShipingFee = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_shipping/calculate_each_shipping_type_fee`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const addProductShippingInfo = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_shipping/create_product_shipping_type`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const getAllProducts = async (shopId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/product/get_shop_product/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  // Get all vouchers by shop
  const getVouchersByShop = async (shopId) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/voucher/get_vouchers/${shopId}`
      );
      dispatch({ type: GET_VOUCHERS_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  // Add new voucher
  const addVoucher = async (shopId, voucherData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.post(
        `${apiUrl}/api/v1/voucher/${shopId}`,
        voucherData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: ADD_VOUCHER_SUCCESS, payload: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  // Update voucher
  const updateVoucher = async (voucherData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.put(`${apiUrl}/api/v1/voucher`, voucherData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: UPDATE_VOUCHER_SUCCESS, payload: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  // Delete voucher
  const deleteVoucher = async (shopId, voucherId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({ type: SET_LOADING });
    try {
      await axios.delete(
        `${apiUrl}/api/v1/voucher?shopId=${shopId}&voucherId=${voucherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: DELETE_VOUCHER_SUCCESS, payload: voucherId });
      return { success: true };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const getShopOrderByStatus = async (shopId, status) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/get_shop_order_by_status?shopId=${shopId}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const confirmOrder = async (shopId, orderId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/status/to_packaging?shopId=${shopId}&orderId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const addShipingProviderToOrder = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/order/add_shipping_provider`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const deliverOrderToShippingProvider = async (shopId, orderId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/status/to_handed_over_to_carrier_status?shopId=${shopId}&orderId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });
      return { success: false, message: err.message };
    }
  };

  const getAllShippingProvider = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/shipping_provider/get_all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_SHIPPING_PROVIDER, payload: response.data });
        return { success: true, data: response.data };
      }
      return { success: false, data: response.message };
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.message });

      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  useEffect(() => {
    getAllShippingProvider();
  }, []);

  const shopContextData = {
    shopState,
    loadShopInfo,
    updateShopInfo,
    createProduct,
    addMultipleAttributes,
    addInfoProductsSellerLv1,
    addInfoProductsSellerLv2,
    getShipingType,
    caculateShipingFee,
    addProductShippingInfo,
    getAllProducts,
    getVouchersByShop,
    addVoucher,
    updateVoucher,
    deleteVoucher,
    getShopOrderByStatus,
    confirmOrder,
    deliverOrderToShippingProvider,
    addShipingProviderToOrder,
  };

  return (
    <ShopContext.Provider value={shopContextData}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
