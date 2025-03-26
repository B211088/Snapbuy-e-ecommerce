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
import InfoShop from "../../components/Products/InfoShop";
const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [shopState, dispatch] = useReducer(shopReducer, {
    statusShop: "",
    shopLoading: false,
    shopInfo: null,
    products: null,
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

  const createProduct = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/product/create_product`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ tpye: CREATE_PRODUCT, payload: response.data });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const shopContextData = {
    loadShopInfo,
    shopState,
    createProduct,
  };

  return (
    <ShopContext.Provider value={shopContextData}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
