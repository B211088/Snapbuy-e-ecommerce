import {
  SET_ALL_ORDERS,
  SET_ERROR,
  SET_LOADING,
  SET_SHIPPING_PROVIDER,
  UPDATE_ORDER_STATUS,
} from "../../contexts/contants";

export const shippingProviderReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LOADING:
      return { ...state, loading: payload };
    case SET_ERROR:
      return { ...state, loading: false };
    case SET_ALL_ORDERS:
      return { ...state, orders: payload };
    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === payload.orderId
            ? { ...order, status: payload.newStatus }
            : order
        ),
      };
    default:
      return state;
  }
};
