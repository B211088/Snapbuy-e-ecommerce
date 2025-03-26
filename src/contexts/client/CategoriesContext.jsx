import { createContext, useContext, useEffect, useReducer } from "react";
import {
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
} from "../contants";
import { categoriesReducer } from "../../reducers/Client/CategorisReducer";
import axios from "axios";

export const categoriesContext = createContext();

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

  const adminContextData = {
    categoriesState,
    getAllCategories,
    getSubCategories,
  };

  return (
    <categoriesContext.Provider value={adminContextData}>
      {children}
    </categoriesContext.Provider>
  );
};

export const useCategories = () => useContext(categoriesContext);
