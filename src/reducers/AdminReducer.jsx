import {
  ADD_ATTRIBUTE,
  ADD_CATEGORY,
  ADD_MULTIPLE_ATTRIBUTES,
  ADD_MULTIPLE_SUBCATEGORY_ATTRIBUTES,
  ADD_ONE_SUBCATEGORY_ATTRIBUTE,
  ADD_SUB_CATEGORY,
  REMOVE_ATTRIBUTE,
  REMOVE_CATEGORY,
  REMOVE_SUB_CATEGORY,
  REMOVE_SUBCATEGORY_ATTRIBUTE,
  SET_ALL_ATTRIBUTES,
  SET_ALL_CATEGORIES,
  SET_ALL_SUB_CATEGORIES,
  SET_ALL_SUBCATEGORY_ATTRIBUTES,
  SET_AUTH_ADMIN,
  UPDATE_ATTRIBUTE,
  UPDATE_CATEGORY,
  UPDATE_SUB_CATEGORY,
  UPDATE_SUBCATEGORY_ATTRIBUTES,
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

export const attributeReducer = (state, action) => {
  switch (action.type) {
    case SET_ALL_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
        attributeLoading: false,
      };

    case ADD_ATTRIBUTE:
      return {
        ...state,
        attributes: [...state.attributes, action.payload],
      };

    case ADD_MULTIPLE_ATTRIBUTES:
      return {
        ...state,
        attributes: [...state.attributes, ...action.payload],
      };

    case UPDATE_ATTRIBUTE:
      return {
        ...state,
        attributes: state.attributes.map((attr) =>
          attr.id === action.payload.id ? action.payload : attr
        ),
      };

    case REMOVE_ATTRIBUTE:
      return {
        ...state,
        attributes: state.attributes.filter(
          (attr) => attr.id !== action.payload
        ),
      };

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
        attributeLoading: false,
      };

    case ADD_ONE_SUBCATEGORY_ATTRIBUTE: {
      const { subcategory_id } = action.payload;
      return {
        ...state,
        categoryAttributes: {
          ...state.categoryAttributes,
          [subcategory_id]: [
            ...(state.categoryAttributes[subcategory_id] || []),
            action.payload,
          ],
        },
      };
    }

    case ADD_MULTIPLE_SUBCATEGORY_ATTRIBUTES: {
      const { subcategory_id, attributes } = action.payload;
      return {
        ...state,
        categoryAttributes: {
          ...state.categoryAttributes,
          [subcategory_id]: [
            ...(state.categoryAttributes[subcategory_id] || []),
            ...attributes,
          ],
        },
      };
    }

    case UPDATE_SUBCATEGORY_ATTRIBUTES: {
      const { subcategory_id, attribute_id, newValue } = action.payload;
      return {
        ...state,
        categoryAttributes: {
          ...state.categoryAttributes,
          [subcategory_id]: state.categoryAttributes[subcategory_id]?.map(
            (attr) =>
              attr.attribute_id === attribute_id
                ? { ...attr, attribute_value: newValue }
                : attr
          ),
        },
      };
    }

    case REMOVE_SUBCATEGORY_ATTRIBUTE: {
      const { subcategory_id, attribute_id } = action.payload;
      return {
        ...state,
        categoryAttributes: {
          ...state.categoryAttributes,
          [subcategory_id]: state.categoryAttributes[subcategory_id]?.filter(
            (attr) => attr.attribute_id !== attribute_id
          ),
        },
      };
    }

    default:
      return state;
  }
};
