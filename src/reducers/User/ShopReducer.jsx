import {
  CREATE_PRODUCT,
  SET_SHOP_INFO,
  UPDATE_SHOP_INFO,
} from "../../contexts/contants";

export const shopReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SHOP_INFO:
      return {
        ...state,
        shopLoading: false,
        statusShop: payload.statusShop,
        shopInfo: payload.shopInfo,
        products: payload.products || [],
      };
    case UPDATE_SHOP_INFO:
      return {
        ...state,
        shopInfo: {
          ...state.shopInfo,
          ...payload.shopInfo,
        },
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        products: Array.isArray(state.products)
          ? [...state.products, payload]
          : [payload],
      };
    default:
      return state;
  }
};
