import axios from "axios";
import { createContext, useReducer, useEffect, useContext } from "react";
import {
  authReducer,
  cartReducer,
  ordersReducer,
} from "../../reducers/User/AuthReducer";
import setAuthToken from "../../utils/User/setAuthToken";
import {
  apiUrl,
  CANCLE_ORDER,
  LOCAL_STORAGE_TOKEN_NAME,
  LOCAL_STORAGE_USER,
  SET_ADDRESSES,
  SET_ALL_CART,
  SET_AUTH,
  SET_AUTH_LOADING,
  SET_AVATAR,
  SET_ROLE,
  UPDATE_AUTH,
} from "../../contexts/contants";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
    roles: null,
    addresses: [],
  });

  const [cartState, cartDispatch] = useReducer(cartReducer, {
    authLoading: true,
    carts: [],
  });

  const [ordersState, orderDispatch] = useReducer(ordersReducer, {
    orders: [],
  });

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const loadUser = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    if (!token) {
      authDispatch({
        type: SET_AUTH,
        payload: { isAuthenticated: false, user: null },
      });
      localStorage.removeItem("userId");
      return;
    }

    setAuthToken(token);

    try {
      const userId = localStorage.getItem(LOCAL_STORAGE_USER);
      const response = await axios.get(
        `${apiUrl}/api/v1/user/get_user_info/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const userData = response.data;
        authDispatch({
          type: SET_AUTH,
          payload: { isAuthenticated: true, user: userData },
        });
        authDispatch({
          type: SET_ROLE,
          payload: userData.roles,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      authDispatch({
        type: SET_AUTH,
        payload: { isAuthenticated: false, user: null },
      });
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/login`,
        userForm
      );

      if (response.status >= 200 && response.status < 300) {
        const userData = response.data;
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.token);
        localStorage.setItem(LOCAL_STORAGE_USER, response.data.user.id);
        setAuthToken(response.data.token);
        authDispatch({
          type: SET_AUTH,
          payload: { isAuthenticated: true, user: userData },
        });
        authDispatch({
          type: SET_ROLE,
          payload: userData.roles,
        });
        authDispatch({ type: SET_AUTH_LOADING, payload: false });
        await loadUser();
        return { success: true, message: response.data };
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const fetchAddress = async (userId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_village/get_all_address/${userId} `,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        authDispatch({
          type: SET_ADDRESSES,
          payload: response.data.addressResponses,
        });
        return { success: true, data: response.data.addressResponses };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  useEffect(() => {
    const fectchAuth = async () => {
      try {
        const response = await loadUser();
        if (response.success) {
          await getCart(response.data.id);
          await fetchAddress(response.data.id);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fectchAuth();
  }, []);

  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        userForm
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    localStorage.removeItem("user");
    setAuthToken(null);
    authDispatch({
      type: SET_AUTH,
      payload: { isAuthenticated: false, user: null },
    });
    authDispatch({ type: SET_ROLE, payload: null });
  };

  const updateUserInfo = async (userId, updatedData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      if (!token) return { success: false, message: "Bạn chưa đăng nhập" };

      const response = await axios.put(
        `${apiUrl}/api/v1/user/update_user_info/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const updatedUser = response.data;

        authDispatch({ type: UPDATE_AUTH, payload: updatedUser });
        return {
          success: true,
          data: updatedUser,
          message: "Cập nhật thông tin người dùng thành công",
        };
      } else {
        throw new Error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    } finally {
      authDispatch({ type: SET_AUTH_LOADING, payload: false });
    }
  };

  const registerShop = async (userId, formRegisterData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/shop/register/${userId}`,
        formRegisterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        authDispatch({ type: SET_ROLE, payload: ["user", "shop"] });
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    } finally {
      authDispatch({ type: SET_AUTH_LOADING, payload: false });
    }
  };

  const sendCodeToEmail = async (userId, email) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_code/send_code?userId=${userId}&email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response };
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const confirmEmail = async (userId, payload) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user_code/user/confirm_code/${userId}`,
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const uploadAvatar = async (userId, imageFile) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      authDispatch({ type: SET_AUTH_LOADING, payload: true });

      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(
        `${apiUrl}/api/v1/user/update_avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        authDispatch({ type: SET_AVATAR, payload: response.data.avatar_url });
        return { success: true, data: response.data };
      } else {
        throw new Error("Cập nhật ảnh đại diện thất bại");
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    } finally {
      authDispatch({ type: SET_AUTH_LOADING, payload: false });
    }
  };

  const sendMailForRegister = async (email) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_code/send_code?email=${email}`
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const confirmCodeMailForRegister = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user_code/confirm_code`,
        formData
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const placeOrder = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(`${apiUrl}/api/v1/order`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const cancelOrder = async (userId, orderId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/cancel_order?userId=${userId}&orderId=${orderId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        orderDispatch({ type: CANCLE_ORDER, payload: { orderId } });
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const getCart = async (userId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(`${apiUrl}/api/v1/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      cartDispatch({ type: SET_ALL_CART, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const addProductToCart = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/cart/add_product_to_cart`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        await getCart(authState?.user?.id);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const deleteProductFromCart = async (userId, cartItemId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/cart?userId=${userId}&cartItemId=${cartItemId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        await getCart(authState?.user?.id);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const getOrders = async (userId, status) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/order/get_order_by_user_id_and_status?userId=${userId}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const createFeedBack = async (formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/feedback/create_feedback`,
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
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const updateFeedBack = async (userId, formData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.put(
        `${apiUrl}http://localhost:8080/api/v1/feedback/update_feedback/${userId}`,
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
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  useEffect;

  const authContextData = {
    authState,
    cartState,
    ordersState,
    loadUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserInfo,
    registerShop,
    sendCodeToEmail,
    confirmEmail,
    uploadAvatar,
    sendMailForRegister,
    confirmCodeMailForRegister,
    addProductToCart,
    placeOrder,
    getCart,
    getOrders,
    deleteProductFromCart,
    cancelOrder,
    createFeedBack,
    updateFeedBack,
    fetchAddress,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
