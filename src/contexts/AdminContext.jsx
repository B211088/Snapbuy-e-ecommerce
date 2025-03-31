import { createContext, useContext, useEffect, useReducer } from "react";
import {
  ADD_ATTRIBUTE,
  ADD_CATEGORY,
  ADD_MULTIPLE_ATTRIBUTES,
  ADD_MULTIPLE_SUBCATEGORY_ATTRIBUTES,
  ADD_ONE_SUBCATEGORY_ATTRIBUTE,
  ADD_SUB_CATEGORY,
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  REMOVE_ATTRIBUTE,
  REMOVE_CATEGORY,
  REMOVE_SUB_CATEGORY,
  SET_ALL_ATTRIBUTES,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
  SET_ALL_SUBCATEGORY_ATTRIBUTES,
  UPDATE_ATTRIBUTE,
  UPDATE_CATEGORY,
  UPDATE_SUB_CATEGORY,
  UPDATE_SUBCATEGORY_ATTRIBUTES,
} from "./contants";

import axios from "axios";
import {
  attributeReducer,
  categoriesReducer,
  subcategoryAttributeReducer,
} from "../reducers/AdminReducer";
export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [categoriesState, categoryDispatch] = useReducer(categoriesReducer, {
    authLoading: true,
    categories: [],
    subcategories: [],
  });

  const [attributeState, attributeDispatch] = useReducer(attributeReducer, {
    attributes: [],
    attributeLoading: true,
  });

  const [subCategoryAttributeState, subCategoryAttributeDispatch] = useReducer(
    subcategoryAttributeReducer,
    {
      categoryAttributes: [],
      attributeLoading: true,
    }
  );

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/category/get_all_categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        categoryDispatch({
          type: SET_ALL_CATEGORIES,
          payload: response.data,
        });
        return { success: true, response: response };
      }

      return { success: false, message: response.message };
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
        categoryDispatch({ type: ADD_CATEGORY, payload: response.data });
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
        categoryDispatch({ type: UPDATE_CATEGORY, payload: response.data });
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
        categoryDispatch({ type: REMOVE_CATEGORY, payload: categoriesLv1Id });
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
        categoryDispatch({
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
        categoryDispatch({
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
        categoryDispatch({
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
        categoryDispatch({
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

  //attribute handle

  const getAllAttributes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/attribute`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      attributeDispatch({
        type: SET_ALL_ATTRIBUTES,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAttributes();
  }, []);

  const addAttribute = async (attribute) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/attribute/add_attribute`,
        attribute,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        attributeDispatch({
          type: ADD_ATTRIBUTE,
          payload: response.data,
        });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
    }
  };

  const addMultipleAttribute = async (attributes) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/attribute/add_multiple_attribute`,
        attributes,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        attributeDispatch({
          type: ADD_MULTIPLE_ATTRIBUTES,
          payload: response.data,
        });
        return { success: true, message: response.data };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
    }
  };

  const updateAttribute = async (attribute) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/attribute`,
        attribute,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        attributeDispatch({
          type: UPDATE_ATTRIBUTE,
          payload: response.data,
        });
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Đã xảy ra lỗi!",
      };
    }
  };

  const removeAttribute = async (attributeId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/attribute/${attributeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        attributeDispatch({
          type: REMOVE_ATTRIBUTE,
          payload: attributeId,
        });
        return { success: true, message: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
    }
  };

  const getAllSubcategoryAttributes = async (subcategoryId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/subcategory_attribute/${subcategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        subCategoryAttributeDispatch({
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

  const addOneSubcategoryAttribute = async (subcategoryId, attributeData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/subcategory_attribute/add_one`,
        attributeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        subCategoryAttributeDispatch({
          type: ADD_ONE_SUBCATEGORY_ATTRIBUTE,
          payload: { subcategory_id: subcategoryId, ...response.data },
        });
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Lỗi khi thêm thuộc tính!" };
    }
  };

  const addMultipleSubcategoryAttributes = async (
    subcategoryId,
    attributes
  ) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/subcategory_attribute/add_multiple/${subcategoryId}`,
        attributes,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        subCategoryAttributeDispatch({
          type: ADD_MULTIPLE_SUBCATEGORY_ATTRIBUTES,
          payload: {
            subcategory_id: subcategoryId,
            attributes: response.data.sub_attribute,
          },
        });

        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Lỗi khi thêm nhiều thuộc tính!" };
    }
  };

  const updateSubcategoryAttributes = async (
    subcategoryId,
    attributeId,
    newValue
  ) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/subcategory_attribute/${subcategoryId}`,
        {
          subcategory_id: subcategoryId,
          attribute_id: attributeId,
          attribute_value: newValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        subCategoryAttributeDispatch({
          type: UPDATE_SUBCATEGORY_ATTRIBUTES,
          payload: {
            subcategory_id: subcategoryId,
            attribute_id: attributeId,
            newValue,
          },
        });

        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Lỗi khi cập nhật thuộc tính!" };
    }
  };

  const adminContextData = {
    categoriesState,
    getAllCategories,
    addCategory,
    updateCategory,
    removeCategory,
    getSubCategories,
    addSubCategory,
    updateSubCategory,
    removeSubCategory,
    addAttribute,
    addMultipleAttribute,
    updateAttribute,
    removeAttribute,
    getAllAttributes,
    attributeState,
    subCategoryAttributeState,
    getAllSubcategoryAttributes,
    addOneSubcategoryAttribute,
    addMultipleSubcategoryAttributes,
    updateSubcategoryAttributes,
  };

  return (
    <AdminContext.Provider value={adminContextData}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminManager = () => useContext(AdminContext);
