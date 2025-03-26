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
        products: [...state.products, payload],
      };
    default:
      return state;
  }
};
