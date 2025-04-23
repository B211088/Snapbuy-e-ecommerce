import {
  SET_ALL_CATEGORIES,
  SET_ALL_PRODUCTS,
  SET_ALL_SUB_CATEGORIES,
  SET_ALL_SUBCATEGORY_ATTRIBUTES,
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

export const subcategoryAttributeReducer = (state, action) => {
  switch (action.type) {
    case SET_ALL_SUBCATEGORY_ATTRIBUTES:
      return {
        ...state,
        categoryAttributes: action.payload.reduce((acc, attr) => {
          const { subcategory_id } = attr;
          if (!acc[subcategory_id]) {
            acc[subcategory_id] = [];
          }
          acc[subcategory_id].push(attr);
          return acc;
        }, {}),
        authLoading: true,
      };

    default:
      return state;
  }
};

export const productReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALL_PRODUCTS:
      return {
        ...state,
        products: payload,
      };

    default:
      return state;
  }
};
