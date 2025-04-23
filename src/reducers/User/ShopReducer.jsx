import {
  ADD_VOUCHER_SUCCESS,
  CREATE_PRODUCT,
  DELETE_VOUCHER_SUCCESS,
  GET_VOUCHERS_SUCCESS,
  SET_ERROR,
  SET_LOADING,
  SET_SELECTED_VOUCHER,
  SET_SHIPPING_PROVIDER,
  SET_SHOP_INFO,
  UPDATE_SHOP_INFO,
  UPDATE_VOUCHER_SUCCESS,
} from "../../contexts/contants";

export const shopReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SHOP_INFO:
      return {
        ...state,
        loading: false,
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

    case SET_LOADING:
      return { ...state, loading: true, error: null };

    case GET_VOUCHERS_SUCCESS:
      return {
        ...state,
        vouchers: payload,
        loading: false,
        error: null,
      };

    case ADD_VOUCHER_SUCCESS:
      return {
        ...state,
        vouchers: [...state.vouchers, payload],
        loading: false,
        error: null,
      };

    case UPDATE_VOUCHER_SUCCESS:
      return {
        ...state,
        vouchers: state.vouchers.map((voucher) =>
          voucher.id === payload.id ? payload : voucher
        ),
        loading: false,
        error: null,
      };

    case DELETE_VOUCHER_SUCCESS:
      return {
        ...state,
        vouchers: state.vouchers.filter((voucher) => voucher.id !== payload),
        loading: false,
        error: null,
      };

    case SET_SELECTED_VOUCHER:
      return {
        ...state,
        selectedVoucher: payload,
        loading: false,
        error: null,
      };

    case SET_SHIPPING_PROVIDER:
      return {
        ...state,
        shippingProviders: payload,
      };

    case SET_ERROR:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
};
