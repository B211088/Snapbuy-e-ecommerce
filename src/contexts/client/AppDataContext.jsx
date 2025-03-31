import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import {
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
  SET_ALL_SUBCATEGORY_ATTRIBUTES,
} from "../contants";
import {
  categoriesReducer,
  subcategoryAttributeReducer,
} from "../../reducers/Client/AppDataReducer";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [categoriesState, categoriesDispatch] = useReducer(categoriesReducer, {
    authLoading: true,
    categories: [],
    subcategories: [],
  });

  const [subCategoryAttributeState, attributesDispatch] = useReducer(
    subcategoryAttributeReducer,
    { authLoading: true, categoryAttributes: [], attributeLoading: true }
  );

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const getAllCategories = async () => {
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
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Fetch danh mục con theo categoryId
  const getSubCategories = async (CategoryId) => {
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

  // Fetch thuộc tính của subcategory
  const getAllSubcategoryAttributes = async (subcategoryId) => {
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
      return { success: false, message: "Lỗi khi lấy dữ liệu thuộc tính!" };
    }
  };

  const appDataContextValue = {
    categoriesState,
    subCategoryAttributeState,
    getAllCategories,
    getSubCategories,
    getAllSubcategoryAttributes,
  };

  return (
    <AppDataContext.Provider value={appDataContextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
