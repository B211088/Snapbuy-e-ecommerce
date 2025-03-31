import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";
import { shopReducer } from "../../reducers/User/ShopReducer";
import {
  apiUrl,
  CREATE_PRODUCT,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_SHOP_INFO,
} from "../contants";
import setAuthToken from "../../utils/User/setAuthToken";

import { useAuth } from "./AuthContext";

const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [shopState, dispatch] = useReducer(shopReducer, {
    statusShop: "",
    shopLoading: false,
    shopInfo: null,
    products: [],
  });

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
  const {
    authState: { user, roles },
  } = useAuth();

  const loadShopInfo = async () => {
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
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: SET_SHOP_INFO,
          payload: {
            statusShop: response.data.status,
            shopInfo: response.data,
          },
        });
      }

      return response.data;
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
    if (user) {
      loadShopInfo();
    }
  }, [user]);

  const createProduct = async (shopId, formData) => {
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

  const addInfoProductsSeller = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product_category/add_multiple`,
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

  const shopContextData = {
    shopState,
    loadShopInfo,
    createProduct,
    addMultipleAttributes,
    addInfoProductsSeller,
  };

  return (
    <ShopContext.Provider value={shopContextData}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
