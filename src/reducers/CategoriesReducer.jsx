import {
  ADD_CATEGORY,
  ADD_SUB_CATEGORY,
  REMOVE_CATEGORY,
  REMOVE_SUB_CATEGORY,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
  SET_AUTH_ADMIN,
  UPDATE_CATEGORY,
  UPDATE_SUB_CATEGORY,
} from "../contexts/contants";

export const categoriesReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_AUTH_ADMIN:
      return {
        ...state,
        authLoading: false,
        admin: payload,
      };

    case SET_ALL_CATEGORIES:
      return {
        ...state,
        authLoading: false,
        categories: payload,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, payload],
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.id === payload.id) {
            return { ...payload };
          }
          return category;
        }),
      };

    case REMOVE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== payload),
      };

    case SET_ALL_SUB_CATEGORIES: {
      const existIndex = state.subcategories.findIndex(
        (item) => item.categoryId === payload.categoryId
      );

      if (existIndex !== -1) {
        return {
          ...state,
          authLoading: false,
          subcategories: state.subcategories.map((item, index) =>
            index === existIndex ? payload : item
          ),
        };
      } else {
        return {
          ...state,
          authLoading: false,
          subcategories: [...state.subcategories, payload],
        };
      }
    }

    case ADD_SUB_CATEGORY: {
      const existIndex = state.subcategories.findIndex(
        (group) => group.categoryId === payload.categoryId
      );

      if (existIndex !== -1) {
        const updatedSubcategories = [...state.subcategories];
        updatedSubcategories[existIndex] = {
          ...updatedSubcategories[existIndex],
          data: [...updatedSubcategories[existIndex].data, payload],
        };

        return {
          ...state,
          subcategories: updatedSubcategories,
        };
      } else {
        return {
          ...state,
          subcategories: [
            ...state.subcategories,
            { categoryId: payload.categoryId, data: [payload] },
          ],
        };
      }
    }

    case UPDATE_SUB_CATEGORY:
      return {
        ...state,
        subcategories: state.subcategories.map((subcategoryGroup) => {
          if (subcategoryGroup.categoryId === payload.categoryId) {
            return {
              ...subcategoryGroup,
              data: subcategoryGroup.data.map((sub) =>
                sub.id === payload.id ? { ...payload } : sub
              ),
            };
          }
          return subcategoryGroup;
        }),
      };

    case REMOVE_SUB_CATEGORY:
      return {
        ...state,
        subcategories: state.subcategories.map((subcategoryGroup) => {
          if (subcategoryGroup.categoryId === payload.categoryId) {
            return {
              ...subcategoryGroup,
              data: subcategoryGroup.data.filter(
                (sub) => sub.id !== payload.subCategoryId
              ),
            };
          }
          return subcategoryGroup;
        }),
      };

    default:
      return state;
  }
};
