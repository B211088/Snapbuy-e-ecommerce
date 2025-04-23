import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import {
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_ALL_CATEGORIES,
  SET_ALL_PRODUCTS,
  SET_ALL_SUB_CATEGORIES,
  SET_ALL_SUBCATEGORY_ATTRIBUTES,
} from "../contants";
import {
  categoriesReducer,
  productReducer,
  subcategoryAttributeReducer,
} from "../../reducers/Client/AppDataReducer";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [categoriesState, categoriesDispatch] = useReducer(categoriesReducer, {
    authLoading: false,
    categories: [],
    subcategories: [],
  });

  const [subCategoryAttributeState, attributesDispatch] = useReducer(
    subcategoryAttributeReducer,
    { authLoading: true, categoryAttributes: [], attributeLoading: true }
  );

  const [productsState, prroductsDispatch] = useReducer(productReducer, {
    authLoading: false,
    products: [],
    productLoading: true,
    product: {},
  });

  const getAllCategories = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/category/get_all_categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      categoriesDispatch({
        type: SET_ALL_CATEGORIES,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Fetch danh mục con theo categoryId
  const getSubCategories = async (CategoryId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/sub_category/${CategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        categoriesDispatch({
          type: SET_ALL_SUB_CATEGORIES,
          payload: { categoryId: CategoryId, data: response.data },
        });

        return { success: true, data: response.data };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getProductsByRating = async (pageNumber, QuantityItem) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/product/get_all_with_rating_order?page=${pageNumber}&limit=${QuantityItem}`
      );
      if (response.status >= 200 && response.status < 300) {
        prroductsDispatch({
          type: SET_ALL_PRODUCTS,
          payload: response.data,
        });

        return {
          success: true,
          data: response.data,
        };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  // Fetch thuộc tính của subcategory
  const getAllSubcategoryAttributes = async (subcategoryId) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/subcategory_attribute/${subcategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        attributesDispatch({
          type: SET_ALL_SUBCATEGORY_ATTRIBUTES,
          payload: response.data.sub_attribute,
        });
        return { success: true, data: response.data.sub_attribute };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getProductsByKeyword = async (keyword, page, limit) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/product/get_all_product_by_key_word?keyword=${keyword}&page=${page}&limit=${limit}`
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      console.log("Không tìm thấy sản phẩm");
      return { success: false, message: response.message };
    } catch (error) {
      console.log("Lỗi không thể tìm tháy sản phẩm");
      return { success: false, message: error.message };
    }
  };

  const getProductDetail = async (productId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/product/get_product_detail/${productId}`
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getProductFeedBack = async (productId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/feedback/get_all_feed_back/${productId}`
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const appDataContextValue = {
    categoriesState,
    subCategoryAttributeState,
    productsState,
    getAllCategories,
    getSubCategories,
    getAllSubcategoryAttributes,
    getProductsByKeyword,
    getProductsByRating,
    getProductDetail,
    getProductFeedBack,
  };

  return (
    <AppDataContext.Provider value={appDataContextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
