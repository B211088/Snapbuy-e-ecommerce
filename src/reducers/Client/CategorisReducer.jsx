import {
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
} from "../../contexts/contants";

export const categoriesReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALL_CATEGORIES:
      return {
        ...state,
        authLoading: false,
        categories: payload,
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

    default:
      return state;
  }
};
