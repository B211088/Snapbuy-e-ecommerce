import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import setAuthToken from "../../utils/User/setAuthToken";
import {
  LOCAL_STORAGE_TOKEN_NAME,
  SET_LOADING,
  SET_ERROR,
  apiUrl,
  SET_ALL_ORDERS,
} from "../contants";
import { shippingProviderReducer } from "../../reducers/User/ShippingReducer";

const ShippingProviderContext = createContext();

export const ShippingProviderContextProvider = ({ children }) => {
  const [shippingState, dispatch] = useReducer(shippingProviderReducer, {
    loading: false,
    orders: [],
  });

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
  const {
    authState: { user, roles },
  } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const getOrdersByStatus = async (userId, status) => {
    if (!user?.id) return;

    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/get_shipping_provider_order?shippingProviderId=${userId}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_ALL_ORDERS, payload: response.data });
        return { success: true, data: response.data };
      }

      return { success: false, message: "Không thể lấy danh sách đơn hàng." };
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: error.response?.data?.message || "Đã xảy ra lỗi.",
      });
      return { success: false, message: error.message };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const changeOrderStatus = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/shipping_provider/change_order_status`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: "Cập nhật trạng thái thành công." };
      }

      return { success: false, message: "Không thể cập nhật trạng thái." };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.",
      };
    }
  };

  return (
    <ShippingProviderContext.Provider
      value={{
        shippingState,
        getOrdersByStatus,
        changeOrderStatus,
      }}
    >
      {children}
    </ShippingProviderContext.Provider>
  );
};

// Custom hook
export const useShippingProvider = () => useContext(ShippingProviderContext);
