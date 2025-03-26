import { createContext, useContext, useEffect, useReducer } from "react";
import {
  ADD_CATEGORY,
  ADD_SUB_CATEGORY,
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  REMOVE_CATEGORY,
  REMOVE_SUB_CATEGORY,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
  UPDATE_CATEGORY,
  UPDATE_SUB_CATEGORY,
} from "./contants";
import { categoriesReducer } from "../reducers/CategoriesReducer";
import axios from "axios";
export const CategoriesContext = createContext();

export const CategoriesContextProvider = ({ children }) => {
  const [categoriesState, dispatch] = useReducer(categoriesReducer, {
    authLoading: true,
    categories: null,
    subcategories: [],
  });

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/category/get_all_categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({
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

  const addCategory = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/category/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: ADD_CATEGORY, payload: response.data });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCategory = async (categoryId, formData) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/category/${categoryId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: UPDATE_CATEGORY, payload: response.data });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeCategory = async (categoriesLv1Id) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/category/${categoriesLv1Id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: REMOVE_CATEGORY, payload: categoriesLv1Id });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const getSubCategories = async (CategoryId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/sub_category/${CategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({
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

  const addSubCategory = async (categoryId, formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/sub_category`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({
          type: ADD_SUB_CATEGORY,
          payload: { ...response.data, categoryId },
        });
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateSubCategory = async (subCategoryId, formData, categoryId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/sub_category/${subCategoryId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        dispatch({
          type: UPDATE_SUB_CATEGORY,
          payload: { ...response.data, id: subCategoryId, categoryId },
        });

        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.data.message || "Cập nhật thất bại",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const removeSubCategory = async (subCategoryId, categoryId) => {
    console.log("subCategoryId", subCategoryId);
    console.log("categoryId", categoryId);
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/sub_category/${subCategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({
          type: REMOVE_SUB_CATEGORY,
          payload: { categoryId, subCategoryId },
        });

        return { success: true, message: "Xóa phân loại thành công" };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const categoriesContextData = {
    categoriesState,
    getAllCategories,
    addCategory,
    updateCategory,
    removeCategory,
    getSubCategories,
    addSubCategory,
    updateSubCategory,
    removeSubCategory,
  };

  return (
    <CategoriesContext.Provider value={categoriesContextData}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
